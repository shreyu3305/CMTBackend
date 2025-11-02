# Simplified Backend Structure

This backend has been simplified to match the UI project requirements.

## 📁 Current Structure

```
CMTBackend/
├── src/
│   ├── index.ts                      # Server entry point
│   ├── config/
│   │   └── database.ts               # MongoDB connection
│   ├── models/
│   │   ├── User.ts                   # User model
│   │   ├── Pharmacy.ts               # Pharmacy model
│   │   └── Medicine.ts               # Medicine model
│   ├── controllers/
│   │   ├── auth.controller.ts        # Authentication
│   │   ├── medicines.controller.ts   # Medicine CRUD
│   │   └── pharmacies.controller.ts  # Pharmacy CRUD
│   ├── routes/
│   │   ├── index.ts                  # Main router
│   │   ├── auth.routes.ts            # Auth routes
│   │   ├── medicines.routes.ts       # Medicine routes
│   │   └── pharmacies.routes.ts      # Pharmacy routes
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT auth
│   │   └── errorHandler.middleware.ts # Error handling
│   ├── services/
│   │   └── auth.service.ts           # Auth utilities
│   └── utils/
│       ├── logger.ts                 # Winston logger
│       ├── helpers.ts                # Helper functions
│       └── constants.ts              # Constants
```

## 📊 Data Models

### User
- `_id` - MongoDB ObjectId
- `email` - User email (unique)
- `passwordHash` - Hashed password
- `fullName` - User full name
- `role` - 'user' | 'pharmacist'
- `avatarUrl` - Profile image URL
- `pharmacyId` - Reference to pharmacy (for pharmacists)

### Pharmacy
- `_id` - MongoDB ObjectId
- `name` - Pharmacy name
- `address` - Full address
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `phone` - Contact phone
- `email` - Contact email
- `isVerified` - Verification status
- `openHours` - Operating hours map

### Medicine
- `_id` - MongoDB ObjectId
- `name` - Medicine name
- `quantity` - Stock quantity
- `pharmacyId` - Reference to pharmacy

## 🛣️ API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token

### Medicines
- `GET /api/v1/medicines` - Get all medicines (optional: ?pharmacyId=xxx)
- `POST /api/v1/medicines` - Create new medicine
- `PUT /api/v1/medicines/:id` - Update medicine
- `DELETE /api/v1/medicines/:id` - Delete medicine

### Pharmacies
- `GET /api/v1/pharmacies` - Get all pharmacies
- `GET /api/v1/pharmacies/:id` - Get pharmacy by ID
- `POST /api/v1/pharmacies` - Create pharmacy (Auth: PHARMACIST/ADMIN)
- `PUT /api/v1/pharmacies/:id` - Update pharmacy (Auth: PHARMACIST/ADMIN)

### Health Check
- `GET /health` - Server health check

## 🚀 Running the Server

```bash
# Install dependencies (if not done)
npm install

# Start MongoDB
mongod

# Start the server
npm run dev
```

Server will run on: `http://localhost:8080`

## 📝 Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/medicine-tracker
JWT_ACCESS_SECRET=your_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_secret_here_min_32_chars
CORS_ORIGIN=http://localhost:5173
```

## ✨ Features

✅ Simple CRUD operations
✅ JWT Authentication
✅ Role-based access control
✅ Error handling
✅ MongoDB integration
✅ TypeScript support
✅ CORS configured
✅ Rate limiting
✅ Security headers (Helmet)

---

**Backend simplified to match UI requirements!**

