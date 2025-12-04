import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EventsService, Event } from '../../services/events.service'; // Import Event
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserBookingsComponent } from '../user-bookings/user-bookings.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, UserBookingsComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  events: Event[] = []; // Use Event instead of events
  bookingMessage: string = '';
  bookingError: string = '';
  username: string = '';
  selectedEvent: Event | null = null; // Use Event instead of events
  showModal: boolean = false;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEvents();
    this.loadUserData();
  }

  fetchEvents() {
    this.eventsService.fetchAllEvents().subscribe(response => {
      this.events = response.events;
    });
  }

  loadUserData() {
    this.username = localStorage.getItem('username') || '';
  }

  openPaymentModal(event: Event) {
    this.selectedEvent = event;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedEvent = null;
  }

  confirmPayment(eventId: string) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.createBooking(userId, eventId).subscribe(
        response => {
          if (response.message === 'Booking created successfully') {
            this.bookingMessage = 'Payment successful! Booking confirmed.';
            this.closeModal();
            setTimeout(() => {
              this.bookingMessage = '';
              this.router.navigate(['/user-bookings']);
            }, 3000);
          }
        },
        error => {
          if (error.error === 'Booking already exists') {
            this.bookingError = 'You have already booked this event.';
          } else if (error.error === 'Event is fully booked') {
            this.bookingError = 'Sorry, this event is fully booked.';
          } else {
            console.error('Error creating booking', error);
            this.bookingError = 'An error occurred during booking.';
          }
          setTimeout(() => {
            this.bookingError = '';
          }, 3000);
        }
      );
    } else {
      alert('User not logged in');
    }
  }

  logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}