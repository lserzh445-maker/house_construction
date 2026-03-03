import { Router, Request, Response } from 'express'
import { z } from 'zod'

const router = Router()

const calculateSchema = z.object({
  projectId: z.string().optional(),
  area: z.number().min(20).max(1000).optional(),
  configuration: z.enum(['base', 'finishing', 'turnkey']),
  options: z.array(z.enum(['delivery', 'foundation', 'utilities', 'insurance'])).default([]),
})

const PRICE_PER_SQM = 62000 // RUB/m²
const CONFIGURATION_MULTIPLIERS = { base: 1, finishing: 1.2, turnkey: 1.4 }
const OPTION_PRICES: Record<string, number> = {
  delivery: 50000,
  foundation: 100000,
  utilities: 80000,
}

// POST /api/calculator/calculate
router.post('/calculate', (req: Request, res: Response) => {
  const data = calculateSchema.parse(req.body)
  const area = data.area ?? 80

  const baseTotal = PRICE_PER_SQM * area * CONFIGURATION_MULTIPLIERS[data.configuration]

  const optionsTotal = data.options.reduce((sum, opt) => {
    if (opt === 'insurance') return sum + baseTotal * 0.03
    return sum + (OPTION_PRICES[opt] ?? 0)
  }, 0)

  const total = baseTotal + optionsTotal
  const monthlyPayment = Math.round(total / 240) // 20-year mortgage estimate

  const breakdown = {
    materials: Math.round(baseTotal * 0.55),
    labor: Math.round(baseTotal * 0.35),
    overhead: Math.round(baseTotal * 0.1),
    options: Math.round(optionsTotal),
  }

  res.json({
    data: {
      area,
      configuration: data.configuration,
      options: data.options,
      breakdown,
      baseTotal: Math.round(baseTotal),
      optionsTotal: Math.round(optionsTotal),
      total: Math.round(total),
      monthlyPayment,
    },
  })
})

export default router
