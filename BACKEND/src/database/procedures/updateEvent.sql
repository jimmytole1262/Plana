CREATE OR ALTER PROCEDURE updateEvent
    @event_id VARCHAR(255),
    @title VARCHAR(255),
    @description VARCHAR(255),
    @date DATETIME,
    @location VARCHAR(255),
    @ticket_type VARCHAR(255),
    @price FLOAT,
    @total_tickets INT,
    @available_tickets INT,
    @image VARCHAR(255)
AS
BEGIN
    UPDATE Events
    SET title = @title,
        description = @description,
        date = @date,
        location = @location,
        ticket_type = @ticket_type,
        price = @price,
        total_tickets = @total_tickets,
        available_tickets = @available_tickets,
        image = @image
    WHERE event_id = @event_id
END