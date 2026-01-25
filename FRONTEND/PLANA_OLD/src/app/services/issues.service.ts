import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue, IssueResponse } from '../components/interfaces/issues';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private apiUrl = 'http://localhost:5500/issues';

  constructor(private http: HttpClient) {}

  createIssue(issue: Omit<Issue, 'issue_id' | 'created_at' | 'responses'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/createIssue`, issue);
  }

  getAllIssues(): Observable<{ issues: Issue[] }> {
    return this.http.get<{ issues: Issue[] }>(`${this.apiUrl}/getAllIssues`);
  }

  createResponse(response: Omit<IssueResponse, 'response_id' | 'created_at'>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/createResponse`, response);
  }
}
