require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const Lead = require('../models/Lead');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lead-management');

    // 1. Create/find test user
    let testUser = await User.findOne({ email: "testuser@example.com" });
    if (!testUser) {
      testUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "password123", // ⚠️ This will be hashed by the User model's pre-save hook
      });
      await testUser.save();
      console.log('✅ Created test user:', testUser.email);
    } else {
      console.log('✅ Found existing test user:', testUser.email);
    }

    // 2. Clear old leads for this user
    await Lead.deleteMany({ user: testUser._id });
    console.log('✅ Cleared old leads for test user');

    // 3. Insert 100+ fake leads
    const leads = [];
    for (let i = 1; i <= 100; i++) {
      leads.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number('+1-###-###-####'),
        company: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        source: faker.helpers.arrayElement(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
        status: faker.helpers.arrayElement(['new', 'contacted', 'qualified', 'lost', 'won']),
        score: faker.number.int({ min: 0, max: 100 }),
        lead_value: faker.number.int({ min: 100, max: 10000 }),
        last_activity_at: faker.helpers.maybe(() => faker.date.recent({ days: 30 }), { probability: 0.7 }),
        is_qualified: faker.datatype.boolean(),
        user: testUser._id,
      });
    }

    await Lead.insertMany(leads);
    console.log("✅ Seed data (100+ leads) inserted successfully!");
    console.log(`📊 Created ${leads.length} leads for ${testUser.email}`);
    console.log("\n🔹 Demo Credentials:");
    console.log("Email: testuser@example.com");
    console.log("Password: password123");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
