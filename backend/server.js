const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'loan_applications.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  // Table for tracking loan application clicks
  db.run(`
    CREATE TABLE IF NOT EXISTS loan_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id TEXT NOT NULL,
      loan_name TEXT NOT NULL,
      lender TEXT NOT NULL,
      country TEXT NOT NULL,
      category TEXT NOT NULL,
      lender_type TEXT NOT NULL,
      application_url TEXT NOT NULL,
      user_ip TEXT,
      user_agent TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table for user analytics (optional)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      action TEXT NOT NULL,
      page TEXT,
      data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// API Routes

// Track loan application clicks
app.post('/api/track-application', (req, res) => {
  const {
    loanId,
    loanName,
    lender,
    country,
    category,
    lenderType,
    applicationUrl
  } = req.body;

  const userIp = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || '';

  const query = `
    INSERT INTO loan_applications 
    (loan_id, loan_name, lender, country, category, lender_type, application_url, user_ip, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    loanId,
    loanName,
    lender,
    country,
    category,
    lenderType,
    applicationUrl,
    userIp,
    userAgent
  ], function(err) {
    if (err) {
      console.error('Error inserting loan application:', err);
      res.status(500).json({ error: 'Failed to track application' });
      return;
    }
    
    console.log(`Tracked application for loan: ${loanName} (ID: ${this.lastID})`);
    res.json({ 
      success: true, 
      id: this.lastID,
      message: 'Application tracked successfully' 
    });
  });
});

// Get application analytics
app.get('/api/analytics/applications', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  
  const query = `
    SELECT * FROM loan_applications 
    ORDER BY timestamp DESC 
    LIMIT ? OFFSET ?
  `;

  db.all(query, [parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      console.error('Error fetching applications:', err);
      res.status(500).json({ error: 'Failed to fetch analytics' });
      return;
    }
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  });
});

// Get application statistics
app.get('/api/analytics/stats', (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM loan_applications',
    byCountry: `
      SELECT country, COUNT(*) as count 
      FROM loan_applications 
      GROUP BY country 
      ORDER BY count DESC
    `,
    byCategory: `
      SELECT category, COUNT(*) as count 
      FROM loan_applications 
      GROUP BY category 
      ORDER BY count DESC
    `,
    byLenderType: `
      SELECT lender_type, COUNT(*) as count 
      FROM loan_applications 
      GROUP BY lender_type 
      ORDER BY count DESC
    `,
    recent: `
      SELECT DATE(timestamp) as date, COUNT(*) as count 
      FROM loan_applications 
      WHERE timestamp >= datetime('now', '-30 days')
      GROUP BY DATE(timestamp) 
      ORDER BY date DESC
    `
  };

  const results = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(`Error in ${key} query:`, err);
        results[key] = { error: err.message };
      } else {
        results[key] = rows;
      }
      
      completedQueries++;
      if (completedQueries === totalQueries) {
        res.json({
          success: true,
          data: results
        });
      }
    });
  });
});

// Get popular loans (most applied)
app.get('/api/analytics/popular-loans', (req, res) => {
  const query = `
    SELECT 
      loan_id,
      loan_name,
      lender,
      country,
      category,
      COUNT(*) as application_count
    FROM loan_applications 
    GROUP BY loan_id, loan_name, lender, country, category
    ORDER BY application_count DESC
    LIMIT 10
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching popular loans:', err);
      res.status(500).json({ error: 'Failed to fetch popular loans' });
      return;
    }
    
    res.json({
      success: true,
      data: rows
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${dbPath}`);
  console.log('📡 API endpoints available:');
  console.log('  POST /api/track-application - Track loan application clicks');
  console.log('  GET  /api/analytics/applications - Get application data');
  console.log('  GET  /api/analytics/stats - Get application statistics');
  console.log('  GET  /api/analytics/popular-loans - Get most applied loans');
  console.log('  GET  /api/health - Health check');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;