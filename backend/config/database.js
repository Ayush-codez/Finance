const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('❌ MONGODB_URI is not set in environment variables');
    }

    // Mask credentials in logs
    const safeUri = MONGODB_URI.replace(/\/\/.*@/, '//****:****@');

    console.log('🔗 Connecting to MongoDB...');
    console.log(`📍 URI: ${safeUri}`);

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      bufferCommands: false,
      // bufferMaxEntries: 0
    };

    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });

    mongoose.connection.on('reconnectFailed', () => {
      console.error('🚨 MongoDB reconnection failed');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔄 Mongoose connection closed due to application termination');
      process.exit(0);
    });

    // Auto-create indexes
    await createIndexes();

    // Auto-migrate if SQLite path provided
    if (process.env.SQLITE_PATH) {
      await migrateSQLiteData(process.env.SQLITE_PATH);
    }

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);

    console.log('\n📋 MongoDB Connection Guide:');
    console.log('1. Make sure MongoDB is running locally or in the cloud');
    console.log('2. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.log('3. Or use MongoDB Atlas: https://cloud.mongodb.com/');
    console.log('4. Set MONGODB_URI in environment variables\n');

    process.exit(1);
  }
};

// Health check
const checkDBHealth = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const stats = await mongoose.connection.db.stats();
      return {
        status: 'healthy',
        connected: true,
        database: mongoose.connection.name,
        collections: stats.collections,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
      };
    }
    return {
      status: 'unhealthy',
      connected: false,
      readyState: mongoose.connection.readyState
    };
  } catch (error) {
    return {
      status: 'error',
      connected: false,
      error: error.message
    };
  }
};

// Create indexes
const createIndexes = async () => {
  try {
    console.log('🔍 Creating database indexes...');
    const LoanApplication = require('../models/LoanApplication');
    const UserAnalytics = require('../models/UserAnalytics');

    await Promise.all([
      LoanApplication.createIndexes(),
      UserAnalytics.createIndexes()
    ]);

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

// SQLite migration
const migrateSQLiteData = async (sqliteDbPath) => {
  try {
    console.log('🔄 Starting data migration from SQLite...');

    const sqlite3 = require('sqlite3').verbose();
    const LoanApplication = require('../models/LoanApplication');
    const UserAnalytics = require('../models/UserAnalytics');

    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(sqliteDbPath, async (err) => {
        if (err) {
          console.log('ℹ️  SQLite database not found, skipping migration');
          resolve({ migrated: false, reason: 'SQLite not found' });
          return;
        }

        try {
          db.all("SELECT * FROM loan_applications", async (err, rows) => {
            if (err) return reject(err);

            if (rows?.length > 0) {
              console.log(`📊 Migrating ${rows.length} loan applications...`);
              const existingCount = await LoanApplication.countDocuments();

              if (existingCount === 0) {
                const applications = rows.map(row => ({
                  loanId: row.loan_id,
                  loanName: row.loan_name,
                  lender: row.lender,
                  country: row.country,
                  category: row.category,
                  lenderType: row.lender_type,
                  applicationUrl: row.application_url,
                  userIp: row.user_ip,
                  userAgent: row.user_agent,
                  status: 'clicked',
                  clickedAt: new Date(row.timestamp),
                  createdAt: new Date(row.timestamp),
                  updatedAt: new Date(row.timestamp)
                }));

                await LoanApplication.insertMany(applications);
                console.log(`✅ Migrated ${applications.length} loan applications`);
              } else {
                console.log('ℹ️ Loan applications already exist, skipping migration');
              }
            }

            db.all("SELECT * FROM user_analytics", async (err, analyticsRows) => {
              if (!err && analyticsRows?.length > 0) {
                console.log(`📊 Migrating ${analyticsRows.length} analytics records...`);
                const existingAnalyticsCount = await UserAnalytics.countDocuments();

                if (existingAnalyticsCount === 0) {
                  const analytics = analyticsRows.map(row => ({
                    sessionId: row.session_id || 'unknown',
                    action: row.action || 'other',
                    page: row.page,
                    data: row.data ? JSON.parse(row.data) : {},
                    createdAt: new Date(row.timestamp),
                    updatedAt: new Date(row.timestamp)
                  }));

                  await UserAnalytics.insertMany(analytics);
                  console.log(`✅ Migrated ${analytics.length} analytics records`);
                } else {
                  console.log('ℹ️ Analytics data already exists, skipping migration');
                }
              }

              db.close();
              resolve({
                migrated: true,
                loanApplications: rows?.length || 0,
                analytics: analyticsRows?.length || 0
              });
            });
          });
        } catch (error) {
          db.close();
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    return { migrated: false, error: error.message };
  }
};

module.exports = {
  connectDB,
  checkDBHealth,
  createIndexes,
  migrateSQLiteData
};
