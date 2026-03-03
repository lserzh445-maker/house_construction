import { Router } from 'express'
import projectsRouter from './projects'
import contactsRouter from './contacts'
import reviewsRouter from './reviews'
import blogRouter from './blog'
import calculatorRouter from './calculator'

const router = Router()

router.use('/projects', projectsRouter)
router.use('/contacts', contactsRouter)
router.use('/reviews', reviewsRouter)
router.use('/blog', blogRouter)
router.use('/calculator', calculatorRouter)

export default router
