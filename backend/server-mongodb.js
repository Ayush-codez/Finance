const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// MongoDB connection and models
const { connectDB, checkDBHealth, createIndexes, migrateSQLiteData } = require('./config/database');
const LoanApplication = require('./models/LoanApplication');
const UserAnalytics = require('./models/UserAnalytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware (optional)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Initialize database connection
const initializeApp = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create indexes for better performance
    await createIndexes();
    
    // Optional: Migrate existing SQLite data
    const sqliteDbPath = path.join(__dirname, 'loan_applications.db');
    try {
      const migrationResult = await migrateSQLiteData(sqliteDbPath);
      if (migrationResult.migrated) {
        console.log('✅ Data migration completed successfully');
      }
    } catch (migrationError) {
      console.log('ℹ️  No SQLite data to migrate, continuing with fresh database');
    }
    
    console.log('🚀 Application initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

// API Routes

// Track loan application clicks
app.post('/api/track-application', async (req, res) => {
  try {
    const {
      loanId,
      loanName,
      lender,
      country,
      category,
      lenderType,
      applicationUrl,
      sessionId,
      referrer,
      loanAmount,
      interestRate
    } = req.body;

    // Validate required fields
    if (!loanId || !loanName || !lender || !country || !category || !lenderType || !applicationUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        required: ['loanId', 'loanName', 'lender', 'country', 'category', 'lenderType', 'applicationUrl']
      });
    }

    const userIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.get('User-Agent') || '';

    // Create new loan application record
    const loanApplication = new LoanApplication({
      loanId,
      loanName,
      lender,
      country,
      category,
      lenderType: lenderType.toLowerCase(),
      applicationUrl,
      userIp,
      userAgent,
      sessionId,
      referrer,
      loanAmount: loanAmount ? {
        requested: loanAmount.requested,
        min: loanAmount.min,
        max: loanAmount.max
      } : undefined,
      interestRate,
      status: 'clicked'
    });

    const savedApplication = await loanApplication.save();
    
    // Also track this as a user analytics event
    const analyticsEvent = new UserAnalytics({
      sessionId: sessionId || 'unknown',
      action: 'loan_click',
      page: req.get('Referer') || 'unknown',
      data: {
        loanId,
        loanName,
        lender,
        category
      },
      userIp,
      userAgent
    });
    
    // Enrich with device info
    analyticsEvent.enrichWithDeviceInfo(userAgent);
    await analyticsEvent.save();

    console.log(`✅ Tracked application for loan: ${loanName} (ID: ${savedApplication._id})`);
    
    res.json({ 
      success: true, 
      id: savedApplication._id,
      message: 'Application tracked successfully',
      timestamp: savedApplication.createdAt
    });
    
  } catch (error) {
    console.error('❌ Error tracking loan application:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to track application',
      message: error.message
    });
  }
});

// Update application status (for tracking user journey)
app.patch('/api/track-application/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['clicked', 'redirected', 'completed', 'abandoned'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: clicked, redirected, completed, abandoned'
      });
    }
    
    const application = await LoanApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Use the appropriate method based on status
    switch (status) {
      case 'redirected':
        await application.markAsRedirected();
        break;
      case 'completed':
        await application.markAsCompleted();
        break;
      case 'abandoned':
        await application.markAsAbandoned();
        break;
      default:
        application.status = status;
        await application.save();
    }
    
    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      application: {
        id: application._id,
        status: application.status,
        updatedAt: application.updatedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating application status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update application status',
      message: error.message
    });
  }
});

// Track general user analytics
app.post('/api/track-analytics', async (req, res) => {
  try {
    const {
      sessionId,
      action,
      page,
      data,
      utm
    } = req.body;

    if (!sessionId || !action) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and action are required'
      });
    }

    const userIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.get('User-Agent') || '';
    const referrer = req.get('Referer');

    const analyticsEvent = new UserAnalytics({
      sessionId,
      action,
      page,
      data,
      userIp,
      userAgent,
      referrer,
      utm
    });

    analyticsEvent.enrichWithDeviceInfo(userAgent);
    await analyticsEvent.save();

    res.json({
      success: true,
      message: 'Analytics event tracked successfully'
    });

  } catch (error) {
    console.error('❌ Error tracking analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track analytics',
      message: error.message
    });
  }
});

