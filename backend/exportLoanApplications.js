const mongoose = require('mongoose');
const LoanApplication = require('./models/LoanApplication');
const fs = require('fs');
const path = require('path');

async function exportLoanApplications() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loan_manage';
    console.log('🔗 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully');

    // Fetch all loan applications
    console.log('📋 Fetching loan applications...');
    const apps = await LoanApplication.find().lean();
    console.log(`📊 Found ${apps.length} loan applications`);

    if (apps.length === 0) {
      console.log('❌ No loan applications found to export');
      return;
    }

    // Clean up the data for JSON export (remove MongoDB-specific fields if desired)
    const cleanedApps = apps.map(app => ({
      id: app._id.toString(),
      loanType: app.loanType || null,
      loanAmount: app.loanAmount || null,
      status: app.status,
      userSessionId: app.userSessionId || null,
      userInfo: app.userInfo || null,
      organizationInfo: app.organizationInfo || null,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      __v: app.__v
    }));

    // Create output filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `loan_applications_${timestamp}.json`;
    const filepath = path.join(__dirname, 'exports', filename);

    // Create exports directory if it doesn't exist
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
      console.log('📁 Created exports directory');
    }

    // Write JSON file
    const jsonData = {
      exportInfo: {
        timestamp: new Date().toISOString(),
        totalRecords: cleanedApps.length,
        database: 'loan_manage',
        collection: 'loan_applications'
      },
      data: cleanedApps
    };

    fs.writeFileSync(filepath, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Loan applications exported successfully!`);
    console.log(`📄 File saved: ${filepath}`);
    console.log(`📊 Total records: ${cleanedApps.length}`);

    // Also output to console
    console.log('\n📋 JSON Data:');
    console.log('='.repeat(50));
    console.log(JSON.stringify(jsonData, null, 2));
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the export
exportLoanApplications();