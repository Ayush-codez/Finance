const mongoose = require('mongoose');
const LoanApplication = require('./models/LoanApplication');
const UserAnalytics = require('./models/UserAnalytics');

async function checkApplications() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_manage';
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully');

    // Check loan applications
    console.log('\n📋 === LOAN APPLICATIONS ===');
    const apps = await LoanApplication.find().lean();
    console.log(`📊 Total loan applications: ${apps.length}`);
    
    if (apps.length > 0) {
      console.log('\n📄 Recent applications:');
      apps.slice(-5).forEach((app, index) => {
        console.log(`\n${index + 1}. Application ID: ${app._id}`);
        console.log(`   Loan Type: ${app.loanType}`);
        console.log(`   Amount: $${app.loanAmount?.toLocaleString() || 'Not specified'}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   User Session: ${app.userSessionId || 'Not tracked'}`);
        console.log(`   Created: ${app.createdAt}`);
        console.log(`   Updated: ${app.updatedAt}`);
        if (app.userInfo) {
          console.log(`   User Info: ${JSON.stringify(app.userInfo, null, 2)}`);
        }
      });
    }

    // Check user analytics
    console.log('\n📊 === USER ANALYTICS ===');
    const analytics = await UserAnalytics.find().lean();
    console.log(`📈 Total analytics records: ${analytics.length}`);
    
    if (analytics.length > 0) {
      console.log('\n📄 Recent analytics:');
      analytics.slice(-3).forEach((analytic, index) => {
        console.log(`\n${index + 1}. Analytics ID: ${analytic._id}`);
        console.log(`   Event Type: ${analytic.eventType}`);
        console.log(`   Session ID: ${analytic.sessionId}`);
        console.log(`   Page: ${analytic.page}`);
        console.log(`   User Agent: ${analytic.userAgent}`);
        console.log(`   Created: ${analytic.createdAt}`);
        if (analytic.metadata) {
          console.log(`   Metadata: ${JSON.stringify(analytic.metadata, null, 2)}`);
        }
      });
    }

    // Database statistics
    console.log('\n📈 === DATABASE STATISTICS ===');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   - ${collection.name}: ${count} documents`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the check
checkApplications();