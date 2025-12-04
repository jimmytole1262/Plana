import { Component, OnInit } from '@angular/core';
import { EventsService, Event } from '../../../services/events.service'; // Import Event
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {
  events: Event[] = []; // Use Event instead of events

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.fetchAllEvents();
  }

  fetchAllEvents() {
    this.eventsService.fetchAllEvents().subscribe(
      (response) => {
        this.events = response.events;
        console.log('Fetched events:', this.events);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  approveEvent(eventId: string) {
    this.eventsService.approveEvent(eventId).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.fetchAllEvents(); // Refresh the event list
      },
      (error: any) => {
        console.error('Error approving event:', error);
      }
    );
  }

  deleteEvent(eventId: string) {
    this.eventsService.deleteEvent(eventId).subscribe(
      (response: { message: string }) => {
        console.log(response.message);
        this.fetchAllEvents(); // Refresh the event list
      },
      (error: any) => {
        console.error('Error deleting event:', error);
      }
    );
  }
}