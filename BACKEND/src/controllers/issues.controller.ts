import { Request, Response } from 'express';
import { IssuesService } from '../services/issues.service';

const issuesService = new IssuesService();

export class IssuesController {
  async createIssue(req: Request, res: Response) {
    try {
      const result = await issuesService.createIssue(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create issue' });
    }
  }

  async getAllIssues(req: Request, res: Response) {
    try {
      const result = await issuesService.getAllIssues();
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch issues' });
    }
  }

  async createResponse(req: Request, res: Response) {
    try {
      const result = await issuesService.createResponse(req.body);
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: (error as Error).message || 'Failed to add response' });
    }
  }
}