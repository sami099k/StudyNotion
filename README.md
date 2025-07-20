# StudyNotion - Complete Learning Management System

A full-stack learning management system built with React, Node.js, and MongoDB. StudyNotion provides a comprehensive platform for instructors to create and manage courses, and for students to enroll and learn.

## 🚀 Features

### For Students
- **User Authentication & Authorization**
  - Sign up/Sign in with email verification
  - Password reset functionality
  - JWT-based authentication

- **Course Discovery & Enrollment**
  - Browse courses by categories
  - Search and filter courses
  - Course details with ratings and reviews
  - Shopping cart functionality
  - Secure payment integration with Razorpay

- **Learning Experience**
  - Video player with progress tracking
  - Course progress dashboard
  - Mark lectures as complete
  - Course completion certificates

- **User Profile Management**
  - Update profile information
  - Change password
  - View enrolled courses
  - Purchase history

### For Instructors
- **Course Management**
  - Create and edit courses
  - Upload course content (videos, documents)
  - Manage course sections and subsections
  - Course status management (draft/publish)

- **Analytics Dashboard**
  - Student enrollment statistics
  - Revenue tracking
  - Course performance metrics
  - Recent enrollments

- **Content Management**
  - Thumbnail upload with Cloudinary
  - Video upload and management
  - Course categorization

### Technical Features
- **Responsive Design**
  - Mobile-first approach
  - Modern UI with Tailwind CSS
  - Dark theme optimized

- **Real-time Features**
  - Live notifications
  - Progress tracking
  - Payment status updates

- **Security**
  - JWT authentication
  - Password encryption
  - Input validation
  - CORS protection

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - File upload
- **Razorpay** - Payment gateway

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studyNotion
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Update .env with your configuration
   # See env.example for required variables
   ```

4. **Database Setup**
   - Create a MongoDB database
   - Update MONGODB_URL in .env

5. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately
   npm run client  # Frontend
   npm run server  # Backend
   ```

## 🔧 Configuration

### Required Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
FOLDER=studyNotion

# Razorpay
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Server
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_RAZORPAY_KEY=your_razorpay_key
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

## 📁 Project Structure

```
studyNotion/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── slices/            # Redux slices
│   ├── assets/            # Static assets
│   └── ...
├── server/                # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routers/          # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utils/            # Utility functions
│   └── ...
├── data/                 # Static data files
├── public/               # Public assets
└── ...
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend Deployment (Railway/Render)
1. Set environment variables
2. Deploy the `server` folder
3. Update frontend API URL

## 🔒 Security Features

- JWT token-based authentication
- Password encryption with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure file uploads

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset

### Courses
- `GET /api/v1/course/showAllCategories` - Get categories
- `POST /api/v1/course/createCourse` - Create course
- `GET /api/v1/course/getCourseDetails` - Get course details
- `POST /api/v1/course/createRating` - Create review

### Payments
- `POST /api/v1/payment/capturePayment` - Initiate payment
- `POST /api/v1/payment/verifySignature` - Verify payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@studynotion.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database
- Razorpay for payment integration
- Cloudinary for file management
