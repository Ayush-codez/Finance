# Loan Management System

## Overview
A production-grade, comprehensive loan management system built with modern full-stack architecture. Features a React frontend, Node.js backend with MongoDB/SQLite support, and a shared package for type safety and code reusability.

## 🏗️ Architecture

### Monorepo Structure
```
Loan/
├── shared/                    # Shared package for types, utilities, and constants
│   ├── src/
│   │   ├── types/            # TypeScript interfaces and types
│   │   ├── utils/            # Shared utility functions
│   │   ├── validation/       # Joi validation schemas
│   │   ├── constants/        # Application constants
│   │   ├── config/          # Environment configuration
│   │   └── data/            # Shared data models
│   ├── dist/                # Compiled TypeScript output
│   ├── package.json         # Shared package dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── backend/                   # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers and business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models (Mongoose)
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Backend-specific utilities
│   ├── config/              # Configuration files
│   ├── database/            # Database files and migrations
│   ├── scripts/             # Utility scripts
│   ├── server.js            # SQLite server entry point
│   ├── server-mongodb.js    # MongoDB server entry point
│   └── package.json         # Backend dependencies
│
├── frontend/                  # React.js web application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page-level components
│   │   ├── contexts/        # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   └── utils/           # Frontend utilities
│   ├── build/               # Production build output
│   └── package.json         # Frontend dependencies
│
├── docker-compose.yml         # Multi-service Docker setup
├── Dockerfile                 # Production Docker image
├── .env.example              # Environment variables template
├── package.json              # Root workspace configuration
└── README.md                 # This file
```

## Features

### Frontend Features
- 🎨 Modern, responsive UI with beautiful animations
- 🔍 Advanced search and filtering system
- 🌍 Interactive country selection with globe button
- 📊 Loan comparison functionality
- 🎯 Eligibility assessment tool
- 📱 Mobile-responsive design
- 📈 Analytics dashboard
- 💾 Favorite loans management

### Backend Features
- 🚀 RESTful API with Express.js
- 🗄️ SQLite database integration
- 🔐 JWT authentication system
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- ✅ Input validation and sanitization
- 📝 Request logging
- 🔄 Environment configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Docker and Docker Compose (for containerized setup)
- MongoDB (optional, for database setup)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd Loan
   npm install  # Installs all workspace dependencies
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development Mode**
   ```bash
   npm run dev  # Starts all services in development mode
   ```

   Or run services individually:
   ```bash
   npm run dev:shared    # Build shared package in watch mode
   npm run dev:backend   # Start backend with auto-reload
   npm run dev:frontend  # Start frontend development server
   ```

4. **Production Build**
   ```bash
   npm run build         # Build all packages for production
   npm run start:backend # Start production backend
   ```

5. **Docker Setup**
   ```bash
   # Development with Docker Compose
   docker-compose up -d
   
   # Production deployment
   docker-compose --profile production up -d
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017 (if using Docker)

## 💻 Development Workflow

### Monorepo Commands (from root)
```bash
# Install all dependencies
npm install

# Development
npm run dev                    # Start all services in development mode
npm run dev:shared            # Build shared package in watch mode
npm run dev:backend           # Start backend with auto-reload
npm run dev:frontend          # Start frontend development server

# Building
npm run build                 # Build all packages
npm run build:shared          # Build shared package only
npm run build:backend         # Build backend only
npm run build:frontend        # Build frontend only

# Testing
npm run test                  # Run tests in all packages
npm run test:shared           # Test shared package
npm run test:backend          # Test backend
npm run test:frontend         # Test frontend

# Code Quality
npm run lint                  # Lint all packages
npm run lint:fix              # Fix linting issues
npm run type-check            # Type check all TypeScript

# Maintenance
npm run clean                 # Clean all build artifacts
npm run reset                 # Clean and reinstall dependencies
```

### Database Options

**SQLite (Development)**
```bash
# Uses local SQLite file
SQLITE_PATH=./database/loan_applications.db
npm run dev:backend
```

**MongoDB (Production)**
```bash
# Requires MongoDB connection
MONGODB_URI=mongodb://localhost:27017/loan_management
npm run dev:backend

# Or with Docker
docker-compose up mongodb
npm run dev:backend
```

## API Endpoints

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id` - Update loan
- `DELETE /api/loans/:id` - Delete loan

### Applications
- `POST /api/applications` - Submit loan application
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID

