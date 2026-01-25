# Plana - Event Management System

Plana is a comprehensive Event Management System built with a modern tech stack, designed to facilitate event booking, user management, and administrative operations.

## 🚀 Tech Stack

- **Frontend**: React (Vite), CSS3, GSAP (Animations)
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MSSQL (Microsoft SQL Server)
- **Testing**: TestSprite (Automated Testing)

## 📂 Project Structure

- **FRONTEND/PLANA**: Contains the React application.
- **BACKEND**: Contains the Express.js server and API logic.
- **bgservices**: Background services for the application.

## 🛠️ Setup & Installation

### Prerequisites

- Node.js installed
- SQL Server installed and running

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file with database credentials.
4. Start the server:
   ```bash
   npm run start:run
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd FRONTEND/PLANA
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## ✨ Features

- **User Authentication**: Secure Signup and Login functionality.
- **Dashboard**: Real-time dashboard for users and admins.
- **Event Management**: Create, browse, and book events.
- **Admin Panel**: Manage users, events, and bookings.
- **Support System**: Issue submission and tracking.

## 🧪 Testing

The project is integrated with **TestSprite** for automated testing.

```bash
# Example test run
npm run testsprite
```
