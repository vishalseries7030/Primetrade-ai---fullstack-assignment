# 🚀 Deployment Guide - TaskVerse

## Overview
This guide covers deploying TaskVerse to production environments. We'll cover both backend and frontend deployment options.

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier available)
- Deployment platform accounts (free tiers available)

## 📊 Deployment Architecture

```
User Browser
    ↓
Frontend (Vercel/Netlify)
    ↓
Backend API (Railway/Render)
    ↓
MongoDB Atlas (Cloud Database)
```

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project (e.g., "TaskVerse")

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select cloud provider and region (closest to your users)
4. Name your cluster (e.g., "taskverse-cluster")
5. Click "Create"

### Step 3: Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Set role to "Read and write to any database"
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict to your server IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `taskverse`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/taskverse?retryWrites=true&w=majority
```

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

#### Why Railway?
- Free tier with 500 hours/month
- Easy GitHub integration
- Automatic deployments
- Built-in environment variables
- Good MongoDB support

#### Steps:
1. **Sign Up**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repos
   - Select your TaskVerse repository

3. **Configure Service**
   - Railway will detect Node.js automatically
   - Set root directory to `backend`
   - Or add `railway.json` in backend folder:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

4. **Set Environment Variables**
   - Go to your service settings
   - Click "Variables"
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_generated_secret_key
   JWT_EXPIRE=7d
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your deployment URL (e.g., `https://taskverse-backend.up.railway.app`)

6. **Verify Deployment**
   - Visit `https://your-url.railway.app/health`
   - Should return: `{"status":"OK","message":"Server is running"}`
   - Visit `https://your-url.railway.app/api-docs` for Swagger

### Option 2: Render

#### Steps:
1. **Sign Up**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - Name: taskverse-backend
   - Root Directory: backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**
   - Add the same variables as Railway

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

#### Steps:
1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create taskverse-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   heroku config:set JWT_EXPIRE=7d
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🎨 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Why Vercel?
- Free tier with unlimited bandwidth
- Automatic deployments on push
- Built-in CI/CD
- Excellent performance
- Easy environment variables

#### Steps:
1. **Sign Up**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will detect Vite automatically

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   - Add variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your URL (e.g., `https://taskverse.vercel.app`)

6. **Custom Domain (Optional)**
   - Go to project settings
   - Click "Domains"
   - Add your custom domain

### Option 2: Netlify

#### Steps:
1. **Sign Up**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site"
   - Import from Git
   - Select your repository

3. **Configure Build**
   - Base directory: frontend
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Set Environment Variables**
   - Go to Site settings
   - Build & deploy → Environment
   - Add:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api/v1
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment

### Option 3: Manual Deployment

#### Build Locally:
```bash
cd frontend
npm run build
```

#### Deploy to Any Static Host:
- Upload `dist` folder to:
  - AWS S3 + CloudFront
  - GitHub Pages
  - Firebase Hosting
  - Surge.sh
  - Any static hosting service

## 🔒 Post-Deployment Security

### 1. Update CORS Settings
In `backend/src/app.js`, update CORS:
```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### 2. Update Rate Limiting
For production, consider stricter limits:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50 // Reduce from 100 to 50
});
```

### 3. Enable HTTPS
- Both Railway and Vercel provide HTTPS automatically
- Ensure all API calls use HTTPS

### 4. Secure Environment Variables
- Never commit .env files
- Use platform-specific secret management
- Rotate JWT secrets regularly

### 5. MongoDB Security
- Restrict IP addresses in Network Access
- Use strong passwords
- Enable MongoDB encryption at rest

## 🧪 Testing Deployment

### Backend Tests:
```bash
# Health check
curl https://your-backend-url.railway.app/health

# API documentation
curl https://your-backend-url.railway.app/api-docs

# Register user
curl -X POST https://your-backend-url.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"user"}'
```

### Frontend Tests:
1. Open your frontend URL
2. Try to register a user
3. Login with credentials
4. Create a task
5. View analytics (if admin)

## 📊 Monitoring & Logs

### Railway:
- Go to your service
- Click "Logs" tab
- View real-time logs

### Vercel:
- Go to your project
- Click "Deployments"
- Click on a deployment
- View "Functions" logs

### MongoDB Atlas:
- Go to "Metrics" tab
- Monitor database performance
- Set up alerts

## 🔄 Continuous Deployment

### Automatic Deployments:
Both Railway and Vercel support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build & Deploy**
   - Railway rebuilds backend
   - Vercel rebuilds frontend
   - Both deploy automatically

### Branch Deployments:
- Create feature branches
- Get preview deployments
- Test before merging to main

## 🐛 Troubleshooting

### Backend Issues:

**Error: Cannot connect to MongoDB**
- Check MongoDB Atlas connection string
- Verify IP whitelist includes 0.0.0.0/0
- Check database user credentials

**Error: JWT errors**
- Verify JWT_SECRET is set
- Check token expiration settings

**Error: CORS errors**
- Update CORS origin to include frontend URL
- Check credentials setting

### Frontend Issues:

**Error: Cannot connect to backend**
- Verify VITE_API_URL is correct
- Check backend is running
- Verify CORS settings

**Error: Build fails**
- Check all dependencies are in package.json
- Verify build command is correct
- Check for TypeScript errors

## 💰 Cost Estimation

### Free Tier Limits:
- **MongoDB Atlas**: 512 MB storage (sufficient for thousands of tasks)
- **Railway**: 500 hours/month (enough for 24/7 operation)
- **Vercel**: Unlimited bandwidth, 100 GB-hours

### When to Upgrade:
- MongoDB: When you exceed 512 MB
- Railway: When you need more compute power
- Vercel: When you need team features

## 🎯 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Network access configured
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Frontend environment variables set
- [ ] Frontend can connect to backend
- [ ] CORS configured correctly
- [ ] HTTPS enabled on both
- [ ] Test user registration
- [ ] Test user login
- [ ] Test task creation
- [ ] Test admin analytics
- [ ] Monitoring set up
- [ ] Custom domain configured (optional)

## 📧 Deployment URLs for Submission

After deployment, include these in your submission email:

```
Live Demo:
Frontend: https://taskverse.vercel.app
Backend API: https://taskverse-backend.up.railway.app
API Documentation: https://taskverse-backend.up.railway.app/api-docs

Test Credentials:
Admin: admin@taskverse.com / admin123
User: user@taskverse.com / user123
```

## 🚀 Quick Deploy Commands

### Backend (Railway):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Frontend (Vercel):
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)

---

**Congratulations!** Your TaskVerse application is now live and accessible to the world! 🎉
