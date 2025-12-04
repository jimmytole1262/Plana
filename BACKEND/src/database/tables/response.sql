CREATE TABLE IssueResponses (
    response_id VARCHAR(255) PRIMARY KEY DEFAULT CONVERT(VARCHAR(255), NEWID()),
    issue_id VARCHAR(255) NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    response_text NVARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (issue_id) REFERENCES Issues(issue_id),
    FOREIGN KEY (admin_id) REFERENCES Users(user_id)
);