import { Request, Response, NextFunction } from 'express';
import { projectsService } from './projects.service.js';

export class ProjectsController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectsService.findAll(req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectsService.findById(req.params.id);
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectsService.create(req.body, req.user?.userId);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectsService.update(
        req.params.id,
        req.body,
        req.user?.userId
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectsService.delete(req.params.id, req.user?.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await projectsService.archive(
        req.params.id,
        req.user?.userId
      );
      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async bulkAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids, action } = req.body;
      const result = await projectsService.bulkAction(ids, action, req.user?.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFilterOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const options = await projectsService.getFilterOptions();
      res.json(options);
    } catch (error) {
      next(error);
    }
  }
}

export const projectsController = new ProjectsController();
