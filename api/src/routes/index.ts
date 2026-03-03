import { Router } from 'express'
import projectsRouter    from './projects'
import formsRouter       from './forms'
import contactsRouter    from './contacts'  // legacy — keep for backward compat
import reviewsRouter     from './reviews'
import blogRouter        from './blog'
import calculatorRouter  from './calculator'

const router = Router()

router.use('/projects',   projectsRouter)
router.use('/forms',      formsRouter)      // new spec-aligned endpoints
router.use('/contacts',   contactsRouter)   // legacy, kept for backward compat
router.use('/reviews',    reviewsRouter)
router.use('/blog',       blogRouter)
router.use('/calculator', calculatorRouter)

export default router
