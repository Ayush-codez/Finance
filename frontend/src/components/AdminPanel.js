import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [systemStatus, setSystemStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');

  // Fetch system status
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/loans/system/status');
      const data = await response.json();
      if (data.success) {
        setSystemStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
      addLog('error', `Failed to fetch system status: ${error.message}`);
    }
  };

  // Refresh data from specific source
  const refreshData = async (source, options = {}) => {
    setRefreshing(true);
    addLog('info', `Starting refresh from ${source}...`);

    try {
      const response = await fetch('/api/loans/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, ...options })
      });

      const data = await response.json();
      
      if (data.success) {
        addLog('success', data.message);
        if (data.validation) {
          addLog('info', `Validation: ${data.validation.valid}/${data.validation.total} loans valid`);
        }
        // Refresh system status after successful refresh
        setTimeout(fetchSystemStatus, 2000);
      } else {
        addLog('error', `Refresh failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      addLog('error', `Refresh error: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Clear cache
  const clearCache = async () => {
    try {
      const response = await fetch('/api/loans/system/cache/clear', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (data.success) {
        addLog('success', 'Cache cleared successfully');
        fetchSystemStatus();
      } else {
        addLog('error', `Failed to clear cache: ${data.message}`);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      addLog('error', `Cache clear error: ${error.message}`);
    }
  };

  // Trigger scheduler job
  const triggerSchedulerJob = async (jobName) => {
    setRefreshing(true);
    addLog('info', `Triggering scheduler job: ${jobName}`);

    try {
      const response = await fetch('/api/loans/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source: 'scheduler', job: jobName })
      });

      const data = await response.json();
      
      if (data.success) {
        addLog('success', data.message);
        setTimeout(fetchSystemStatus, 2000);
      } else {
        addLog('error', `Scheduler job failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error triggering scheduler job:', error);
      addLog('error', `Scheduler job error: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Add log entry
  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      type,
      message,
      timestamp,
      id: Date.now() + Math.random()
    }, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  // Format uptime
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Format memory usage
  const formatMemory = (bytes) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  useEffect(() => {
    fetchSystemStatus();
    setLoading(false);

    // Auto-refresh system status every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="admin-panel loading">Loading admin panel...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🔧 Real-time Data Management</h1>
        <p>Monitor and manage loan data sources, cache, and system health</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'status' ? 'active' : ''} 
          onClick={() => setActiveTab('status')}
        >
          System Status
        </button>
        <button 
          className={activeTab === 'refresh' ? 'active' : ''} 
          onClick={() => setActiveTab('refresh')}
        >
          Data Refresh
        </button>
        <button 
          className={activeTab === 'logs' ? 'active' : ''} 
          onClick={() => setActiveTab('logs')}
        >
          Activity Logs
        </button>
      </div>

      {activeTab === 'status' && (
        <div className="admin-content">
          {systemStatus && (
            <>
              {/* Scheduler Status */}
              <div className="status-card">
                <h3>📅 Scheduler Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="label">Running:</span>
                    <span className={`status ${systemStatus.scheduler.isRunning ? 'success' : 'error'}`}>
                      {systemStatus.scheduler.isRunning ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="label">Active Jobs:</span>
                    <span className="value">{systemStatus.scheduler.jobs?.length || 0}</span>
                  </div>
                </div>
                
                {systemStatus.scheduler.lastRunStatus && (
                  <div className="job-status">
                    <h4>Job Status</h4>
                    {Object.entries(systemStatus.scheduler.lastRunStatus).map(([jobName, status]) => (
                      <div key={jobName} className="job-item">
                        <span className="job-name">{jobName}:</span>
                        <span className={`job-status ${status.status}`}>{status.status}</span>
                        {status.lastRun && (
                          <span className="job-time">
                            {new Date(status.lastRun).toLocaleString()}
                          </span>
                        )}
                        {status.error && (
                          <div className="job-error">Error: {status.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cache Status */}
              <div className="status-card">
                <h3>💾 Cache Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="label">Redis:</span>
                    <span className={`status ${systemStatus.cache.redis.available ? 'success' : 'warning'}`}>
                      {systemStatus.cache.redis.available ? '✅ Connected' : '⚠️ File-based'}
                    </span>
                  </div>
                  <div className="status-item">
                    <span className="label">Cached Files:</span>
                    <span className="value">{systemStatus.cache.file.files}</span>
                  </div>
                  <div className="status-item">
                    <span className="label">Cache Size:</span>
                    <span className="value">{formatMemory(systemStatus.cache.file.totalSize)}</span>
                  </div>
                </div>

                <button className="btn btn-warning" onClick={clearCache}>
                  🗑️ Clear Cache
                </button>
              </div>

              {/* API Integration Status */}
              <div className="status-card">
                <h3>🔗 API Integration</h3>
                <div className="api-sources">
                  {Object.entries(systemStatus.apiIntegration.enabledSources).map(([source, enabled]) => (
                    <div key={source} className="api-source">
                      <span className={`api-status ${enabled ? 'enabled' : 'disabled'}`}>
                        {enabled ? '✅' : '❌'} {source}
                      </span>
                      {enabled && systemStatus.apiIntegration.rateLimits[source] && (
                        <span className="rate-limit">
                          {systemStatus.apiIntegration.rateLimits[source].used}/
                          {systemStatus.apiIntegration.rateLimits[source].limit}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="status-card">
                <h3>⚙️ System Info</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <span className="label">Node.js:</span>
                    <span className="value">{systemStatus.system.nodeVersion}</span>
                  </div>
                  <div className="status-item">
                    <span className="label">Uptime:</span>
                    <span className="value">{formatUptime(systemStatus.system.uptime)}</span>
                  </div>
                  <div className="status-item">
                    <span className="label">Memory:</span>
                    <span className="value">{formatMemory(systemStatus.system.memoryUsage.heapUsed)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'refresh' && (
        <div className="admin-content">
          <div className="refresh-controls">
            <h3>🔄 Data Source Management</h3>
            
            <div className="refresh-section">
              <h4>API Data Sources</h4>
              <div className="button-group">
                <button 
                  className="btn btn-primary" 
                  onClick={() => refreshData('api')}
                  disabled={refreshing}
                >
                  {refreshing ? '⏳ Refreshing...' : '🔄 Refresh All APIs'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => refreshData('api', { clearCache: 'true' })}
                  disabled={refreshing}
                >
                  🚀 Force Refresh (Clear Cache)
                </button>
              </div>
            </div>

            <div className="refresh-section">
              <h4>Web Scraping</h4>
              <div className="button-group">
                <button 
                  className="btn btn-primary" 
                  onClick={() => refreshData('scraper')}
                  disabled={refreshing}
                >
                  {refreshing ? '⏳ Scraping...' : '🕷️ Refresh Scraped Data'}
                </button>
              </div>
            </div>

            <div className="refresh-section">
              <h4>Scheduler Jobs</h4>
              <div className="button-group">
                <button 
                  className="btn btn-success" 
                  onClick={() => triggerSchedulerJob('dailyRefresh')}
                  disabled={refreshing}
                >
                  📅 Daily Refresh
                </button>
                <button 
                  className="btn btn-info" 
                  onClick={() => triggerSchedulerJob('hourlyGovernmentRefresh')}
                  disabled={refreshing}
                >
                  🏛️ Government Schemes
                </button>
                <button 
                  className="btn btn-warning" 
                  onClick={() => triggerSchedulerJob('weeklyCleanup')}
                  disabled={refreshing}
                >
                  🧹 Weekly Cleanup
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => triggerSchedulerJob('healthCheck')}
                  disabled={refreshing}
                >
                  🩺 Health Check
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="admin-content">
          <div className="logs-section">
            <div className="logs-header">
              <h3>📋 Activity Logs</h3>
              <button className="btn btn-small" onClick={() => setLogs([])}>
                Clear Logs
              </button>
            </div>
            <div className="logs-container">
              {logs.length === 0 ? (
                <div className="no-logs">No logs available. Perform some actions to see logs here.</div>
              ) : (
                logs.map(log => (
                  <div key={log.id} className={`log-entry ${log.type}`}>
                    <span className="log-time">{log.timestamp}</span>
                    <span className={`log-type ${log.type}`}>
                      {log.type === 'success' ? '✅' : log.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="admin-footer">
        <p>Last updated: {systemStatus?.system?.timestamp ? new Date(systemStatus.system.timestamp).toLocaleString() : 'Never'}</p>
        <button className="btn btn-small" onClick={fetchSystemStatus}>
          🔄 Refresh Status
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;