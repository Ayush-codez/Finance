import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Heart, Plus, CheckCircle, XCircle, Clock, DollarSign, FileText, Shield, TrendingUp } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';
import { trackLoanApplication } from '../services/apiService';

const LoanDetailsPage = () => {
  const { id } = useParams();
  const { loans, dispatch, savedLoans, comparisonList } = useLoan();
  
  const loan = loans.find(l => l.id === id);

  if (!loan) {
    return (
      <div className="loan-details-page">
        <div className="container">
          <div className="loan-not-found">
            <h2>Loan Not Found</h2>
            <p>The requested loan could not be found.</p>
            <Link to="/search" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleSaveLoan = () => {
    if (savedLoans.includes(loan.id)) {
      dispatch({ type: 'REMOVE_SAVED_LOAN', payload: loan.id });
    } else {
      dispatch({ type: 'SAVE_LOAN', payload: loan.id });
    }
  };

  const toggleComparison = () => {
    if (comparisonList.includes(loan.id)) {
      dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: loan.id });
    } else if (comparisonList.length < 4) {
      dispatch({ type: 'ADD_TO_COMPARISON', payload: loan.id });
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const handleApplyClick = async (e) => {
    // Track the application click in database
    await trackLoanApplication(loan);
    
    // Continue with normal link behavior
    // The link will open in a new tab due to target="_blank"
  };

  const isInComparison = comparisonList.includes(loan.id);
  const isSaved = savedLoans.includes(loan.id);

  return (
    <div className="loan-details-page">
      <div className="container">
        {/* Header */}
        <div className="loan-details-header">
          <Link to="/search" className="back-btn">
            <ArrowLeft size={16} />
            Back to Search
          </Link>
          
          <div className="loan-title-section">
            <h1 className="loan-name">{loan.name}</h1>
            <p className="loan-lender">{loan.lender}</p>
            <div className="loan-badges">
              <span className={`badge badge-${loan.lenderType}`}>
                {loan.lenderType.charAt(0).toUpperCase() + loan.lenderType.slice(1)}
              </span>
              <span className={`badge badge-${loan.category}`}>
                {loan.category.toUpperCase()}
              </span>
              <span className="badge badge-country">
                {loan.country}
              </span>
            </div>
          </div>

          <div className="loan-actions">
            <button
              onClick={toggleSaveLoan}
              className={`action-btn ${isSaved ? 'saved' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save loan'}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={toggleComparison}
              className={`action-btn ${isInComparison ? 'added' : ''}`}
              disabled={!isInComparison && comparisonList.length >= 4}
              title={
                isInComparison 
                  ? 'Remove from comparison' 
                  : comparisonList.length >= 4 
                    ? 'Maximum 4 loans can be compared'
                    : 'Add to comparison'
              }
            >
              <Plus size={20} />
              {isInComparison ? 'In Comparison' : 'Compare'}
            </button>
            <a
              href={loan.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              onClick={handleApplyClick}
            >
              <ExternalLink size={16} />
              Apply Now
            </a>
          </div>
        </div>

        <div className="loan-details-content">
          {/* Key Information Card */}
          <div className="details-card key-info-card">
            <h2>Key Information</h2>
            <div className="key-info-grid">
              <div className="info-item">
                <DollarSign className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Interest Rate</span>
                  <span className="info-value highlight">{loan.interestRate}</span>
                </div>
              </div>
              <div className="info-item">
                <TrendingUp className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Loan Amount</span>
                  <span className="info-value">
                    {formatAmount(loan.loanAmount.min)} - {formatAmount(loan.loanAmount.max)}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Processing Time</span>
                  <span className="info-value">{loan.processingTime}</span>
                </div>
              </div>
              <div className="info-item">
                <FileText className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Processing Fee</span>
                  <span className="info-value">{loan.processingFee}</span>
                </div>
              </div>
              <div className="info-item">
                <Shield className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Collateral</span>
                  <span className={`info-value ${loan.collateral ? 'required' : 'not-required'}`}>
                    {loan.collateral ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <div className="info-content">
                  <span className="info-label">Repayment Term</span>
                  <span className="info-value">
                    {loan.repaymentTerm.min === 0 && loan.repaymentTerm.max === 0 
                      ? 'Grant (No repayment)' 
                      : `${loan.repaymentTerm.min}-${loan.repaymentTerm.max} months`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="details-grid">
            {/* Description */}
            <div className="details-card">
              <h2>About This Loan</h2>
              <p className="loan-description">{loan.description}</p>
            </div>

            {/* Eligibility Criteria */}
            <div className="details-card">
              <h2>Eligibility Criteria</h2>
              <div className="eligibility-list">
                <div className="eligibility-item">
                  <span className="eligibility-label">Age Range:</span>
                  <span className="eligibility-value">{loan.eligibility.minAge} - {loan.eligibility.maxAge} years</span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-label">Minimum Income:</span>
                  <span className="eligibility-value">
                    {loan.eligibility.minIncome === 0 ? 'No requirement' : formatAmount(loan.eligibility.minIncome)}
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-label">Credit Score:</span>
                  <span className="eligibility-value">
                    {loan.eligibility.creditScoreMin === 0 ? 'Not required' : `${loan.eligibility.creditScoreMin}+`}
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-label">Organization Type:</span>
                  <span className="eligibility-value">{loan.eligibility.organizationType.join(', ')}</span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-label">Business Age:</span>
                  <span className="eligibility-value">
                    {loan.eligibility.businessAge === 0 ? 'New business accepted' : `${loan.eligibility.businessAge}+ months`}
                  </span>
                </div>
                <div className="eligibility-item">
                  <span className="eligibility-label">Eligible Sectors:</span>
                  <span className="eligibility-value">{loan.eligibility.sector.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="details-card">
              <h2>Key Benefits</h2>
              <ul className="benefits-list">
                {loan.benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <CheckCircle size={16} className="benefit-icon" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="details-card">
              <h2>Special Features</h2>
              <ul className="features-list">
                {loan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <CheckCircle size={16} className="feature-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="details-card">
              <h2>Required Documents</h2>
              <div className="documents-grid">
                {loan.documents.map((document, index) => (
                  <div key={index} className="document-item">
                    <FileText size={16} className="document-icon" />
                    <span>{document}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div className="details-card">
              <h2>Application Process</h2>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Prepare Documents</h4>
                    <p>Gather all required documents listed above</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Submit Application</h4>
                    <p>Click "Apply Now" to visit the lender's application portal</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Verification</h4>
                    <p>Lender will verify your documents and eligibility</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Approval & Disbursement</h4>
                    <p>Expected processing time: {loan.processingTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="bottom-actions">
            <div className="action-buttons">
              <button
                onClick={toggleSaveLoan}
                className={`btn ${isSaved ? 'btn-saved' : 'btn-outline'}`}
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
                {isSaved ? 'Saved' : 'Save Loan'}
              </button>
              <button
                onClick={toggleComparison}
                className={`btn ${isInComparison ? 'btn-added' : 'btn-outline'}`}
                disabled={!isInComparison && comparisonList.length >= 4}
              >
                <Plus size={16} />
                {isInComparison ? 'In Comparison' : 'Add to Compare'}
              </button>
              {comparisonList.length > 0 && (
                <Link to="/compare" className="btn btn-secondary">
                  View Comparison ({comparisonList.length})
                </Link>
              )}
              <a
                href={loan.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-large"
              >
                <ExternalLink size={16} />
                Apply for This Loan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsPage;
