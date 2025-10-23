# Loan Management Frontend

## Overview
This is the frontend application for the Loan Management System built with React.js, featuring a modern and responsive user interface.

## Features
- Modern React application with functional components and hooks
- Beautiful and responsive UI design
- Advanced search and filtering capabilities
- Loan comparison functionality
- Eligibility checker
- Dashboard and analytics
- Mobile-responsive design

## Project Structure
```
frontend/
├── public/           # Static files
├── src/
│   ├── assets/       # Images, styles, and static assets
│   │   ├── images/   # Image files
│   │   └── styles/   # Additional CSS files
│   ├── components/   # Reusable React components
│   ├── contexts/     # React Context providers
│   ├── data/         # Static data and mock data
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── services/     # API services and utilities
│   ├── utils/        # Utility functions
│   ├── App.js        # Main App component
│   ├── App.css       # Main styles
│   ├── index.js      # Application entry point
│   └── index.css     # Global styles
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
```bash
# Development mode with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (not recommended)
npm run eject
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Key Features

### Search & Filter
- Advanced search functionality with multiple filters
- Country-based filtering with interactive globe button
- Modern filter panel with beautiful animations
- Real-time search results

### Loan Management
- Browse available loans
- Compare multiple loans side by side
- Save favorite loans
- Detailed loan information pages

### Eligibility Checker
- Interactive eligibility form
- Real-time eligibility assessment
- Personalized loan recommendations
- Step-by-step application guidance

### Dashboard
- Personal loan management dashboard
- Application tracking
- Saved loans management
- Quick actions panel

### Analytics
- Loan application analytics
- Popular loans tracking
- Country and category statistics
- Visual data representation

## Styling
The application uses:
- Custom CSS with modern design system
- CSS Variables for consistent theming
- Responsive design with mobile-first approach
- Smooth animations and micro-interactions
- Professional color palette and typography

## Components
- **Header**: Navigation and branding
- **Footer**: Contact information and links
- **SearchPage**: Main search interface
- **LoanDetailsPage**: Individual loan information
- **EligibilityPage**: Eligibility assessment
- **ComparePage**: Loan comparison tool
- **Dashboard**: Personal dashboard
- **Analytics**: Data visualization

## API Integration
The frontend communicates with the backend API for:
- Fetching loan data
- Submitting applications
- User authentication
- Analytics data

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance
- Code splitting and lazy loading
- Optimized images and assets
- Efficient state management
- Responsive design principles