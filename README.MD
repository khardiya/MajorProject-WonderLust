# WanderLust - Airbnb Clone

A full-stack web application built with the MERN stack that allows users to list, browse, and review rental properties.

## 🚀 Features

- **User Authentication**: Secure signup/login with Passport.js
- **Property Listings**: Create, read, update, and delete property listings
- **Image Upload**: Cloudinary integration for image storage
- **Reviews & Ratings**: Star-based rating system for properties
- **Interactive Maps**: Radar.io integration for location visualization
- **Search Functionality**: Search properties by title, location, or country
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Joi** - Data validation
- **Multer** - File upload handling
- **Cloudinary** - Image storage service

### Frontend
- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Radar.io** - Maps and geocoding

## 📁 Project Structure

```
MajorProject/
├── controllers/          # Route handlers
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── models/               # Database schemas
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/               # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/                # EJS templates
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── includes/
├── public/               # Static assets
│   ├── css/
│   └── js/
├── utils/                # Utility functions
├── init/                 # Database initialization
├── middleware.js         # Custom middleware
├── schema.js            # Joi validation schemas
├── cloudconfig.js       # Cloudinary configuration
└── app.js               # Main application file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v23.3.0 or higher)
- MongoDB
- Cloudinary account
- Radar.io account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MajorProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   ATLASDB_URL=your_mongodb_connection_string
   SECRET=your_session_secret
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   MAP_TOKEN=your_radar_api_token
   ```

4. **Initialize Database** (Optional)
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   node app.js
   ```

The application will be available at `http://localhost:8080`

## 🔧 Configuration

### Database
- MongoDB connection configured in `app.js`
- Session storage using MongoDB with `connect-mongo`
- Geospatial indexing enabled for location-based queries

### Authentication
- Local strategy with `passport-local-mongoose`
- Session-based authentication
- Password hashing handled automatically

### File Upload
- Cloudinary integration for image storage
- Multer middleware for handling multipart/form-data
- Automatic image optimization and transformation

## 📝 API Endpoints

### Listings
- `GET /listings` - View all listings
- `GET /listings/new` - New listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing
- `GET /listings/search` - Search listings

### Reviews
- `POST /listings/:id/reviews` - Add review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Signup form
- `POST /signup` - Create account
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## 🔒 Security Features

- Input validation with Joi schemas
- Authentication middleware
- Authorization checks for CRUD operations
- Session security with httpOnly cookies
- CSRF protection considerations
- Environment variable protection

## ⚠️ Known Issues & Security Considerations

Based on code analysis, the following issues should be addressed:

### Critical Issues
1. **Hardcoded API Key**: Radar API key is hardcoded in `controllers/listings.js`
2. **Package Vulnerabilities**: Dependencies have security vulnerabilities
3. **Error Handling**: Missing error handling in several async functions

### High Priority Issues
1. **CSRF Protection**: Missing CSRF tokens for state-changing requests
2. **Input Validation**: NoSQL injection vulnerability in search functionality
3. **SSRF Vulnerabilities**: Unvalidated URLs in external API calls
4. **Cookie Security**: Missing secure cookie attributes

### Recommended Fixes
1. Move all API keys to environment variables
2. Update vulnerable dependencies
3. Implement CSRF protection
4. Add input sanitization for search queries
5. Validate external URLs before making requests
6. Add comprehensive error handling

## 🚀 Deployment

### Production Considerations
1. Set `NODE_ENV=production`
2. Use secure session secrets
3. Enable HTTPS
4. Configure proper CORS settings
5. Set up monitoring and logging
6. Use a process manager like PM2

### Environment Variables for Production
```env
NODE_ENV=production
ATLASDB_URL=mongodb+srv://...
SECRET=strong_random_secret
CLOUD_NAME=production_cloud_name
CLOUD_API_KEY=production_api_key
CLOUD_API_SECRET=production_api_secret
MAP_TOKEN=production_radar_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Bablu** - Full Stack Developer

## 🙏 Acknowledgments

- Bootstrap for responsive design
- Cloudinary for image management
- Radar.io for mapping services
- MongoDB Atlas for database hosting
- Express.js community for excellent documentation