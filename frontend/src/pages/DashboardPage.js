import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, Award, ExternalLink, Trash2, Eye, Plus, Users } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';

const DashboardPage = () => {
  const { loans, savedLoans, comparisonList, dispatch, userProfile } = useLoan();
  const [activeTab, setActiveTab] = useState('saved');

  const savedLoanDetails = loans.filter(loan => savedLoans.includes(loan.id));
  const comparisonLoanDetails = loans.filter(loan => comparisonList.includes(loan.id));

  const removeSavedLoan = (loanId) => {
    dispatch({ type: 'REMOVE_SAVED_LOAN', payload: loanId });
  };

  const removeFromComparison = (loanId) => {
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: loanId });
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getProfileCompleteness = () => {
    const fields = ['age', 'income', 'organizationType', 'businessAge', 'sector'];
    const completedFields = fields.filter(field => userProfile[field] && userProfile[field] !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <User size={48} className="user-icon" />
            <div>
              <h1>Your Dashboard</h1>
              <p>Manage your saved loans and track your applications</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-card">
            <h2>Your Profile</h2>
            <div className="profile-completeness">
              <div className="completeness-bar">
                <div 
                  className="completeness-fill" 
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
              <span className="completeness-text">{profileCompleteness}% Complete</span>
            </div>
            
            {profileCompleteness < 100 ? (
              <div className="profile-incomplete">
                <p>Complete your profile to get better loan recommendations</p>
                <Link to="/eligibility" className="btn btn-outline">
                  Complete Profile
                </Link>
              </div>
            ) : (
              <div className="profile-complete">
                <div className="profile-details">
                  <div className="profile-item">
                    <span className="profile-label">Organization Type:</span>
                    <span className="profile-value">{userProfile.organizationType || 'Not specified'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Business Sector:</span>
                    <span className="profile-value">{userProfile.sector || 'Not specified'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Annual Income:</span>
                    <span className="profile-value">
                      {userProfile.income ? formatAmount(userProfile.income) : 'Not specified'}
                    </span>
                  </div>
                </div>
                <Link to="/eligibility" className="btn btn-outline">
                  Update Profile
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <Heart size={16} />
            Saved Loans ({savedLoans.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <Award size={16} />
            Comparison List ({comparisonList.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'saved' && (
            <div className="saved-loans-section">
              {savedLoanDetails.length === 0 ? (
                <div className="empty-state">
                  <Heart size={64} className="empty-icon" />
                  <h3>No Saved Loans</h3>
                  <p>Save loans while browsing to keep track of your favorites</p>
                  <Link to="/search" className="btn btn-primary">
                    <Plus size={16} />
                    Browse Loans
                  </Link>
                </div>
              ) : (
                <div className="loans-grid">
                  {savedLoanDetails.map((loan) => (
                    <div key={loan.id} className="dashboard-loan-card">
                      <div className="loan-header">
                        <div className="loan-title-info">
                          <h3 className="loan-name">{loan.name}</h3>
                          <p className="loan-lender">{loan.lender}</p>
                          <div className="loan-badges">
                            <span className={`badge badge-${loan.lenderType}`}>
                              {loan.lenderType.charAt(0).toUpperCase() + loan.lenderType.slice(1)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSavedLoan(loan.id)}
                          className="remove-btn"
                          title="Remove from saved"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="loan-quick-info">
                        <div className="info-item">
                          <span className="info-label">Interest Rate</span>
                          <span className="info-value">{loan.interestRate}</span>
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
                      </div>

                      <div className="loan-actions">
                        <Link to={`/loan/${loan.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} />
                          View Details
                        </Link>
                        <a
                          href={loan.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <ExternalLink size={14} />
                          Apply Now
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="comparison-section">
              {comparisonLoanDetails.length === 0 ? (
                <div className="empty-state">
                  <Award size={64} className="empty-icon" />
                  <h3>No Loans in Comparison</h3>
                  <p>Add loans to your comparison list to analyze them side-by-side</p>
                  <Link to="/search" className="btn btn-primary">
                    <Plus size={16} />
                    Browse Loans
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="comparison-actions">
                    <p>{comparisonList.length} loan{comparisonList.length > 1 ? 's' : ''} ready for comparison</p>
                    <Link to="/compare" className="btn btn-primary">
                      <Award size={16} />
                      Compare All
                    </Link>
                  </div>
                  
                  <div className="loans-grid">
                    {comparisonLoanDetails.map((loan) => (
                      <div key={loan.id} className="dashboard-loan-card">
                        <div className="loan-header">
                          <div className="loan-title-info">
                            <h3 className="loan-name">{loan.name}</h3>
                            <p className="loan-lender">{loan.lender}</p>
                            <div className="loan-badges">
                              <span className={`badge badge-${loan.lenderType}`}>
                                {loan.lenderType.charAt(0).toUpperCase() + loan.lenderType.slice(1)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromComparison(loan.id)}
                            className="remove-btn"
                            title="Remove from comparison"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="loan-quick-info">
                          <div className="info-item">
                            <span className="info-label">Interest Rate</span>
                            <span className="info-value">{loan.interestRate}</span>
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
                        </div>

                        <div className="loan-actions">
                          <Link to={`/loan/${loan.id}`} className="btn btn-outline btn-sm">
                            <Eye size={14} />
                            View Details
                          </Link>
                          <a
                            href={loan.applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            <ExternalLink size={14} />
                            Apply Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/search" className="quick-action-card">
              <Plus className="quick-action-icon" />
              <h3>Find More Loans</h3>
              <p>Search through our comprehensive loan database</p>
            </Link>
            <Link to="/eligibility" className="quick-action-card">
              <Users className="quick-action-icon" />
              <h3>Check Eligibility</h3>
              <p>Get personalized loan recommendations</p>
            </Link>
            {comparisonList.length > 1 && (
              <Link to="/compare" className="quick-action-card">
                <Award className="quick-action-icon" />
                <h3>Compare Loans</h3>
                <p>See detailed side-by-side comparison</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
