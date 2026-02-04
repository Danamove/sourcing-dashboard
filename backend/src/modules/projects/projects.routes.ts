import { Router } from 'express';
import { projectsController } from './projects.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import {
  createProjectSchema,
  updateProjectSchema,
  filterProjectsSchema,
  bulkActionSchema,
} from './projects.schema.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /projects - List all projects with filtering
router.get('/', validate(filterProjectsSchema), (req, res, next) =>
  projectsController.findAll(req, res, next)
);

// GET /projects/filter-options - Get available filter options
router.get('/filter-options', (req, res, next) =>
  projectsController.getFilterOptions(req, res, next)
);

// GET /projects/:id - Get single project
router.get('/:id', (req, res, next) =>
  projectsController.findById(req, res, next)
);

// POST /projects - Create new project
router.post('/', validate(createProjectSchema), (req, res, next) =>
  projectsController.create(req, res, next)
);

// PUT /projects/:id - Update project
router.put('/:id', validate(updateProjectSchema), (req, res, next) =>
  projectsController.update(req, res, next)
);

// DELETE /projects/:id - Delete project
router.delete('/:id', authorize('admin', 'manager'), (req, res, next) =>
  projectsController.delete(req, res, next)
);

// POST /projects/:id/archive - Archive project
router.post('/:id/archive', (req, res, next) =>
  projectsController.archive(req, res, next)
);

// POST /projects/bulk - Bulk actions
router.post(
  '/bulk',
  authorize('admin', 'manager'),
  validate(bulkActionSchema),
  (req, res, next) => projectsController.bulkAction(req, res, next)
);

export default router;
