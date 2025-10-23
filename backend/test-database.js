const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data for loan application
const testLoanData = {
  loanId: 'gov-startup-india-1',
  loanName: 'Startup India Seed Fund Scheme',
  lender: 'Government of India',
  country: 'India',
  category: 'startup',
  lenderType: 'government',
  applicationUrl: 'https://seedfund.startupindia.gov.in/'
};

async function testDatabase() {
  console.log('🧪 Testing Database Functionality...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log();

    // Test 2: Track Loan Application
    console.log('2. Testing Loan Application Tracking...');
    const trackResponse = await axios.post(`${API_BASE_URL}/track-application`, testLoanData);
    console.log('✅ Track Application:', trackResponse.data);
    console.log();

    // Test 3: Get Application Analytics
    console.log('3. Testing Analytics Fetch...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/analytics/applications?limit=5`);
    console.log('✅ Analytics Data:', analyticsResponse.data);
    console.log();

    // Test 4: Get Application Statistics
    console.log('4. Testing Statistics Fetch...');
    const statsResponse = await axios.get(`${API_BASE_URL}/analytics/stats`);
    console.log('✅ Statistics:', JSON.stringify(statsResponse.data.data, null, 2));
    console.log();

    // Test 5: Get Popular Loans
    console.log('5. Testing Popular Loans...');
    const popularResponse = await axios.get(`${API_BASE_URL}/analytics/popular-loans`);
    console.log('✅ Popular Loans:', popularResponse.data);
    console.log();

    console.log('🎉 All tests passed! Database is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    }
    console.log('\n💡 Make sure the server is running with: npm run server');
  }
}

// Add multiple test entries to simulate real usage
async function addTestData() {
  console.log('📊 Adding test data...\n');
  
  const testLoans = [
    {
      loanId: 'gov-startup-india-1',
      loanName: 'Startup India Seed Fund Scheme',
      lender: 'Government of India',
      country: 'India',
      category: 'startup',
      lenderType: 'government',
      applicationUrl: 'https://seedfund.startupindia.gov.in/'
    },
    {
      loanId: 'bank-sbi-1',
      loanName: 'SBI SME Business Loan',
      lender: 'State Bank of India',
      country: 'India',
      category: 'sme',
      lenderType: 'bank',
      applicationUrl: 'https://sbi.co.in/business-banking/sme'
    },
    {
      loanId: 'usa-sba-1',
      loanName: 'SBA 7(a) Loan Program',
      lender: 'U.S. Small Business Administration',
      country: 'United States',
      category: 'sme',
      lenderType: 'government',
      applicationUrl: 'https://www.sba.gov/funding-programs/loans'
    },
    {
      loanId: 'uk-bounce-1',
      loanName: 'Bounce Back Loan Scheme',
      lender: 'HM Treasury (UK Government)',
      country: 'United Kingdom',
      category: 'sme',
      lenderType: 'government',
      applicationUrl: 'https://www.british-business-bank.co.uk/ourpartners/coronavirus-business-interruption-loan-schemes/bounce-back-loans/'
    }
  ];

  try {
    for (let i = 0; i < testLoans.length; i++) {
      const response = await axios.post(`${API_BASE_URL}/track-application`, testLoans[i]);
      console.log(`✅ Added test loan ${i + 1}:`, response.data.message);
    }
    
    // Add some duplicate entries to test popular loans
    console.log('\n📈 Adding duplicate entries for popularity testing...');
    for (let i = 0; i < 3; i++) {
      await axios.post(`${API_BASE_URL}/track-application`, testLoans[0]); // Add Startup India multiple times
    }
    for (let i = 0; i < 2; i++) {
      await axios.post(`${API_BASE_URL}/track-application`, testLoans[1]); // Add SBI twice
    }
    
    console.log('✅ Test data added successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add test data:', error.message);
  }
}

// Run tests
if (process.argv.includes('--add-data')) {
  addTestData();
} else {
  testDatabase();
}

module.exports = { testDatabase, addTestData };