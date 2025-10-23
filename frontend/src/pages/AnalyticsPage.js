import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Globe, Users, Clock, ExternalLink } from 'lucide-react';
import { getApplicationStats, getApplicationAnalytics, getPopularLoans } from '../services/apiService';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [popularLoans, setPopularLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [statsResponse, applicationsResponse, popularLoansResponse] = await Promise.all([
        getApplicationStats(),
        getApplicationAnalytics(20, 0),
        getPopularLoans()
      ]);

      setStats(statsResponse.data);
      setApplications(applicationsResponse.data);
      setPopularLoans(popularLoansResponse.data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="container">
          <div className="loading-state">
            <TrendingUp size={48} className="loading-icon" />
            <h2>Loading Analytics...</h2>
            <p>Fetching application data from database</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="container">
          <div className="error-state">
            <BarChart size={48} className="error-icon" />
            <h2>Analytics Unavailable</h2>
            <p>{error}</p>
            <button onClick={fetchAnalyticsData} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="container">
        {/* Header */}
        <div className="analytics-header">
          <BarChart size={48} className="page-icon" />
          <h1>Loan Application Analytics</h1>
          <p>Track and analyze user engagement with loan schemes</p>
        </div>

        {/* Overview Stats */}
        <div className="stats-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <ExternalLink className="stat-icon" size={32} />
              <div className="stat-content">
                <div className="stat-value">{stats?.total?.[0]?.count || 0}</div>
                <div className="stat-label">Total Applications</div>
              </div>
            </div>
            <div className="stat-card">
              <Globe className="stat-icon" size={32} />
              <div className="stat-content">
                <div className="stat-value">{stats?.byCountry?.length || 0}</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" size={32} />
              <div className="stat-content">
                <div className="stat-value">{stats?.byCategory?.length || 0}</div>
                <div className="stat-label">Loan Categories</div>
              </div>
            </div>
            <div className="stat-card">
              <TrendingUp className="stat-icon" size={32} />
              <div className="stat-content">
                <div className="stat-value">{stats?.recent?.length || 0}</div>
                <div className="stat-label">Active Days (30d)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-content">
          {/* Popular Loans */}
          <div className="analytics-card">
            <h2>Most Applied Loans</h2>
            {popularLoans.length > 0 ? (
              <div className="popular-loans-list">
                {popularLoans.map((loan, index) => (
                  <div key={loan.loan_id} className="popular-loan-item">
                    <div className="loan-rank">#{index + 1}</div>
                    <div className="loan-info">
                      <h3>{loan.loan_name}</h3>
                      <p>{loan.lender} • {loan.country}</p>
                      <span className={`badge badge-${loan.category}`}>
                        {loan.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="application-count">
                      <span className="count">{loan.application_count}</span>
                      <span className="label">applications</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No application data available yet</p>
              </div>
            )}
          </div>

          {/* Applications by Country */}
          <div className="analytics-card">
            <h2>Applications by Country</h2>
            {stats?.byCountry && stats.byCountry.length > 0 ? (
              <div className="country-stats">
                {stats.byCountry.map((item) => (
                  <div key={item.country} className="country-item">
                    <div className="country-info">
                      <span className="country-name">{item.country}</span>
                      <div className="country-bar">
                        <div 
                          className="country-fill"
                          style={{ 
                            width: `${(item.count / stats.byCountry[0].count) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="country-count">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No country data available yet</p>
              </div>
            )}
          </div>

          {/* Applications by Category */}
          <div className="analytics-card">
            <h2>Applications by Category</h2>
            {stats?.byCategory && stats.byCategory.length > 0 ? (
              <div className="category-stats">
                {stats.byCategory.map((item) => (
                  <div key={item.category} className="category-item">
                    <span className={`badge badge-${item.category}`}>
                      {item.category.toUpperCase()}
                    </span>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ 
                          width: `${(item.count / stats.byCategory[0].count) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="category-count">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No category data available yet</p>
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="analytics-card">
            <h2>Recent Applications</h2>
            {applications.length > 0 ? (
              <div className="recent-applications">
                {applications.slice(0, 10).map((app) => (
                  <div key={app.id} className="application-item">
                    <div className="application-info">
                      <h4>{app.loan_name}</h4>
                      <p>{app.lender} • {app.country}</p>
                      <div className="application-meta">
                        <span className={`badge badge-${app.category}`}>
                          {app.category}
                        </span>
                        <span className="timestamp">
                          <Clock size={14} />
                          {formatDate(app.timestamp)}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={app.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No recent applications to show</p>
              </div>
            )}
          </div>
        </div>

        <div className="analytics-footer">
          <button onClick={fetchAnalyticsData} className="btn btn-secondary">
            Refresh Data
          </button>
          <p className="last-updated">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;