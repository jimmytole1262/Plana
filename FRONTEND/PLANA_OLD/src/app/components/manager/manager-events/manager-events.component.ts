import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { EventsService, Event } from '../../../services/events.service';

@Component({
  selector: 'app-manager-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-events.component.html',
  styleUrls: ['./manager-events.component.css']
})
export class ManagerEventsComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  eventModel: Partial<Event> = {};
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;
  imageError: string = '';
  isUpdateMode: boolean = false;

  constructor(private eventService: EventsService) {}

  ngOnInit(): void {
    this.fetchAllEvents();
  }

  fetchAllEvents(): void {
    this.eventService.fetchAllEvents().subscribe(
      (response) => {
        this.events = response.events;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch events';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  onCreate(eventForm: NgForm): void {
    if (eventForm.valid) {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('upload_preset', 'plana_system');
        formData.append('cloud_name', 'dzg24szct');

        fetch('https://api.cloudinary.com/v1_1/dzg24szct/image/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => {
            const event: Event = {
              event_id: '',
              title: this.eventModel.title || '',
              description: this.eventModel.description || '',
              date: this.eventModel.date || '',
              location: this.eventModel.location || '',
              ticket_type: this.eventModel.ticket_type || '',
              price: Number(this.eventModel.price) || 0,
              image: result.url,
              total_tickets: Number(this.eventModel.total_tickets) || 0,
              available_tickets: Number(this.eventModel.total_tickets) || 0, // Set to total_tickets for new events
              isApproved: undefined
            };
            this.eventService.createEvent(event).subscribe(
              (response) => {
                this.successMessage = response.message;
                this.fetchAllEvents();
                eventForm.reset();
                this.selectedFile = null;
                this.eventModel = {};
                this.closeModal();
                setTimeout(() => (this.successMessage = ''), 3000);
              },
              (error) => {
                this.errorMessage = 'Failed to create event';
                setTimeout(() => (this.errorMessage = ''), 3000);
              }
            );
          })
          .catch((error) => {
            console.error('Error:', error);
            this.errorMessage = 'Failed to upload image';
            setTimeout(() => (this.errorMessage = ''), 3000);
          });
      } else {
        this.errorMessage = 'Please select an image';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    }
  }

  onUpdate(eventForm: NgForm): void {
    if (eventForm.valid && this.selectedEvent) {
      const updateEvent = (imageUrl: string) => {
        const event: Event = {
          event_id: this.selectedEvent!.event_id,
          title: this.eventModel.title || this.selectedEvent!.title,
          description: this.eventModel.description || this.selectedEvent!.description,
          date: this.eventModel.date || this.selectedEvent!.date,
          location: this.eventModel.location || this.selectedEvent!.location,
          ticket_type: this.eventModel.ticket_type || this.selectedEvent!.ticket_type,
          price: Number(this.eventModel.price) || this.selectedEvent!.price,
          image: imageUrl || this.selectedEvent!.image,
          total_tickets: Number(this.eventModel.total_tickets) || this.selectedEvent!.total_tickets,
          available_tickets: Number(this.eventModel.available_tickets) || this.selectedEvent!.available_tickets, // Use updated value
          isApproved: undefined
        };

        // Optional validation: Ensure available_tickets <= total_tickets
        if (event.available_tickets > event.total_tickets) {
          this.errorMessage = 'Available tickets cannot exceed total tickets';
          setTimeout(() => (this.errorMessage = ''), 3000);
          return;
        }

        this.eventService.updateEvent(this.selectedEvent!.event_id, event).subscribe(
          (response) => {
            if ('error' in response) {
              this.errorMessage = response.error;
              setTimeout(() => (this.errorMessage = ''), 3000);
            } else {
              this.successMessage = response.message;
              this.fetchAllEvents();
              this.selectedEvent = null;
              this.eventModel = {};
              eventForm.reset();
              this.selectedFile = null;
              this.isUpdateMode = false;
              this.closeModal();
              setTimeout(() => (this.successMessage = ''), 3000);
            }
          },
          (error) => {
            console.error('Update Error:', error);
            this.errorMessage = 'Failed to update event';
            setTimeout(() => (this.errorMessage = ''), 3000);
          }
        );
      };

      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('upload_preset', 'plana_system');
        formData.append('cloud_name', 'dzg24szct');

        fetch('https://api.cloudinary.com/v1_1/dzg24szct/image/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((result) => updateEvent(result.url))
          .catch((error) => {
            console.error('Error:', error);
            this.errorMessage = 'Failed to upload image';
            setTimeout(() => (this.errorMessage = ''), 3000);
          });
      } else {
        updateEvent(this.selectedEvent!.image);
      }
    }
  }

  onDelete(event_id: string): void {
    this.eventService.deleteEvent(event_id).subscribe(
      (response) => {
        this.successMessage = 'Event deleted successfully';
        this.fetchAllEvents();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      (error) => {
        this.errorMessage = 'Failed to delete event';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.size > 5000000) {
      this.imageError = 'File size should be less than 5 MB';
      this.selectedFile = null;
    } else {
      this.imageError = '';
      this.selectedFile = file;
    }
  }

  openCreateModal(): void {
    this.selectedEvent = null;
    this.eventModel = {};
    this.selectedFile = null;
    this.isUpdateMode = false;
    this.openModal();
  }

  openUpdateModal(event: Event): void {
    this.selectedEvent = { ...event };
    this.eventModel = { ...event }; // Prepopulate with current values, including available_tickets
    this.selectedFile = null;
    this.isUpdateMode = true;
    this.openModal();
  }

  openModal(): void {
    const modal = document.getElementById('create-event-modal');
    if (modal) modal.style.display = 'block';
  }

  closeModal(): void {
    const modal = document.getElementById('create-event-modal');
    if (modal) modal.style.display = 'none';
  }

  onCancel(): void {
    this.closeModal();
    this.eventModel = {};
    this.selectedEvent = null;
    this.isUpdateMode = false;
  }
}