# ⚡ Quick Start - Get Running in 5 Minutes!

## Prerequisites
- Node.js installed
- MongoDB running (local or Atlas)

## 🚀 Super Fast Setup

### 1️⃣ Backend (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### 2️⃣ Frontend (2 minutes)
```bash
# Open new terminal
cd frontend
npm install
npm run dev
```

### 3️⃣ Test (1 minute)
1. Open http://localhost:3000
2. Click "Sign up"
3. Create admin account
4. Start creating tasks!

## 🎯 That's It!

**Backend**: http://localhost:5000
**Frontend**: http://localhost:3000
**API Docs**: http://localhost:5000/api-docs

## 🔧 Quick MongoDB Setup

### Option A: Local
```bash
mongod
# Use: mongodb://localhost:27017/taskverse
```

### Option B: Atlas (Free Cloud)
1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Use in .env

## 🐛 Quick Fixes

**Port in use?**
```bash
# Change PORT in backend/.env
```

**Can't connect?**
```bash
# Check MongoDB is running
# Check .env files are created
```

## ✅ Success Checklist
- [ ] Backend shows "MongoDB Connected"
- [ ] Frontend opens at localhost:3000
- [ ] Can register a user
- [ ] Can create a task

## 📚 Next Steps
- Read README.md for full documentation
- Import Postman collection for API testing
- Check SCALABILITY.md for architecture
- Customize and deploy!

---

**Need help?** Check setup.md for detailed instructions.
