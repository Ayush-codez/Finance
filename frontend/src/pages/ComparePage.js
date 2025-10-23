import React from 'react';
import { Link } from 'react-router-dom';
import { Award, X, ExternalLink, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useLoan } from '../contexts/LoanContext';

const ComparePage = () => {
  const { loans, comparisonList, dispatch } = useLoan();

  const compareLoans = loans.filter(loan => comparisonList.includes(loan.id));

  const removeFromComparison = (loanId) => {
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: loanId });
  };

  const clearComparison = () => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  };

  const formatAmount = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getInterestRateValue = (rateString) => {
    const match = rateString.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const getBestValueIndicator = (loans, field, isLowerBetter = true) => {
    if (loans.length === 0) return {};
    
    let bestValue, bestIndex;
    
    switch (field) {
      case 'interestRate':
        const rates = loans.map(loan => getInterestRateValue(loan.interestRate));
        bestValue = Math.min(...rates);
        bestIndex = rates.indexOf(bestValue);
        break;
      case 'processingFee':
        const fees = loans.map(loan => parseFloat(loan.processingFee.replace('%', '')));
        bestValue = Math.min(...fees);
        bestIndex = fees.indexOf(bestValue);
        break;
      case 'maxAmount':
        const amounts = loans.map(loan => loan.loanAmount.max);
        bestValue = Math.max(...amounts);
        bestIndex = amounts.indexOf(bestValue);
        break;
      case 'processingTime':
        // Simplified - could be more sophisticated
        bestIndex = 0;
        break;
      default:
        bestIndex = -1;
    }
    
    return { bestIndex };
  };

  if (compareLoans.length === 0) {
    return (
      <div className="compare-page">
        <div className="container">
          <div className="empty-comparison">
            <Award size={64} className="empty-icon" />
            <h2>No Loans Selected for Comparison</h2>
            <p>Add loans to your comparison list to see them side-by-side</p>
            <Link to="/search" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const interestBest = getBestValueIndicator(compareLoans, 'interestRate');
  const feeBest = getBestValueIndicator(compareLoans, 'processingFee');
  const amountBest = getBestValueIndicator(compareLoans, 'maxAmount', false);

  return (
    <div className="compare-page">
      <div className="container">
        {/* Header */}
        <div className="compare-header">
          <div className="compare-title-section">
            <h1>Loan Comparison</h1>
            <p>Compare {compareLoans.length} selected loans side-by-side</p>
          </div>
          <div className="compare-actions">
            <button onClick={clearComparison} className="btn btn-outline">
              Clear All
            </button>
            <Link to="/search" className="btn btn-secondary">
              <ArrowLeft size={16} />
              Back to Search
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="comparison-table">
          <div className="comparison-scroll">
            <table>
              <thead>
                <tr>
                  <th className="feature-column">Features</th>
                  {compareLoans.map((loan) => (
                    <th key={loan.id} className="loan-column">
                      <div className="loan-header-info">
                        <div className="loan-name">{loan.name}</div>
                        <div className="loan-lender">{loan.lender}</div>
                        <button
                          onClick={() => removeFromComparison(loan.id)}
                          className="remove-btn"
                          title="Remove from comparison"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Info */}
                <tr>
                  <td className="feature-name">Lender Type</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      <span className={`badge badge-${loan.lenderType}`}>
                        {loan.lenderType.charAt(0).toUpperCase() + loan.lenderType.slice(1)}
                      </span>
                    </td>
                  ))}
                </tr>
                
                <tr>
                  <td className="feature-name">Category</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      <span className={`badge badge-${loan.category}`}>
                        {loan.category.toUpperCase()}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Interest Rate</td>
                  {compareLoans.map((loan, index) => (
                    <td key={loan.id} className={index === interestBest.bestIndex ? 'best-value' : ''}>
                      <div className="comparison-value">
                        {loan.interestRate}
                        {index === interestBest.bestIndex && (
                          <CheckCircle size={16} className="best-indicator" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Loan Amount Range</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {formatAmount(loan.loanAmount.min)} - {formatAmount(loan.loanAmount.max)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Maximum Amount</td>
                  {compareLoans.map((loan, index) => (
                    <td key={loan.id} className={index === amountBest.bestIndex ? 'best-value' : ''}>
                      <div className="comparison-value">
                        {formatAmount(loan.loanAmount.max)}
                        {index === amountBest.bestIndex && (
                          <CheckCircle size={16} className="best-indicator" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Processing Fee</td>
                  {compareLoans.map((loan, index) => (
                    <td key={loan.id} className={index === feeBest.bestIndex ? 'best-value' : ''}>
                      <div className="comparison-value">
                        {loan.processingFee}
                        {index === feeBest.bestIndex && (
                          <CheckCircle size={16} className="best-indicator" />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Repayment Term</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.repaymentTerm.min === 0 && loan.repaymentTerm.max === 0 
                        ? 'Grant (No repayment)' 
                        : `${loan.repaymentTerm.min}-${loan.repaymentTerm.max} months`}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Collateral Required</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.collateral ? (
                        <span className="collateral-required">
                          <XCircle size={16} />
                          Yes
                        </span>
                      ) : (
                        <span className="collateral-not-required">
                          <CheckCircle size={16} />
                          No
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Processing Time</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>{loan.processingTime}</td>
                  ))}
                </tr>

                {/* Eligibility Criteria */}
                <tr className="section-header">
                  <td colSpan={compareLoans.length + 1}>
                    <strong>Eligibility Criteria</strong>
                  </td>
                </tr>

                <tr>
                  <td className="feature-name">Age Range</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.eligibility.minAge} - {loan.eligibility.maxAge} years
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Minimum Income</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.eligibility.minIncome === 0 ? 'No requirement' : formatAmount(loan.eligibility.minIncome)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Minimum Credit Score</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.eligibility.creditScoreMin === 0 ? 'Not required' : loan.eligibility.creditScoreMin}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="feature-name">Business Age (months)</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      {loan.eligibility.businessAge === 0 ? 'New business accepted' : `${loan.eligibility.businessAge}+ months`}
                    </td>
                  ))}
                </tr>

                {/* Benefits */}
                <tr className="section-header">
                  <td colSpan={compareLoans.length + 1}>
                    <strong>Key Benefits</strong>
                  </td>
                </tr>

                <tr>
                  <td className="feature-name">Benefits</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      <ul className="benefits-list">
                        {loan.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="feature-name">Actions</td>
                  {compareLoans.map((loan) => (
                    <td key={loan.id}>
                      <div className="action-buttons">
                        <Link to={`/loan/${loan.id}`} className="btn btn-outline btn-sm">
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
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Comparison Tips */}
        <div className="comparison-tips">
          <h3>Comparison Tips</h3>
          <ul>
            <li><strong>Interest Rate:</strong> Lower rates mean less total cost over the loan term</li>
            <li><strong>Processing Fee:</strong> One-time fee charged by the lender</li>
            <li><strong>Collateral:</strong> Whether you need to provide security against the loan</li>
            <li><strong>Processing Time:</strong> How quickly you can expect loan approval and disbursement</li>
            <li><strong>Eligibility:</strong> Make sure you meet all criteria before applying</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
