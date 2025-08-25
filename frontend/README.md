# Lead Management System - Frontend

A modern React-based frontend for the Lead Management System with beautiful UI and advanced features.

## Features

- **Modern UI**: Built with Tailwind CSS for a clean, responsive design
- **Authentication**: Login/Register forms with JWT-based authentication
- **Lead Management**: Full CRUD operations for leads
- **Advanced Grid**: AG Grid integration with sorting, filtering, and pagination
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Toast notifications for user feedback

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **AG Grid**: Professional data grid component
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling and validation
- **Lucide React**: Beautiful icon library

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # Login form
│   ├── Register.js     # Registration form
│   ├── Dashboard.js    # Main dashboard with leads grid
│   └── LeadForm.js     # Create/Edit lead form
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── App.js             # Main app component with routing
└── index.js           # App entry point
```

## Components

### Login
- Email and password authentication
- Form validation
- Error handling
- Responsive design

### Register
- User registration form
- Password confirmation
- Form validation
- Success/error feedback

### Dashboard
- AG Grid for leads display
- Server-side pagination
- Advanced filtering options
- Lead management actions

### LeadForm
- Create new leads
- Edit existing leads
- Comprehensive form fields
- Validation and error handling

## Deployment

### Vercel (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend API URL

### Netlify
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to Netlify

### GitHub Pages
1. Add homepage to package.json:
   ```json
   "homepage": "https://username.github.io/repo-name"
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:5000
```

## API Integration

The frontend communicates with the backend API through:
- Authentication endpoints (`/api/auth/*`)
- Lead management endpoints (`/api/leads/*`)
- JWT tokens stored in httpOnly cookies

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for theming

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
