import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, Plus, Heart, ExternalLink } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';
import { categories, lenderTypes } from '../data/loans';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const {
    filteredLoans,
    searchQuery,
    filters,
    dispatch,
    comparisonList,
    savedLoans
  } = useLoan();

  useEffect(() => {
    // Apply URL parameters to filters
    const category = searchParams.get('category');
    const lenderType = searchParams.get('lenderType');
    
    if (category) {
      dispatch({ type: 'SET_FILTERS', payload: { category } });
    }
    if (lenderType) {
      dispatch({ type: 'SET_FILTERS', payload: { lenderType } });
    }
  }, [searchParams, dispatch]);

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleFilterChange = (filterName, value) => {
    dispatch({ type: 'SET_FILTERS', payload: { [filterName]: value } });
  };

  const clearFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const addToComparison = (loanId) => {
    if (comparisonList.length < 4 && !comparisonList.includes(loanId)) {
      dispatch({ type: 'ADD_TO_COMPARISON', payload: loanId });
    }
  };

  const removeFromComparison = (loanId) => {
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: loanId });
  };

  const toggleSaveLoan = (loanId) => {
    if (savedLoans.includes(loanId)) {
      dispatch({ type: 'REMOVE_SAVED_LOAN', payload: loanId });
    } else {
      dispatch({ type: 'SAVE_LOAN', payload: loanId });
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="search-page">
      <div className="container">
        {/* Search Header */}
        <div className="search-header">
          <h1>Find Your Perfect Loan</h1>
          <p>Search and filter through {filteredLoans.length} loan options</p>
        </div>

        {/* Search and Filters */}
        <div className="search-controls">
          {/* Search Bar */}
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search loans by name, lender, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Lender Type</label>
              <select
                value={filters.lenderType}
                onChange={(e) => handleFilterChange('lenderType', e.target.value)}
              >
                <option value="">All Lenders</option>
                {lenderTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Min Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g., 100000"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g., 5000000"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Max Interest Rate (%)</label>
              <input
                type="number"
                placeholder="e.g., 15"
                value={filters.maxInterestRate}
                onChange={(e) => handleFilterChange('maxInterestRate', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Collateral</label>
              <select
                value={filters.collateralRequired}
                onChange={(e) => handleFilterChange('collateralRequired', e.target.value)}
              >
                <option value="">Any</option>
                <option value="false">No Collateral Required</option>
                <option value="true">Collateral Required</option>
              </select>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              <X size={16} />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="search-results">
          {filteredLoans.length === 0 ? (
            <div className="no-results">
              <Filter size={48} />
              <h3>No loans found</h3>
              <p>Try adjusting your search criteria or filters</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="loans-grid">
              {filteredLoans.map((loan) => (
                <div key={loan.id} className="loan-card">
                  <div className="loan-header">
                    <div className="loan-title-section">
                      <h3 className="loan-name">{loan.name}</h3>
                      <p className="loan-lender">{loan.lender}</p>
                      <div className="loan-badges">
                        <span className={`badge badge-${loan.lenderType}`}>
                          {loan.lenderType.charAt(0).toUpperCase() + loan.lenderType.slice(1)}
                        </span>
                        <span className={`badge badge-${loan.category}`}>
                          {loan.category.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="loan-actions">
                      <button
                        onClick={() => toggleSaveLoan(loan.id)}
                        className={`action-btn ${savedLoans.includes(loan.id) ? 'saved' : ''}`}
                        title={savedLoans.includes(loan.id) ? 'Remove from saved' : 'Save loan'}
                      >
                        <Heart size={20} fill={savedLoans.includes(loan.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => 
                          comparisonList.includes(loan.id) 
                            ? removeFromComparison(loan.id)
                            : addToComparison(loan.id)
                        }
                        className={`action-btn ${comparisonList.includes(loan.id) ? 'added' : ''}`}
                        disabled={!comparisonList.includes(loan.id) && comparisonList.length >= 4}
                        title={
                          comparisonList.includes(loan.id) 
                            ? 'Remove from comparison' 
                            : comparisonList.length >= 4 
                              ? 'Maximum 4 loans can be compared'
                              : 'Add to comparison'
                        }
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="loan-details">
                    <div className="loan-key-info">
                      <div className="info-item">
                        <span className="info-label">Interest Rate</span>
                        <span className="info-value interest-rate">{loan.interestRate}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Amount Range</span>
                        <span className="info-value">
                          {formatAmount(loan.loanAmount.min)} - {formatAmount(loan.loanAmount.max)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Processing Time</span>
                        <span className="info-value">{loan.processingTime}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Collateral</span>
                        <span className={`info-value ${loan.collateral ? 'required' : 'not-required'}`}>
                          {loan.collateral ? 'Required' : 'Not Required'}
                        </span>
                      </div>
                    </div>

                    <p className="loan-description">{loan.description}</p>

                    <div className="loan-benefits">
                      <h4>Key Benefits:</h4>
                      <ul>
                        {loan.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="loan-footer">
                    <Link to={`/loan/${loan.id}`} className="btn btn-outline">
                      View Details
                    </Link>
                    <a
                      href={loan.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <ExternalLink size={16} />
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comparison Bar */}
        {comparisonList.length > 0 && (
          <div className="comparison-bar">
            <div className="comparison-content">
              <span className="comparison-text">
                {comparisonList.length} loan{comparisonList.length > 1 ? 's' : ''} selected for comparison
              </span>
              <div className="comparison-actions">
                <button
                  onClick={() => dispatch({ type: 'CLEAR_COMPARISON' })}
                  className="btn btn-outline btn-sm"
                >
                  Clear All
                </button>
                <Link to="/compare" className="btn btn-primary btn-sm">
                  Compare Selected
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
