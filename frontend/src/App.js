import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoanProvider } from './contexts/LoanContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ComparePage from './pages/ComparePage';
import LoanDetailsPage from './pages/LoanDetailsPage';
import EligibilityPage from './pages/EligibilityPage';
import AddOrganizationPage from './pages/AddOrganizationPage';
import OrganizationManagementPage from './pages/OrganizationManagementPage';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <LoanProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/loan/:id" element={<LoanDetailsPage />} />
              <Route path="/eligibility" element={<EligibilityPage />} />
              <Route path="/add-organization" element={<AddOrganizationPage />} />
              <Route path="/admin/organizations" element={<OrganizationManagementPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LoanProvider>
  );
}

export default App;
