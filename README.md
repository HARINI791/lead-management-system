# Lead Management System

A full-stack Lead Management System built with React frontend and Express backend, featuring JWT authentication, CRUD operations, advanced filtering, and server-side pagination.

## 🚀 Features

### Authentication
- **JWT-based authentication** with httpOnly cookies (secure)
- **User registration and login** with password hashing
- **Protected routes** for authenticated users only
- **Automatic token refresh** and session management

### Lead Management
- **Complete CRUD operations** for leads
- **Advanced filtering** with multiple operators
- **Server-side pagination** for performance
- **Real-time search** and sorting
- **Bulk operations** support

### Data Fields
- Personal: first_name, last_name, email, phone
- Company: company, city, state
- Lead Details: source, status, score, lead_value
- Tracking: last_activity_at, is_qualified, created_at, updated_at

### Frontend Features
- **Modern React 18** with hooks and functional components
- **AG Grid** for professional data display
- **Tailwind CSS** for beautiful, responsive design
- **Real-time notifications** with toast messages
- **Mobile-responsive** design

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **AG Grid** for data tables
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

## 📁 Project Structure

```
lead-management/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── scripts/            # Database seeding
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── App.js          # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd lead-management
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lead-management
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm start
# App opens at http://localhost:3000
```

### 5. Seed the Database (Optional)
```bash
cd backend
npm run seed
```

This creates test accounts:
- `test@example.com` / `password123` (120 leads)
- `admin@example.com` / `admin123` (20 leads)
- `user@example.com` / `user123` (20 leads)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get leads with pagination & filters
- `GET /api/leads/:id` - Get single lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Query Parameters
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `status` - Filter by status
- `source` - Filter by source
- `score` - Filter by score (gt, lt, between)
- `is_qualified` - Filter by qualification

## 🚀 Deployment

### Backend Deployment

#### Render (Recommended)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
3. Deploy automatically on push

#### Railway
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

#### Heroku
1. Create Heroku app
2. Set environment variables
3. Deploy using Git

### Frontend Deployment

#### Vercel (Recommended)
```bash
cd frontend
npm install -g vercel
vercel
```

#### Netlify
```bash
cd frontend
npm run build
# Upload build folder to Netlify
```

## 🔒 Security Features

- **JWT tokens** stored in httpOnly cookies
- **Password hashing** with bcrypt
- **Rate limiting** to prevent abuse
- **CORS protection** with configurable origins
- **Input validation** and sanitization
- **Security headers** with Helmet
- **Protected routes** requiring authentication

## 📱 Features

### Dashboard
- **Data Grid**: Professional AG Grid with sorting/filtering
- **Pagination**: Server-side pagination for large datasets
- **Filters**: Advanced filtering with multiple operators
- **Actions**: Edit, delete, and manage leads
- **Responsive**: Mobile-friendly design

### Lead Management
- **Create**: Comprehensive lead creation form
- **Edit**: Full lead editing capabilities
- **Delete**: Secure lead deletion with confirmation
- **Validation**: Client and server-side validation
- **Real-time**: Instant feedback and updates

## 🧪 Testing

### Test Accounts
After running the seed script, you can test with:
- **Email**: `test@example.com`
- **Password**: `password123`

### API Testing
Use tools like Postman or Thunder Client to test the API endpoints.

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `lead-management`
3. Update `MONGODB_URI` in your `.env` file

## 📊 Performance Features

- **Server-side pagination** for large datasets
- **Database indexing** for fast queries
- **Efficient filtering** with MongoDB aggregation
- **Optimized queries** with proper field selection
- **Caching** ready for Redis integration

## 🚀 Future Enhancements

- **Real-time updates** with WebSocket
- **File uploads** for lead attachments
- **Email integration** for lead notifications
- **Advanced analytics** and reporting
- **Multi-tenant support**
- **API rate limiting** per user
- **Audit logging** for compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Include error logs and steps to reproduce

## 🙏 Acknowledgments

- **Express.js** team for the amazing framework
- **React** team for the frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **AG Grid** for the professional data grid component

---

**Happy Coding! 🎉**
