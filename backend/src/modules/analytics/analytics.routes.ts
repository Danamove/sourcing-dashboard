import { Router } from 'express';
import { analyticsController } from './analytics.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/overview', (req, res, next) =>
  analyticsController.getOverviewStats(req, res, next)
);

router.get('/by-model', (req, res, next) =>
  analyticsController.getProjectsByModel(req, res, next)
);

router.get('/by-group', (req, res, next) =>
  analyticsController.getProjectsByGroup(req, res, next)
);

router.get('/by-sourcer', (req, res, next) =>
  analyticsController.getProjectsBySourcer(req, res, next)
);

router.get('/by-status', (req, res, next) =>
  analyticsController.getProjectsByStatus(req, res, next)
);

router.get('/recent', (req, res, next) =>
  analyticsController.getRecentProjects(req, res, next)
);

router.get('/timeline', (req, res, next) =>
  analyticsController.getProjectsTimeline(req, res, next)
);

router.get('/clients', (req, res, next) =>
  analyticsController.getClientStats(req, res, next)
);

router.get('/lacking-hours', (req, res, next) =>
  analyticsController.getSourcersLackingHours(req, res, next)
);

router.get('/export', (req, res, next) =>
  analyticsController.exportCSV(req, res, next)
);

export default router;
