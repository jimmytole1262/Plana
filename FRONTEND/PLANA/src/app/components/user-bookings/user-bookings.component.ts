import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BookingDetails } from '../interfaces/bookingdetails';
import { events } from '../interfaces/events';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import QRCode from 'qrcode'; // Import qrcode

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrls: ['./user-bookings.component.css']
})
export class UserBookingsComponent implements OnInit {
  bookings: BookingDetails[] = [];
  events: events[] = [];
  cancelBook: string = '';
  selectedBooking: BookingDetails | null = null;
  showModal: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.authService.fetchBookingsByUser(userId).subscribe(
        (response) => {
          this.bookings = response.bookingsByUser;
          this.events = [];
          this.bookings.forEach(booking => {
            this.authService.fetchEventDetails(booking.event_id).subscribe(
              (event: events) => {
                this.events.push(event);
              },
              (error) => {
                console.error('Error fetching event details', error);
              }
            );
          });
        },
        (error) => {
          console.error('Error fetching bookings', error);
        }
      );
    }
  }

  cancelBooking(bookingId: string) {
    this.authService.cancelBooking(bookingId).subscribe(
      (response) => {
        this.cancelBook = response.message;
        setTimeout(() => {
          this.cancelBook = '';
        }, 3000);
        this.loadBookings();
      },
      (error) => {
        console.error('Error canceling booking', error);
      }
    );
  }

  viewBookingDetails(booking: BookingDetails) {
    this.selectedBooking = booking;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedBooking = null;
  }

  async generateTicket() {
    if (!this.selectedBooking) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = margin;

    // Use default Helvetica font
    doc.setFont('Helvetica', 'normal');

    // Header Image
    const imgPath = '/asset/calendar_9073036.png'; // Absolute path (preferred after angular.json update)
    // Alternative: const imgPath = '../assets/plana-logo.png'; // Relative path
    const imgWidth = 50; // Width in mm
    const imgHeight = 50; // Height in mm
    try {
      doc.addImage(imgPath, 'PNG', (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
      y += imgHeight + 10;
    } catch (error) {
      console.warn('Header image not found at /assets/plana-logo.png, skipping...', error);
      y += 10; // Space even if image fails
    }

    // Ticket Title
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(54, 194, 206); // #36C2CE
    doc.text('Event Ticket', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Draw a border around ticket details
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = 100; // Increased to accommodate QR code
    doc.setDrawColor(54, 194, 206); // #36C2CE border
    doc.setLineWidth(0.5);
    doc.rect(margin, y - 5, contentWidth, contentHeight);

    // Booking Details
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(73, 73, 73); // Dark gray
    const details = [
      `Ticket Number: ${this.selectedBooking.booking_id}`,
      `Event: ${this.selectedBooking.event_title}`,
      `Date: ${new Date(this.selectedBooking.booking_date).toLocaleDateString('en-GB')}`,
      `Ticket Type: ${this.selectedBooking.ticket_type}`,
      `Status: ${this.selectedBooking.isApproved ? 'Approved' : 'Pending Approval'}`
    ];

    y += 5; // Padding inside border
    details.forEach(line => {
      doc.text(line, margin + 5, y);
      y += 10;
    });

    // Generate QR Code
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(this.selectedBooking.booking_id, {
        width: 80, // QR code size in pixels (approx 25mm at 300dpi)
        margin: 1
      });
      const qrWidth = 25; // Width in mm
      const qrHeight = 25; // Height in mm
      const qrX = (pageWidth - qrWidth) / 2; // Center horizontally
      const qrY = y + 10; // Position 10mm below the last detail
      doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrWidth, qrHeight);
    } catch (error) {
      console.warn('Failed to generate QR code, skipping...', error);
    }

    // Footer with branding
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(150, 150, 150); // Light gray
    doc.text('Generated by Plana - Enjoy your event!', pageWidth / 2, pageHeight - margin, { align: 'center' });

    // Save the PDF
    doc.save(`ticket_${this.selectedBooking.booking_id}.pdf`);
  }
}