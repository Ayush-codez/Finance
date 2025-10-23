# Loan Management Backend API

## Overview
This is the backend API for the Loan Management Application built with Node.js, Express.js, and SQLite.

## Features
- RESTful API for loan management
- SQLite database for data storage
- JWT authentication
- Rate limiting and security middleware
- CORS configuration
- Input validation and sanitization

## Project Structure
```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── database/         # Database files
├── middleware/       # Custom middleware
├── models/           # Data models
├── routes/           # API routes
├── utils/            # Utility functions
├── server.js         # Main server file
├── package.json      # Dependencies and scripts
└── .env.example      # Environment variables template
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration

### Running the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Test database connection
npm test
```

## API Endpoints

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan

### Loan Applications
- `POST /api/applications` - Submit loan application
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID

## Environment Variables
See `.env.example` for all available environment variables.

## Database
The application uses SQLite as the database. The database file is located at `database/loan_applications.db`.

## Security Features
- Helmet.js for security headers
- CORS protection
- Rate limiting
- Input validation
- JWT authentication
- Password hashing with bcrypt

## Development
- Uses nodemon for development auto-restart
- Morgan for request logging
- Express validator for input validation