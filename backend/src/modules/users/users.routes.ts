import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate, authorize } from '../../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('admin'), (req, res, next) =>
  usersController.findAll(req, res, next)
);

router.get('/:id', authorize('admin'), (req, res, next) =>
  usersController.findById(req, res, next)
);

router.post('/', authorize('admin'), (req, res, next) =>
  usersController.create(req, res, next)
);

router.put('/:id', authorize('admin'), (req, res, next) =>
  usersController.update(req, res, next)
);

router.delete('/:id', authorize('admin'), (req, res, next) =>
  usersController.delete(req, res, next)
);

// Users can update their own password
router.post('/:id/password', (req, res, next) =>
  usersController.updatePassword(req, res, next)
);

export default router;
