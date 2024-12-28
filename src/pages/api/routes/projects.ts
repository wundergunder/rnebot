import { Router } from 'express';
import { getProjects, createProject } from '../controllers/projects';

const router = Router();

router.get('/', getProjects);
router.post('/', createProject);

export const projectRoutes = router;