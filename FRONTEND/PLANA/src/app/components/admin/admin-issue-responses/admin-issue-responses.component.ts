import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../../services/issues.service';
import { Issue } from '../../interfaces/issues';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-issue-responses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-issue-responses.component.html',
  styleUrl: './admin-issue-responses.component.css'
})
export class AdminIssueResponsesComponent implements OnInit {
  issues: Issue[] = [];
  newResponse: { [key: string]: string } = {};
  message: string = '';
  error: string = '';

  constructor(private issuesService: IssuesService) {}

  ngOnInit() {
    this.fetchIssues();
  }

  fetchIssues() {
    this.issuesService.getAllIssues().subscribe(
      response => {
        this.issues = response.issues;
      },
      error => {
        console.error('Error fetching issues', error);
        this.error = 'Failed to load issues';
      }
    );
  }

  submitResponse(issueId: string) {
    const adminId = localStorage.getItem('userId');
    if (!adminId) {
      this.error = 'Admin not logged in';
      return;
    }

    const responseData = {
      issue_id: issueId,
      admin_id: adminId,
      response_text: this.newResponse[issueId] || ''
    };

    this.issuesService.createResponse(responseData).subscribe(
      response => {
        this.message = response.message;
        this.newResponse[issueId] = '';
        this.fetchIssues();
        setTimeout(() => this.message = '', 3000);
      },
      error => {
        console.error('Error submitting response', error);
        this.error = 'Failed to submit response';
      }
    );
  }

  isResponseValid(issueId: string): boolean {
    return (this.newResponse[issueId] || '').trim().length > 0;
  }
}
