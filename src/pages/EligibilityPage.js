import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, AlertCircle, TrendingUp, ExternalLink } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';
import { filterLoansByEligibility } from '../data/loans';

const EligibilityPage = () => {
  const { dispatch } = useLoan();
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    creditScore: '',
    organizationType: '',
    businessAge: '',
    sector: '',
    loanAmount: ''
  });
  const [eligibleLoans, setEligibleLoans] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const organizationTypes = [
    { value: 'startup', label: 'Startup' },
    { value: 'sme', label: 'Small/Medium Enterprise' },
    { value: 'ngo', label: 'Non-Profit Organization' },
    { value: 'individual', label: 'Individual' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'institution', label: 'Educational Institution' }
  ];

  const sectors = [
    { value: 'technology', label: 'Technology' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'services', label: 'Services' },
    { value: 'trading', label: 'Trading' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'fintech', label: 'FinTech' },
    { value: 'e-commerce', label: 'E-commerce' },
    { value: 'social', label: 'Social Sector' },
    { value: 'environment', label: 'Environment' },
    { value: 'allied-activities', label: 'Allied Activities' },
    { value: 'distribution', label: 'Distribution' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userProfile = {
      age: parseInt(formData.age),
      income: parseInt(formData.income),
      creditScore: parseInt(formData.creditScore),
      organizationType: formData.organizationType,
      businessAge: parseInt(formData.businessAge),
      sector: formData.sector
    };

    const eligible = filterLoansByEligibility(userProfile);
    setEligibleLoans(eligible);
    setShowResults(true);

    // Update global user profile
    dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getEligibilityScore = (loan) => {
    // Simple scoring based on how well the loan matches user requirements
    let score = 0;
    
    // Interest rate score (lower is better)
    const interestRate = parseFloat(loan.interestRate.split('-')[0]);
    if (interestRate === 0) score += 30;
    else if (interestRate < 10) score += 25;
    else if (interestRate < 15) score += 20;
    else score += 10;

    // Amount coverage score
    if (formData.loanAmount) {
      const requestedAmount = parseInt(formData.loanAmount);
      if (requestedAmount >= loan.loanAmount.min && requestedAmount <= loan.loanAmount.max) {
        score += 25;
      }
    }

    // Processing time score (faster is better)
    if (loan.processingTime.includes('hour') || loan.processingTime.includes('1-3 days')) score += 20;
    else if (loan.processingTime.includes('days') && !loan.processingTime.includes('90')) score += 15;
    else score += 10;

    // Collateral score (no collateral is better)
    if (!loan.collateral) score += 15;

    // Processing fee score (lower is better)
    const fee = parseFloat(loan.processingFee.replace('%', ''));
    if (fee === 0) score += 10;
    else if (fee < 2) score += 7;
    else score += 5;

    return Math.min(score, 100);
  };

  const sortedEligibleLoans = eligibleLoans
    .map(loan => ({ ...loan, eligibilityScore: getEligibilityScore(loan) }))
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore);

  return (
    <div className="eligibility-page">
      <div className="container">
        <div className="eligibility-header">
          <Users size={48} className="page-icon" />
          <h1>Eligibility Checker</h1>
          <p>Answer a few questions to find loans you're eligible for</p>
        </div>

        {!showResults ? (
          <div className="eligibility-form-container">
            <form onSubmit={handleSubmit} className="eligibility-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="age">Age *</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="16"
                      max="80"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="income">Annual Income (₹) *</label>
                    <input
                      type="number"
                      id="income"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 500000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="creditScore">Credit Score</label>
                    <input
                      type="number"
                      id="creditScore"
                      name="creditScore"
                      value={formData.creditScore}
                      onChange={handleInputChange}
                      min="300"
                      max="900"
                      placeholder="e.g., 750 (optional)"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Organization Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="organizationType">Organization Type *</label>
                    <select
                      id="organizationType"
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select organization type</option>
                      {organizationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="businessAge">Business Age (months) *</label>
                    <input
                      type="number"
                      id="businessAge"
                      name="businessAge"
                      value={formData.businessAge}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="e.g., 12 (0 for new business)"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sector">Business Sector *</label>
                    <select
                      id="sector"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select business sector</option>
                      {sectors.map(sector => (
                        <option key={sector.value} value={sector.value}>
                          {sector.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Loan Requirements</h3>
                <div className="form-group">
                  <label htmlFor="loanAmount">Required Loan Amount (₹)</label>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000000 (optional)"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-large">
                <CheckCircle size={20} />
                Check My Eligibility
              </button>
            </form>
          </div>
        ) : (
          <div className="eligibility-results">
            <div className="results-header">
              <div className="results-summary">
                <h2>Your Eligibility Results</h2>
                <p>Found {eligibleLoans.length} loans you're eligible for</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="btn btn-outline"
              >
                Modify Criteria
              </button>
            </div>

            {eligibleLoans.length === 0 ? (
              <div className="no-eligible-loans">
                <AlertCircle size={48} className="warning-icon" />
                <h3>No Eligible Loans Found</h3>
                <p>Based on your current profile, you don't meet the eligibility criteria for our listed loans.</p>
                <div className="suggestions">
                  <h4>Suggestions to improve eligibility:</h4>
                  <ul>
                    <li>Improve your credit score through timely payments</li>
                    <li>Wait for your business to mature (many loans require 6-12 months of operation)</li>
                    <li>Consider smaller loan amounts to start with</li>
                    <li>Look into government schemes which often have relaxed criteria</li>
                  </ul>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="btn btn-primary"
                >
                  Update My Information
                </button>
              </div>
            ) : (
              <div className="eligible-loans">
                <div className="recommendations-header">
                  <TrendingUp size={24} />
                  <h3>Recommended Loans (Sorted by Best Match)</h3>
                </div>
                
                <div className="loans-list">
                  {sortedEligibleLoans.map((loan, index) => (
                    <div key={loan.id} className="eligible-loan-card">
                      <div className="loan-rank">
                        <span className="rank-number">#{index + 1}</span>
                        <div className="eligibility-score">
                          <div className="score-label">Match Score</div>
                          <div className="score-value">{loan.eligibilityScore}%</div>
                        </div>
                      </div>

                      <div className="loan-info">
                        <div className="loan-basic-info">
                          <h4 className="loan-name">{loan.name}</h4>
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

                        <div className="loan-key-metrics">
                          <div className="metric">
                            <span className="metric-label">Interest Rate</span>
                            <span className="metric-value">{loan.interestRate}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Amount Range</span>
                            <span className="metric-value">
                              {formatAmount(loan.loanAmount.min)} - {formatAmount(loan.loanAmount.max)}
                            </span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Processing Time</span>
                            <span className="metric-value">{loan.processingTime}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Collateral</span>
                            <span className={`metric-value ${loan.collateral ? 'required' : 'not-required'}`}>
                              {loan.collateral ? 'Required' : 'Not Required'}
                            </span>
                          </div>
                        </div>

                        <p className="loan-description">{loan.description}</p>

                        <div className="why-eligible">
                          <h5>Why you're eligible:</h5>
                          <ul>
                            <li>✓ Age requirement: {loan.eligibility.minAge}-{loan.eligibility.maxAge} years</li>
                            <li>✓ Income requirement: {loan.eligibility.minIncome === 0 ? 'No minimum' : `₹${loan.eligibility.minIncome.toLocaleString()}+`}</li>
                            <li>✓ Organization type: {loan.eligibility.organizationType.join(', ')}</li>
                            <li>✓ Business sector: {loan.eligibility.sector.join(', ')}</li>
                            {loan.eligibility.creditScoreMin > 0 && (
                              <li>✓ Credit score: {loan.eligibility.creditScoreMin}+ required</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="loan-actions">
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

                <div className="next-steps">
                  <h3>Next Steps</h3>
                  <div className="next-steps-grid">
                    <div className="step-card">
                      <CheckCircle className="step-icon" />
                      <h4>Review Details</h4>
                      <p>Click "View Details" to see complete information about each loan</p>
                    </div>
                    <div className="step-card">
                      <TrendingUp className="step-icon" />
                      <h4>Compare Options</h4>
                      <p>Add multiple loans to comparison to see side-by-side analysis</p>
                    </div>
                    <div className="step-card">
                      <ExternalLink className="step-icon" />
                      <h4>Apply Online</h4>
                      <p>Click "Apply Now" to be redirected to the lender's application page</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityPage;
