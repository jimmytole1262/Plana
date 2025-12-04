import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { EventsService, Event } from '../../services/events.service'; // Import Event
import { CommonModule } from '@angular/common';
import { IssuesService } from '../../services/issues.service';
import { Issue } from '../interfaces/issues';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  events: Event[] = []; // Use Event instead of events
  issues: Issue[] = [];
  loginMessage: string = '';

  constructor(
    private eventsService: EventsService,
    private issuesService: IssuesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEvents();
    this.fetchIssues();
  }

  fetchEvents(): void {
    this.eventsService.fetchAllEvents().subscribe((response) => {
      this.events = response.events;
    });
  }

  fetchIssues(): void {
    this.issuesService.getAllIssues().subscribe((response) => {
      this.issues = response.issues.slice(0, 3); // Limit to 3 for landing page
    });
  }

  bookEvent(eventId: string): void {
    this.loginMessage = 'Redirecting to login page';
    setTimeout(() => {
      this.loginMessage = '';
      this.router.navigate(['/login']);
    }, 3000);
  }
}