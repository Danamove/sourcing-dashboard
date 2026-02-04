import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service.js';

export class AnalyticsController {
  async getOverviewStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getOverviewStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsByModel(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getProjectsByModel();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getProjectsByGroup();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsBySourcer(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getProjectsBySourcer();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsByStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getProjectsByStatus();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getRecentProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const projects = await analyticsService.getRecentProjects(limit);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getProjectsTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const data = await analyticsService.getProjectsTimeline(months);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getClientStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getClientStats();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getSourcersLackingHours(req: Request, res: Response, next: NextFunction) {
    try {
      const minHours = parseInt(req.query.minHours as string) || 200;
      const data = await analyticsService.getSourcersLackingHours(minHours);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async exportCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          filters[key] = value;
        }
      }
      const csv = await analyticsService.exportProjectsCSV(filters);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="projects_export.csv"'
      );
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
