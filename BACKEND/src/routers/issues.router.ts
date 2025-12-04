import { Router } from 'express';
import { IssuesController } from '../controllers/issues.controller';

const issuesRouter = Router();
const controller = new IssuesController();

issuesRouter.post('/createIssue', controller.createIssue);
issuesRouter.get('/getAllIssues', controller.getAllIssues);
issuesRouter.post('/createResponse', controller.createResponse);

export default issuesRouter;