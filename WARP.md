# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based loan comparison platform that helps users find and compare loans from various lenders including government schemes, banks, and private lenders. The application focuses on startups, SMEs, and NGOs with comprehensive filtering and comparison features.

## Common Development Commands

### Build and Development
```bash
npm start          # Start both backend server (port 5000) and frontend (port 3000)
npm run dev        # Start only React development server (localhost:3000)
npm run server     # Start only backend server (localhost:5000)
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from Create React App (irreversible)
```

### Database Testing
```bash
node test-database.js              # Run database functionality tests
node test-database.js --add-data   # Add sample data to database
```

### Package Management
```bash
npm install        # Install all dependencies
npm install <package>  # Install new package
npm uninstall <package>  # Remove package
```

## High-Level Architecture

### Core Structure
- **React Router** for client-side routing with 7 main pages (Home, Search, Compare, Details, Eligibility, Dashboard, Analytics)
- **Context API** (LoanContext) for global state management instead of Redux
- **Component-based architecture** with reusable UI components
- **CSS-only styling** with comprehensive design system using CSS custom properties
- **Local storage** for persisting user data (saved loans, comparisons)
- **Express.js backend** with SQLite database for tracking loan applications
- **RESTful API** for analytics and application tracking

### State Management Pattern
The application uses a centralized Context + useReducer pattern:
- `LoanContext.js` - Global state with reducer pattern for loan data, filters, user profile
- Actions: SET_SEARCH_QUERY, SET_FILTERS, ADD_TO_COMPARISON, SAVE_LOAN, etc.
- Persistent storage for user preferences and comparisons via localStorage

### Data Flow Architecture
1. **Static Data Source**: `src/data/loans.js` contains all loan information
2. **Context Layer**: LoanContext manages filtering, searching, and user interactions
3. **Component Layer**: Pages and components consume context via `useLoan()` hook
4. **Persistence Layer**: Key user data saved to localStorage

### Key Business Logic
- **Filtering System**: Multi-criteria filtering (category, lender type, amount, interest rate, collateral, sector)
- **Eligibility Matching**: Algorithm matches user profile against loan eligibility criteria
- **Comparison Engine**: Side-by-side loan comparison with feature highlighting
- **Search Algorithm**: Text-based search across loan name, lender, description, and category

### Component Hierarchy
```
App
├── Header (navigation, mobile menu)
├── Main Content
│   ├── HomePage (hero, stats, categories, features)
│   ├── SearchPage (filters, results grid, comparison bar)
│   ├── ComparePage (comparison table, tips)
│   ├── LoanDetailsPage (detailed loan information)
│   ├── EligibilityPage (user profile form, recommendations)
│   └── DashboardPage (user dashboard, saved items)
└── Footer
```

### Data Schema Structure
Each loan object contains:
- Basic info (id, name, lender, category, lenderType)
- Financial terms (interestRate, loanAmount, repaymentTerm, processingFee)
- Eligibility criteria (age, income, credit score, business requirements)
- Additional data (benefits, documents, features, applicationUrl)

## Development Patterns

### State Updates
Always use the dispatch function from LoanContext:
```javascript
const { dispatch } = useLoan();
dispatch({ type: 'SET_FILTERS', payload: { category: 'startup' } });
```

### Adding New Loan Types
1. Add loan data to `src/data/loans.js`
2. Update filter options if new categories/types are introduced
3. Ensure eligibility logic handles new loan types

### Filter Implementation
Filters are applied automatically via useEffect in LoanContext when:
- Search query changes
- Any filter criteria changes
- The filtering logic in `applyFilters()` runs synchronously

### Component Communication
- Use LoanContext for cross-component data sharing
- Pass loan IDs rather than full objects when possible
- Leverage localStorage for user preference persistence

## Styling System

The project uses a comprehensive CSS custom property system with:
- Color scales for primary, secondary, accent, success, warning, error
- Typography scale with Inter font family
- Spacing system using rem units
- Professional shadows and gradients
- Responsive breakpoints (768px, 1024px)
- Dark mode considerations via CSS custom properties

## Key Dependencies

- **react-router-dom**: Client-side routing
- **lucide-react**: Icon library for UI elements  
- **clsx**: Conditional CSS class utility

## Browser Support

Targets modern browsers with Create React App's default browserslist configuration focusing on >0.2% usage and excluding dead browsers.