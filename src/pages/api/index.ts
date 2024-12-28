import { Router } from 'express';
import { authMiddleware } from './middleware/auth';
import { projectRoutes } from './routes/projects';
import { companyRoutes } from './routes/companies';
import { userRoutes } from './routes/users';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Mount route groups
router.use('/projects', projectRoutes);
router.use('/companies', companyRoutes);
router.use('/users', userRoutes);

export default router;