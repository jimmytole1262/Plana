CREATE TABLE Issues (
    issue_id VARCHAR(255) PRIMARY KEY DEFAULT CONVERT(VARCHAR(255), NEWID()), -- UUID as VARCHAR
    user_id VARCHAR(255) NOT NULL,
    event_id VARCHAR(255) NULL, -- Optional, if tied to a specific event
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (event_id) REFERENCES Events(event_id)
);