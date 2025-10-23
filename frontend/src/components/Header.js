import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Building, Users, Award, Plus, Settings } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';
import AddOrganizationModal from './AddOrganizationModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddOrgModalOpen, setIsAddOrgModalOpen] = useState(false);
  const location = useLocation();
  const { comparisonList } = useLoan();

  const navItems = [
    { path: '/', label: 'Home', icon: Building },
    { path: '/search', label: 'Search Loans', icon: Search },
    { path: '/eligibility', label: 'Eligibility Check', icon: Users },
    { path: '/compare', label: `Compare (${comparisonList.length})`, icon: Award }
  ];

  const isActive = (path) => location.pathname === path;

  const handleAddOrganization = () => {
    setIsAddOrgModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddOrgModalOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <Building className="logo-icon" />
            <span className="logo-text">LoanCompare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Add Your Organization Button */}
            <button
              onClick={handleAddOrganization}
              className="btn btn-success btn-add-org"
              title="Add Your Organization"
            >
              <Plus size={16} />
              <span>Add Your Organization</span>
            </button>
            
            {/* Admin Panel Link */}
            <Link
              to="/admin"
              className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
              title="Real-time Data Admin"
            >
              <Settings size={16} />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile Add Your Organization Button */}
            <button
              onClick={() => {
                handleAddOrganization();
                setIsMenuOpen(false);
              }}
              className="mobile-nav-link btn-add-org-mobile"
            >
              <Plus size={20} />
              <span>Add Your Organization</span>
            </button>
            
            {/* Mobile Admin Panel Link */}
            <Link
              to="/admin"
              className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings size={20} />
              <span>Admin Panel</span>
            </Link>
          </nav>
        )}
      </div>
      
      {/* Add Organization Modal */}
      <AddOrganizationModal 
        isOpen={isAddOrgModalOpen} 
        onClose={handleCloseModal} 
      />
    </header>
  );
};

export default Header;