// Get application analytics
app.get('/api/analytics/applications', async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      country, 
      category, 
      lenderType, 
      status,
      startDate,
      endDate 
    } = req.query;
    
    // Build filter query
    const filter = {};
    if (country) filter.country = country;
    if (category) filter.category = category;
    if (lenderType) filter.lenderType = lenderType;
    if (status) filter.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    // Get applications with pagination
    const applications = await LoanApplication
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('-userAgent -userIp') // Exclude sensitive data
      .lean();
    
    // Get total count for pagination
    const total = await LoanApplication.countDocuments(filter);
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Get application statistics
app.get('/api/analytics/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
    
    // Get comprehensive stats using aggregation
    const [stats] = await LoanApplication.getStats();
    
    // Get additional time-based stats
    const recentStats = await LoanApplication.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          recentTotal: { $sum: 1 },
          avgPerDay: { $avg: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        ...stats,
        period: `${days} days`,
        recent: recentStats[0] || { recentTotal: 0, avgPerDay: 0 }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Get popular loans (most applied)
app.get('/api/analytics/popular-loans', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const popularLoans = await LoanApplication.getPopularLoans(parseInt(limit));
    
    res.json({
      success: true,
      data: popularLoans
    });
    
  } catch (error) {
    console.error('❌ Error fetching popular loans:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch popular loans',
      message: error.message
    });
  }
});

// Get application trends
app.get('/api/analytics/trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const trends = await LoanApplication.getTrends(parseInt(days));
    
    res.json({
      success: true,
      data: trends,
      period: `${days} days`
    });
    
  } catch (error) {
    console.error('❌ Error fetching trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trends',
      message: error.message
    });
  }
});

// Get user analytics
app.get('/api/analytics/user-behavior', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const [pageViews, actionStats, deviceStats, trafficSources] = await Promise.all([
      UserAnalytics.getPageViews(parseInt(days)),
      UserAnalytics.getActionStats(parseInt(days)),
      UserAnalytics.getDeviceStats(parseInt(days)),
      UserAnalytics.getTrafficSources(parseInt(days))
    ]);
    
    res.json({
      success: true,
      data: {
        pageViews,
        actionStats,
        deviceStats,
        trafficSources
      },
      period: `${days} days`
    });
    
  } catch (error) {
    console.error('❌ Error fetching user behavior analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user behavior analytics',
      message: error.message
    });
  }
});

// Get user journey for a specific session
app.get('/api/analytics/user-journey/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const journey = await UserAnalytics.getUserJourney(sessionId);
    
    res.json({
      success: true,
      data: journey,
      sessionId
    });
    
  } catch (error) {
    console.error('❌ Error fetching user journey:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user journey',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await checkDBHealth();
    
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      database: dbHealth,
      version: '2.0.0-mongodb'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Import existing routes
const loansRouter = require('./routes/loans');
const organizationsRouter = require('./routes/organizations');

app.use('/api/loans', loansRouter);
app.use('/api/organizations', organizationsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
const startServer = async () => {
  await initializeApp();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: MongoDB (loan_management)`);
    console.log('📡 API endpoints available:');
    console.log('  POST /api/track-application - Track loan application clicks');
    console.log('  PATCH /api/track-application/:id/status - Update application status');
    console.log('  POST /api/track-analytics - Track user analytics');
    console.log('  GET  /api/analytics/applications - Get application data');
    console.log('  GET  /api/analytics/stats - Get application statistics');
    console.log('  GET  /api/analytics/popular-loans - Get most applied loans');
    console.log('  GET  /api/analytics/trends - Get application trends');
    console.log('  GET  /api/analytics/user-behavior - Get user behavior analytics');
    console.log('  GET  /api/analytics/user-journey/:sessionId - Get user journey');
    console.log('  GET  /api/health - Health check');
    console.log('  GET  /api/loans - Loan data routes');
    console.log('  GET  /api/organizations - Organization routes');
    console.log(`\n💡 Tip: Set MONGODB_URI environment variable for custom MongoDB connection`);
  });
};

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;