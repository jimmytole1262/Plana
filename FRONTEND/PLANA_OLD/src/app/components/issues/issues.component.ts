import { Component, OnInit } from '@angular/core';
import { IssuesService } from '../../services/issues.service';
import { Issue } from '../interfaces/issues';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent implements OnInit {
  issues: Issue[] = [];
  newIssue = { title: '', description: '' };
  newResponse: { [key: string]: string } = {}; // Store responses per issue
  message: string = '';
  error: string = '';
  userRole: string = localStorage.getItem('userRole') || 'user'; // Assume role is stored in localStorage

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

  submitIssue() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'Please log in to submit an issue';
      return;
    }

    const issueData = {
      user_id: userId,
      event_id: null,
      title: this.newIssue.title,
      description: this.newIssue.description
    };

    this.issuesService.createIssue(issueData).subscribe(
      response => {
        this.message = response.message;
        this.newIssue = { title: '', description: '' };
        this.fetchIssues();
        setTimeout(() => this.message = '', 3000);
      },
      error => {
        console.error('Error submitting issue', error);
        this.error = 'Failed to submit issue';
      }
    );
  }

  submitResponse(issueId: string) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'Please log in to respond';
      return;
    }

    const responseData = {
      issue_id: issueId,
      admin_id: userId,
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

  isFormValid(): boolean {
    return this.newIssue.title.trim().length > 0 && this.newIssue.description.trim().length > 0;
  }

  isResponseValid(issueId: string): boolean {
    return (this.newResponse[issueId] || '').trim().length > 0;
  }
}