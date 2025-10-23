import React, { useState, useEffect } from 'react';
import {
  Building,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

const OrganizationManagementPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submissionDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ status: '', notes: '', reviewerName: '' });
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  // Fetch organizations data
  useEffect(() => {
    fetchOrganizations();
    fetchStats();
  }, []);

  // Filter and sort organizations
  useEffect(() => {
    let filtered = organizations.filter(org => {
      const matchesSearch = org.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
      const matchesType = typeFilter === 'all' || org.organizationType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'submissionDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredOrganizations(filtered);
  }, [organizations, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/organizations/submissions');
      if (response.ok) {
        const result = await response.json();
        setOrganizations(result.data || []);
      } else {
        console.error('Failed to fetch organizations');
        // Fallback to demo data for development
        setOrganizations(generateDemoData());
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Fallback to demo data for development
      setOrganizations(generateDemoData());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/organizations/stats');
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateDemoData = () => [
    {
      id: 1,
      organizationName: "ABC Bank Ltd",
      organizationType: "Bank",
      contactPerson: "John Doe",
      email: "john@abcbank.com",
      phone: "+1-555-0123",
      address: "123 Main St, City, State",
      country: "India",
      submissionDate: "2024-01-15T10:30:00Z",
      status: "pending",
      loanTypes: ["Personal Loan", "Home Loan", "Car Loan"],
      minLoanAmount: 50000,
      maxLoanAmount: 5000000,
      interestRateRange: "8.5% - 15.5%"
    },
    {
      id: 2,
      organizationName: "QuickCredit NBFC",
      organizationType: "NBFC (Non-Banking Financial Company)",
      contactPerson: "Jane Smith",
      email: "jane@quickcredit.com",
      phone: "+1-555-0456",
      address: "456 Business Ave, Metro City",
      country: "India",
      submissionDate: "2024-01-10T14:20:00Z",
      status: "approved",
      loanTypes: ["Personal Loan", "Business Loan"],
      minLoanAmount: 25000,
      maxLoanAmount: 2000000,
      interestRateRange: "12% - 18%"
    }
  ];

  const handleReview = (org) => {
    setSelectedOrg(org);
    setReviewData({
      status: org.status === 'pending' ? 'approved' : org.status,
      notes: '',
      reviewerName: 'Admin'
    });
    setShowReviewModal(true);
  };

  const handleViewDetails = (org) => {
    setSelectedOrg(org);
    setShowDetailsModal(true);
  };

  const submitReview = async () => {
    try {
      const response = await fetch(`/api/organizations/submissions/${selectedOrg.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        // Update local state
        setOrganizations(prev => 
          prev.map(org => 
            org.id === selectedOrg.id 
              ? { ...org, status: reviewData.status, reviewNotes: reviewData.notes }
              : org
          )
        );
        setShowReviewModal(false);
        fetchStats(); // Update stats
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'warning', text: 'Pending Review' },
      approved: { icon: CheckCircle, color: 'success', text: 'Approved' },
      rejected: { icon: XCircle, color: 'danger', text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`badge badge-${config.color}`}>
        <IconComponent size={14} />
        {config.text}
      </span>
    );
  };

  const organizationTypes = [...new Set(organizations.map(org => org.organizationType))];

  if (loading) {
    return (
      <div className="organization-management-page loading">
        <div className="loading-spinner">
          <RefreshCw size={32} className="spin" />
          <p>Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="organization-management-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <Building size={32} />
              <div>
                <h1>Organization Management</h1>
                <p>Review and manage organization applications</p>
              </div>
            </div>
            <button 
              className="btn btn-outline"
              onClick={fetchOrganizations}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <Building size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Applications</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending Review</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon approved">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rejected">
                <XCircle size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-content">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {organizationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select 
                value={`${sortBy}-${sortOrder}`} 
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="submissionDate-desc">Newest First</option>
                <option value="submissionDate-asc">Oldest First</option>
                <option value="organizationName-asc">Name A-Z</option>
                <option value="organizationName-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations Table */}
      <section className="organizations-section">
        <div className="container">
          <div className="organizations-table-container">
            <table className="organizations-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrganizations.map((org) => (
                  <tr key={org.id}>
                    <td>
                      <div className="org-info">
                        <div className="org-name">{org.organizationName}</div>
                        <div className="org-location">
                          <MapPin size={14} />
                          {org.country}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="org-type">{org.organizationType}</span>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="contact-person">{org.contactPerson}</div>
                        <div className="contact-details">
                          <Mail size={12} />
                          {org.email}
                        </div>
                      </div>
                    </td>
                    <td>{getStatusBadge(org.status)}</td>
                    <td>
                      <div className="submission-date">
                        {formatDate(org.submissionDate)}
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleViewDetails(org)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {org.status === 'pending' && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleReview(org)}
                            title="Review Application"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrganizations.length === 0 && (
              <div className="empty-state">
                <Building size={48} />
                <h3>No organizations found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Organization Details Modal */}
      {showDetailsModal && selectedOrg && (
        <div className="modal-overlay">
          <div className="modal-content org-details-modal">
            <div className="modal-header">
              <h2>
                <Building size={24} />
                {selectedOrg.organizationName}
              </h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="org-details-grid">
                <div className="details-section">
                  <h3>Organization Information</h3>
                  <div className="detail-item">
                    <label>Name:</label>
                    <span>{selectedOrg.organizationName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Type:</label>
                    <span>{selectedOrg.organizationType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    {getStatusBadge(selectedOrg.status)}
                  </div>
                  <div className="detail-item">
                    <label>Submitted:</label>
                    <span>{formatDate(selectedOrg.submissionDate)}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Contact Information</h3>
                  <div className="detail-item">
                    <label>Contact Person:</label>
                    <span>{selectedOrg.contactPerson}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedOrg.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedOrg.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Address:</label>
                    <span>{selectedOrg.address}</span>
                  </div>
                </div>

                <div className="details-section">
                  <h3>Loan Products</h3>
                  <div className="detail-item">
                    <label>Loan Types:</label>
                    <div className="loan-types">
                      {selectedOrg.loanTypes?.map((type, index) => (
                        <span key={index} className="loan-type-tag">{type}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Loan Amount Range:</label>
                    <span>₹{selectedOrg.minLoanAmount?.toLocaleString()} - ₹{selectedOrg.maxLoanAmount?.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Interest Rate:</label>
                    <span>{selectedOrg.interestRateRange}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              {selectedOrg.status === 'pending' && (
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleReview(selectedOrg);
                  }}
                >
                  Review Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedOrg && (
        <div className="modal-overlay">
          <div className="modal-content review-modal">
            <div className="modal-header">
              <h2>Review Application</h2>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="modal-close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="review-org-info">
                <h3>{selectedOrg.organizationName}</h3>
                <p>{selectedOrg.organizationType}</p>
              </div>

              <div className="review-form">
                <div className="form-group">
                  <label>Review Decision:</label>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        value="approved"
                        checked={reviewData.status === 'approved'}
                        onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                      />
                      <CheckCircle size={16} />
                      Approve Application
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        value="rejected"
                        checked={reviewData.status === 'rejected'}
                        onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                      />
                      <XCircle size={16} />
                      Reject Application
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Reviewer Name:</label>
                  <input
                    type="text"
                    value={reviewData.reviewerName}
                    onChange={(e) => setReviewData({...reviewData, reviewerName: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Review Notes:</label>
                  <textarea
                    value={reviewData.notes}
                    onChange={(e) => setReviewData({...reviewData, notes: e.target.value})}
                    placeholder="Add any notes or feedback..."
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn btn-outline"
                onClick={() => setShowReviewModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={submitReview}
                disabled={!reviewData.status || !reviewData.reviewerName}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagementPage;