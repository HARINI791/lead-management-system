const mongoose = require('mongoose');
const User = require('../models/User');
const Lead = require('../models/Lead');
require('dotenv').config();

const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
const companies = [
  'TechCorp', 'InnovateLabs', 'Digital Solutions', 'Future Systems', 'SmartTech',
  'Global Innovations', 'NextGen Corp', 'Elite Solutions', 'Prime Technologies', 'Apex Systems'
];
const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio',
  'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus',
  'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle', 'Denver', 'Washington'
];
const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'WA', 'CO', 'GA', 'MI', 'OR'
];

const generateRandomLead = (userId) => {
  const firstName = `John${Math.floor(Math.random() * 1000)}`;
  const lastName = `Doe${Math.floor(Math.random() * 1000)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`;
  
  return {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    company: companies[Math.floor(Math.random() * companies.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    state: states[Math.floor(Math.random() * states.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    score: Math.floor(Math.random() * 101),
    lead_value: Math.floor(Math.random() * 10000) + 100,
    last_activity_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
    is_qualified: Math.random() > 0.7,
    user: userId
  };
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    await testUser.save();
    console.log('Created test user:', testUser.email);

    // Generate and save leads
    const leads = [];
    for (let i = 0; i < 120; i++) {
      leads.push(generateRandomLead(testUser._id));
    }

    await Lead.insertMany(leads);
    console.log(`Created ${leads.length} test leads`);

    // Create additional users for testing
    const additionalUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        email: 'user@example.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User'
      }
    ];

    for (const userData of additionalUsers) {
      const user = new User(userData);
      await user.save();
      console.log('Created user:', user.email);

      // Create some leads for additional users
      const userLeads = [];
      for (let i = 0; i < 20; i++) {
        userLeads.push(generateRandomLead(user._id));
      }
      await Lead.insertMany(userLeads);
      console.log(`Created ${userLeads.length} leads for ${user.email}`);
    }

    console.log('\nDatabase seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('1. test@example.com / password123 (120 leads)');
    console.log('2. admin@example.com / admin123 (20 leads)');
    console.log('3. user@example.com / user123 (20 leads)');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