## 🛠️ Technology Stack

### Shared Package
- **TypeScript** - Type safety and better development experience
- **Joi** - Schema validation for data integrity
- **Lodash** - Utility functions

### Frontend
- **React.js 18** - Modern UI framework with hooks
- **React Router DOM** - Client-side routing
- **Context API** - State management
- **Lucide React** - Modern icon library
- **CSS3 + CSS Variables** - Styling with design system
- **Axios** - HTTP client with interceptors
- **TypeScript** - Type safety

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type safety and better development experience
- **MongoDB + Mongoose** - Primary database with ODM
- **SQLite3** - Lightweight alternative database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Multer** - File upload handling
- **Cheerio** - Server-side HTML parsing
- **Joi** - Request validation
- **Axios** - External API integration

### Development & Deployment
- **npm Workspaces** - Monorepo management
- **ESLint + Prettier** - Code formatting and linting
- **Husky + lint-staged** - Git hooks and pre-commit checks
- **Docker + Docker Compose** - Containerization
- **Nginx** - Reverse proxy and static file serving
- **MongoDB** - Production database
- **Redis** - Caching layer (optional)

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Security headers with Helmet
- Input validation and sanitization

## Database Schema
The application supports both SQLite and MongoDB with the following main collections/tables:
- `loans` - Available loan products
- `loan_applications` - User applications
- `users` - User accounts (if authentication is implemented)

### Database Migration
The project includes a migration script to move data from SQLite to MongoDB:
```bash
cd backend
npm run migrate
```

## 🚀 Deployment

### Docker Deployment (Recommended)

**Development Environment**
```bash
# Start all services including database
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

**Production Environment**
```bash
# Build and deploy with production profile
docker-compose --profile production up -d

# Or build and run manually
docker build -t loan-management-system .
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  loan-management-system
```

### Manual Deployment

**Build for Production**
```bash
# Build all packages
npm run build

# Install production dependencies only
npm ci --only=production
```

**Run Production Server**
```bash
# Set environment variables
export NODE_ENV=production
export MONGODB_URI=your-production-mongodb-uri
export JWT_SECRET=your-production-jwt-secret

# Start the server
npm run start:backend
```

### Environment-Specific Deployments

**Staging**
```bash
npm run deploy:staging
```

**Production**
```bash
npm run deploy:production
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Application
NODE_ENV=development
PORT=5000
LOG_LEVEL=info

# Database
MONGODB_URI=mongodb://localhost:27017/loan_management
SQLITE_PATH=./database/loan_applications.db

# Security
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# API Configuration
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100

# External Services
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
ALPHA_VANTAGE_API_KEY=your-api-key

# Analytics
ANALYTICS_ENABLED=true
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

### Configuration Management

The application uses a centralized configuration system:

- **Shared Config**: Environment parsing and validation
- **Type Safety**: All configuration is properly typed
- **Environment Validation**: Required variables are checked at startup
- **Secure Defaults**: Sensible defaults for development

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the ISC License.

## 📚 Additional Documentation

- [Shared Package Documentation](./shared/README.md) - Types, utilities, and shared logic
- [Backend Documentation](./backend/README.md) - API endpoints, database, and server logic
- [Frontend Documentation](./frontend/README.md) - UI components, pages, and user interactions
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions
- [API Reference](./docs/api.md) - Complete API documentation
- [Development Guide](./docs/development.md) - Development setup and workflows

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm test`
5. **Commit changes**: `npm run commit` (uses commitizen)
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow the established code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Use conventional commits
- Ensure type safety with TypeScript

## 📊 Monitoring & Analytics

### Health Checks
```bash
# Application health
curl http://localhost:5000/api/health

# Database health
curl http://localhost:5000/api/analytics/stats
```

### Logging
- Structured logging with different levels
- Request/response logging
- Error tracking and monitoring
- Performance metrics

## 🔒 Security Features

- **JWT Authentication** with secure secret rotation
- **Password Hashing** using bcrypt with configurable rounds
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **Input Validation** using Joi schemas
- **Security Headers** via Helmet.js
- **SQL Injection Prevention** through parameterized queries
- **XSS Protection** with input sanitization

## 🚨 Support & Issues

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check the docs folder for detailed guides
- **Community**: Join discussions in GitHub Discussions
- **Commercial Support**: Contact the development team

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Government APIs for loan scheme data
- Open-source community for excellent libraries
- Contributors who helped improve this project
