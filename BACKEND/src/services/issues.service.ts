import mssql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import { Issue, IssueResponse } from '../models/issues.interface';
import { sqlconfig } from '../config/sql.config';
import { userService } from './user.service';

export class IssuesService {
  private userService = new userService(); // Instantiate UserService

  async createIssue(issue: Omit<Issue, 'issue_id' | 'created_at' | 'responses'>): Promise<{ message: string }> {
    let pool = await mssql.connect(sqlconfig);
    const issueId = uuidv4();

    const result = await pool.request()
      .input('issue_id', mssql.VarChar(255), issueId)
      .input('user_id', mssql.VarChar(255), issue.user_id)
      .input('event_id', mssql.VarChar(255), issue.event_id || null)
      .input('title', mssql.NVarChar(100), issue.title)
      .input('description', mssql.NVarChar(500), issue.description)
      .query('INSERT INTO Issues (issue_id, user_id, event_id, title, description) VALUES (@issue_id, @user_id, @event_id, @title, @description)');

    if (result.rowsAffected[0] === 1) {
      return { message: 'Issue created successfully' };
    } else {
      throw new Error('Error creating issue');
    }
  }

  async getAllIssues(): Promise<{ issues: Issue[] }> {
    let pool = await mssql.connect(sqlconfig);
    const result = await pool.request().query(`
      SELECT i.*, r.response_id, r.admin_id, r.response_text, r.created_at AS response_created_at
      FROM Issues i
      LEFT JOIN IssueResponses r ON i.issue_id = r.issue_id
      ORDER BY i.created_at DESC
    `);

    const issuesMap: { [key: string]: Issue } = {};
    result.recordset.forEach(row => {
      if (!issuesMap[row.issue_id]) {
        issuesMap[row.issue_id] = {
          issue_id: row.issue_id,
          user_id: row.user_id,
          event_id: row.event_id,
          title: row.title,
          description: row.description,
          created_at: row.created_at,
          responses: []
        };
      }
      if (row.response_id) {
        issuesMap[row.issue_id].responses!.push({
          response_id: row.response_id,
          issue_id: row.issue_id,
          admin_id: row.admin_id,
          response_text: row.response_text,
          created_at: row.response_created_at
        });
      }
    });

    return { issues: Object.values(issuesMap) };
  }

  async createResponse(response: Omit<IssueResponse, 'response_id' | 'created_at'>): Promise<{ message: string }> {
    // Check if the user is an admin
    const userResult = await this.userService.fetchSingleUser(response.admin_id);
    if ('error' in userResult) {
      throw new Error('Admin not found');
    }
    if (userResult.user.role !== 'admin') {
      throw new Error('Only admins can respond to issues');
    }

    let pool = await mssql.connect(sqlconfig);
    const responseId = uuidv4();

    const result = await pool.request()
      .input('response_id', mssql.VarChar(255), responseId)
      .input('issue_id', mssql.VarChar(255), response.issue_id)
      .input('admin_id', mssql.VarChar(255), response.admin_id)
      .input('response_text', mssql.NVarChar(500), response.response_text)
      .query('INSERT INTO IssueResponses (response_id, issue_id, admin_id, response_text) VALUES (@response_id, @issue_id, @admin_id, @response_text)');

    if (result.rowsAffected[0] === 1) {
      return { message: 'Response added successfully' };
    } else {
      throw new Error('Error adding response');
    }
  }
}