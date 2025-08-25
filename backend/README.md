# Lead Management System - Backend

## Features

- **Authentication**: JWT-based authentication with httpOnly cookies
- **User Management**: Register, login, logout, and current user endpoints
- **Lead Management**: Full CRUD operations for leads
- **Advanced Filtering**: Server-side filtering with multiple operators
- **Pagination**: Server-side pagination for large datasets
- **Security**: Rate limiting, helmet, CORS, and input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get leads with pagination and filters
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `env.example`:
   ```bash
   cp env.example .env
   ```

3. Update `.env` with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `FRONTEND_URL` to your frontend URL

4. Run the application:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

5. Seed the database (optional):
   ```bash
   npm run seed
   ```

## Deployment

### Render
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push

### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy using Git

## Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS

## Test Accounts

After running the seed script:
- `test@example.com` / `password123` (120 leads)
- `admin@example.com` / `admin123` (20 leads)
- `user@example.com` / `user123` (20 leads)
