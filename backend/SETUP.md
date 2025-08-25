# Lead Management System Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# MongoDB Connection
MONGO_URI=mongodb://127.0.0.1:27017/lead-management

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Running the Seeder

The seeder will create a test user with 100+ realistic leads using Faker.js.

### Prerequisites
- MongoDB running locally or accessible via MONGO_URI
- Node.js and npm installed
- Dependencies installed (`npm install`)

### Run Seeder
```bash
# From the backend directory
npm run seed

# Or directly
node scripts/seed.js
```

### What the Seeder Does
1. ✅ Creates/finds test user: `testuser@example.com`
2. ✅ Clears existing leads for the test user
3. ✅ Generates 100+ realistic leads with:
   - Real names, emails, phone numbers
   - Company names and locations
   - Various lead sources and statuses
   - Lead scores and values
   - Activity timestamps

### Demo Credentials
After running the seeder, you can login with:
- **Email:** testuser@example.com
- **Password:** password123

### Expected Output
```
✅ Created test user: testuser@example.com
✅ Cleared old leads for test user
✅ Seed data (100+ leads) inserted successfully!
📊 Created 100 leads for testuser@example.com

🔹 Demo Credentials:
Email: testuser@example.com
Password: password123
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check your MONGO_URI in .env file
- Try connecting manually: `mongosh "your-connection-string"`

### Permission Issues
- Make sure you have write access to the database
- Check if the database exists

### Faker Issues
- Ensure @faker-js/faker is installed: `npm install @faker-js/faker`
- Check Node.js version compatibility
