import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, Users, TrendingUp, Shield, Clock } from 'lucide-react';
import { categories, lenderTypes } from '../data/loans';
import { useLoan } from '../contexts/LoanContext';

const HomePage = () => {
  const { loans } = useLoan();

  const stats = [
    { label: 'Total Loan Options', value: loans.length, icon: TrendingUp },
    { label: 'Government Schemes', value: loans.filter(l => l.lenderType === 'government').length, icon: Shield },
    { label: 'Bank Partners', value: loans.filter(l => l.lenderType === 'bank').length, icon: Award },
    { label: 'Private Lenders', value: loans.filter(l => l.lenderType === 'private').length, icon: Clock }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find the Perfect Loan for Your Organization
            </h1>
            <p className="hero-subtitle">
              Compare government schemes, bank loans, and private lenders all in one place. 
              Make informed decisions with transparent comparison and eligibility checking.
            </p>
            <div className="hero-actions">
              <Link to="/search" className="btn btn-primary">
                <Search size={20} />
                Start Searching
              </Link>
              <Link to="/eligibility" className="btn btn-secondary">
                <Users size={20} />
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="stat-card">
                  <IconComponent className="stat-icon" size={32} />
                  <div className="stat-content">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Loan Categories</h2>
          <p className="section-subtitle">
            Choose from various loan categories based on your organization type and needs
          </p>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/search?category=${category.id}`} 
                className="category-card"
              >
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-count">
                  {loans.filter(l => l.category === category.id).length} options available
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lender Types Section */}
      <section className="lender-types">
        <div className="container">
          <h2 className="section-title">Lender Types</h2>
          <div className="lender-types-grid">
            {lenderTypes.map((type) => (
              <div key={type.id} className="lender-type-card">
                <h3 className="lender-type-name">{type.name}</h3>
                <p className="lender-type-description">{type.description}</p>
                <div className="lender-type-count">
                  {loans.filter(l => l.lenderType === type.id).length} loans available
                </div>
                <Link 
                  to={`/search?lenderType=${type.id}`}
                  className="btn btn-outline"
                >
                  Explore {type.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose LoanCompare?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Search className="feature-icon" size={48} />
              <h3>Comprehensive Search</h3>
              <p>Search through government schemes, bank loans, and private lenders with advanced filtering options.</p>
            </div>
            <div className="feature-card">
              <Award className="feature-icon" size={48} />
              <h3>Easy Comparison</h3>
              <p>Compare interest rates, terms, and benefits side-by-side to make informed decisions.</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" size={48} />
              <h3>Eligibility Checker</h3>
              <p>Get personalized recommendations based on your organization's profile and requirements.</p>
            </div>
            <div className="feature-card">
              <TrendingUp className="feature-icon" size={48} />
              <h3>Smart Recommendations</h3>
              <p>AI-powered suggestions to help you find the most suitable financing options.</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" size={48} />
              <h3>Trusted Sources</h3>
              <p>All loan information is verified and updated regularly from official sources.</p>
            </div>
            <div className="feature-card">
              <Clock className="feature-icon" size={48} />
              <h3>Save Time</h3>
              <p>No more visiting multiple websites - find and compare all options in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Loan?</h2>
            <p>Join thousands of organizations who have found their ideal financing solution</p>
            <div className="cta-actions">
              <Link to="/search" className="btn btn-primary">
                Start Your Search
              </Link>
              <Link to="/eligibility" className="btn btn-secondary">
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
