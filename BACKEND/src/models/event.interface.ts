export interface Event {
    event_id: string; // Add this property
    title: string;
    description: string;
    date: string;
    location: string;
    ticket_type: string;
    price: number;
    image: string;
    total_tickets: number;
    available_tickets: number;
    isApproved: boolean;
}