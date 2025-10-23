#!/usr/bin/env node
/**
 * Migration script to transfer data from SQLite to MongoDB
 * Usage: npm run migrate
 */

const { connectDB, migrateSQLiteData } = require('../config/database');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  console.log('🔄 Starting migration from SQLite to MongoDB...');
  console.log('=' .repeat(50));
  
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');
    
    // Find SQLite database file
    const sqliteDbPath = path.join(__dirname, '../loan_applications.db');
    console.log(`🔍 Looking for SQLite database at: ${sqliteDbPath}`);
    
    // Perform migration
    const result = await migrateSQLiteData(sqliteDbPath);
    
    if (result.migrated) {
      console.log('✅ Migration completed successfully!');
      console.log(`📊 Migrated ${result.loanApplications || 0} loan applications`);
      console.log(`📊 Migrated ${result.analytics || 0} analytics records`);
      console.log('=' .repeat(50));
      console.log('🎉 Your data has been successfully transferred to MongoDB!');
      console.log('💡 You can now start using the MongoDB-based backend.');
      console.log('💡 The SQLite file has been kept as backup.');
    } else {
      console.log('ℹ️  Migration skipped:', result.reason || result.error);
      if (!result.error) {
        console.log('💡 This is normal if you\'re starting fresh with MongoDB.');
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI environment variable');
    console.log('3. Ensure you have proper permissions');
    process.exit(1);
  }
  
  console.log('\n🚀 Migration process completed. You can now start your server with:');
  console.log('   npm run dev    (for development)');
  console.log('   npm start      (for production)');
  
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Migration interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Migration terminated');
  process.exit(0);
});

// Run the migration
runMigration();