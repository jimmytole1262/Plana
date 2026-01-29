-- PostgreSQL Schema for Plana Project

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    "isActive" BOOLEAN DEFAULT true
);

-- Events Table
CREATE TABLE IF NOT EXISTS Events (
    event_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    ticket_type VARCHAR(255),
    price DECIMAL(10, 2),
    image VARCHAR(255),
    total_tickets INTEGER,
    available_tickets INTEGER,
    category VARCHAR(50) DEFAULT 'other',
    "isApproved" BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Bookings Table
CREATE TABLE IF NOT EXISTS Bookings (
    booking_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(user_id) ON DELETE CASCADE,
    event_id VARCHAR(255) REFERENCES Events(event_id) ON DELETE CASCADE,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issues Table
CREATE TABLE IF NOT EXISTS Issues (
    issue_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES Users(user_id) ON DELETE CASCADE,
    event_id VARCHAR(255) REFERENCES Events(event_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IssueResponses Table
CREATE TABLE IF NOT EXISTS IssueResponses (
    response_id VARCHAR(255) PRIMARY KEY,
    issue_id VARCHAR(255) REFERENCES Issues(issue_id) ON DELETE CASCADE,
    admin_id VARCHAR(255) REFERENCES Users(user_id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
