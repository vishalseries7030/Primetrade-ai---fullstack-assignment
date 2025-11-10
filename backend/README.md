# 🔧 TaskVerse Backend API

## Overview
Scalable RESTful API built with Node.js, Express, and MongoDB featuring JWT authentication, role-based access control, and comprehensive task management.

## 🚀 Tech Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt (12 salt rounds)
- **Validation**: Express-validator
- **Documentation**: Swagger UI
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── swagger.js           # Swagger configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   └── analyticsController.js # Analytics & statistics
│   ├── middlewares/
│   │   ├── auth.js              # JWT verification & RBAC
│   │   ├── validator.js         # Input validation rules
│   │   └── errorHandler.js      # Centralized error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints
│   │   └── analyticsRoutes.js   # Analytics endpoints
│   ├── utils/
│   │   ├── ApiError.js          # Custom error class
│   │   ├── ApiResponse.js       # Standard response format
│   │   └── jwt.js               # JWT utilities
│   └── app.js                   # Express app setup
├── server.js                    # Entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── .gitignore                   # Git ignore rules
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskverse
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
```

## 📦 Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // or "admin"
}

Response: 201 Created
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

### Task Endpoints

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README files",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31"
}

Response: 201 Created
```

#### Get All Tasks
```http
GET /api/v1/tasks?status=pending&priority=high&page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "statusCode": 200,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [...],
    "totalPages": 2,
    "currentPage": 1,
    "total": 15
  }
}
```

#### Get Single Task
```http
GET /api/v1/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}

Response: 200 OK
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
```

### Analytics Endpoint (Admin Only)

#### Get Analytics
```http
GET /api/v1/analytics
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "success": true,
  "statusCode": 200,
  "message": "Analytics retrieved successfully",
  "data": {
    "tasksByStatus": [...],
    "tasksByPriority": [...],
    "overdueTasks": 5,
    "totalUsers": 20,
    "activeUsers": 15,
    "totalTasks": 45,
    "recentTasks": 12
  }
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required, min: 2)
  email: String (required, unique, validated)
  password: String (required, hashed, min: 6)
  role: String (enum: ['user', 'admin'], default: 'user')
  isActive: Boolean (default: true)
  createdAt: Date
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required, max: 100)
  description: String (required, max: 500)
  status: String (enum: ['pending', 'in-progress', 'completed', 'overdue'])
  priority: String (enum: ['low', 'medium', 'high', 'urgent'])
  dueDate: Date (required)
  assignedTo: ObjectId (ref: 'User', required)
  createdBy: ObjectId (ref: 'User', required)
  createdAt: Date
  updatedAt: Date
}

Indexes:
- assignedTo + status (compound)
- createdBy
```

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Bcrypt password hashing (12 salt rounds)
- Token expiration (7 days)
- Secure token verification

### Authorization
- Role-based access control (RBAC)
- User and Admin roles
- Resource ownership verification
- Admin-only endpoints

### API Security
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express-validator on all inputs
- **MongoDB Injection Protection**: Mongoose sanitization

### Error Handling
- Centralized error handler
- Custom error classes
- Consistent error responses
- Stack traces in development only

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "stack": "..." // Only in development
}
```

## 📚 API Documentation

### Swagger UI
Access interactive API documentation at:
```
http://localhost:5000/api-docs
```

Features:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

### Postman Collection
Import `TaskVerse.postman_collection.json` from the root directory for complete API testing.

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "role": "user"
  }'
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas connection
4. Set appropriate CORS origins

### Recommended Platforms
- **Railway**: Easy deployment with MongoDB support
- **Render**: Free tier with auto-deploy
- **Heroku**: Classic option (paid)

## 📈 Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Lean queries (only required fields)
- Connection pooling
- Efficient aggregation pipelines

## 🔧 Development

### Available Scripts
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Code Structure
- **Controllers**: Business logic
- **Services**: Reusable business logic (can be added)
- **Middlewares**: Request processing
- **Models**: Data schemas
- **Routes**: API endpoints
- **Utils**: Helper functions

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Verify network access in MongoDB Atlas
- Ensure database user has correct permissions

### JWT Token Error
- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure correct Authorization header format

### Port Already in Use
- Change `PORT` in `.env`
- Kill process using port 5000

## 📝 API Versioning

Current version: `v1`

All endpoints are prefixed with `/api/v1/`

Future versions can be added without breaking existing clients.

## 🎯 Features

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ CRUD operations for tasks
- ✅ Task filtering and pagination
- ✅ Analytics dashboard (admin)
- ✅ Input validation
- ✅ Error handling
- ✅ API documentation (Swagger)
- ✅ Security headers (Helmet)
- ✅ Rate limiting
- ✅ CORS support
- ✅ Request logging (Morgan)

## 📄 License

MIT License - See LICENSE file in root directory

## 👨‍💻 Author

Built as part of Backend Developer Internship Assignment

---

**Backend API is production-ready and fully documented!** 🚀
