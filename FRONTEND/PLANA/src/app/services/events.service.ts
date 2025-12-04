import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
isApproved: any;
  event_id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  ticket_type: string;
  price: number;
  image: string;
  total_tickets: number;
  available_tickets: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:5500/events';

  constructor(private http: HttpClient) {}

  fetchAllEvents(): Observable<{ events: Event[] }> {
    return this.http.get<{ events: Event[] }>(`${this.baseUrl}/viewAllEvents`);
  }

  createEvent(event: Event): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/createEvent`, event, { headers });
  }

  updateEvent(event_id: string, event: Event): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.baseUrl}/update-event/${event_id}`, event, { headers });
  }

  deleteEvent(event_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${event_id}`);
  }

  approveEvent(event_id: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<{ message: string }>(`${this.baseUrl}/approve-event/${event_id}`, {}, { headers });
  }
}