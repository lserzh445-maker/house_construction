/**
 * POST /api/calculator
 *
 * Calculates house price based on project or area, completion type, and options.
 * Returns a full price breakdown suitable for the frontend calculator UI.
 */

import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { projectsRepo } from '../db/repository'
import { generateQuotePDFServer, CalculatorData } from '../lib/generate-quote-pdf-server'

const router = Router()

// ─── Constants ────────────────────────────────────────────────────────────────

/** Base price per m² without any finishing (RUB) */
const BASE_PRICE_PER_SQM = 96_000 // ~62k materials + 34k labor + 14k overhead (per sqm)

const COMPLETION_MULTIPLIERS: Record<string, number> = {
  base:      1.00,   // structural only
  finishing: 1.22,   // + interior/exterior finish
  turnkey:   1.42,   // fully ready to move in
}

const OPTION_PRICES: Record<string, number> = {
  delivery:   55_000,   // delivery to site (avg)
  foundation: 120_000,  // foundation works
  utilities:  90_000,   // plumbing + electrical connect
  insurance:  0,        // calculated as % of total below
}

const INSURANCE_RATE = 0.03 // 3% of construction total

/** Mortgage estimate: 20-year term, 6% annual rate */
const MORTGAGE_MONTHS  = 240
const MORTGAGE_RATE    = 0.06 / 12 // monthly rate

function monthlyMortgagePayment(principal: number): number {
  const r = MORTGAGE_RATE
  return Math.round((principal * r * Math.pow(1 + r, MORTGAGE_MONTHS)) /
    (Math.pow(1 + r, MORTGAGE_MONTHS) - 1))
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const calcSchema = z.object({
  project_id: z.string().optional(),
  area:       z.coerce.number().min(20, 'Площадь должна быть не менее 20 м²').max(1000).optional(),
  completion_type: z.enum(['base', 'finishing', 'turnkey'], {
    errorMap: () => ({ message: 'completion_type must be: base | finishing | turnkey' }),
  }),
  options: z
    .array(z.enum(['delivery', 'foundation', 'utilities', 'insurance']))
    .default([]),
})

// ─── POST /api/calculator ─────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  const body = calcSchema.parse(req.body)

  // Resolve base price from project or from area
  let area         = body.area ?? 80
  let projectName  = 'Собственный расчёт'
  let projectBase  = 0 // override if project found

  if (body.project_id) {
    const project = await projectsRepo.findUnique(body.project_id)
    if (project) {
      area        = project.characteristics.area
      projectName = project.name
      projectBase = project.price.basePrice // use the exact project base price
    }
  }

  // Base construction cost (before options)
  const multiplier    = COMPLETION_MULTIPLIERS[body.completion_type] ?? 1
  const constructBase = projectBase > 0
    ? Math.round(projectBase * multiplier)
    : Math.round(BASE_PRICE_PER_SQM * area * multiplier)

  // Break down construction cost into line items
  const materials = Math.round(constructBase * 0.57)
  const labor     = Math.round(constructBase * 0.33)
  const overhead  = constructBase - materials - labor

  // Options
  let optionsTotal = 0
  const optionLines: Record<string, number> = {}

  for (const opt of body.options) {
    let price = OPTION_PRICES[opt] ?? 0
    if (opt === 'insurance') price = Math.round(constructBase * INSURANCE_RATE)
    optionsTotal += price
    optionLines[opt] = price
  }

  const total          = constructBase + optionsTotal
  const monthly        = monthlyMortgagePayment(total)
  const pricePerSqm    = Math.round(total / area)

  res.json({
    data: {
      project_id:      body.project_id ?? null,
      project_name:    projectName,
      area,
      completion_type: body.completion_type,
      options:         body.options,

      price_breakdown: {
        materials,
        labor,
        overhead,
        options: optionLines,
      },

      construct_subtotal: constructBase,
      options_total:      optionsTotal,
      total,
      price_per_sqm:      pricePerSqm,
      monthly_payment:    monthly,

      // Mortgage assumptions shown to the client
      mortgage_info: {
        term_years: 20,
        rate_pct:   6,
        note:       'Расчёт ориентировочный. Точная ставка зависит от банка и программы.',
      },
    },
  })
})

// ─── Zod schema for CalculatorData (frontend format, camelCase) ───────────────

const quoteSchema = z.object({
  projectId:      z.string().default(''),
  projectName:    z.string().min(1),
  projectArea:    z.number().positive(),
  completionType: z.enum(['base', 'finishing', 'turnkey']),
  selectedOptions: z.array(z.string()).default([]),
  priceBreakdown: z.object({
    materials:  z.number(),
    labor:      z.number(),
    overhead:   z.number(),
    delivery:   z.number().optional(),
    foundation: z.number().optional(),
    utilities:  z.number().optional(),
    insurance:  z.number().optional(),
  }),
  totalPrice:     z.number().positive(),
  monthlyPayment: z.number().positive(),
  generatedAt:    z.string().or(z.date()).default(() => new Date().toISOString()),
})

// ─── POST /api/calculator/generate-quote ─────────────────────────────────────
// Accepts the frontend CalculatorData (camelCase) and returns a PDF file.

router.post('/generate-quote', async (req: Request, res: Response) => {
  try {
    const body = quoteSchema.parse(req.body)
    const data: CalculatorData = { ...body, generatedAt: new Date(body.generatedAt as string) }

    const pdfBuffer = await generateQuotePDFServer(data)

    const safeName = data.projectName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_А-яЁё-]/g, '')
    const dateStr  = new Date().toISOString().split('T')[0]

    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="smeta_${safeName}_${dateStr}.pdf"`,
      'Content-Length':      String(pdfBuffer.length),
    })
    res.send(pdfBuffer)
  } catch (error) {
    console.error('[Calculator/generate-quote] Error:', error)
    res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid request' })
  }
})

export default router
