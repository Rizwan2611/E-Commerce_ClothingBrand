# Void Culture: System Architecture & Backend Workflow

This document provides a comprehensive technical breakdown of the server-side logic, database structure, and the authentication security gates that power the Void Culture platform.

---

## 1. System Overview
The platform is built on the **MERN** stack (MongoDB, Express, React, Node.js) using a monorepo structure. 

### Key Tech Stack:
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt (Password Hashing)
- **Image Storage**: Local Storage (Uploads folder) + Multer

---

## 2. Advanced Authentication Architecture
We use an isolated, dual-provider authentication system to ensure complete separation between public customers and administrative staff.

### The "Culture Gate" (Customer Auth)
- **Concept**: A "Member's Only" wall that forces registration/login before accessing the boutique.
- **Logic**: Implemented in `App.jsx`.
```javascript
const showAuthGate = !customer && !isAdminRoute && !isAuthPage;
if (showAuthGate) return <LoginPage />;
```
- **Session Persistence**: JWTs are stored in `localStorage` and managed via a centralized `AuthContext.jsx`.

### The Admin Portal (Shopkeeper Auth)
- **Isolated State**: Managed via `AdminAuthContext.jsx`. This prevents a customer session from ever conflicting with an admin session.
- **Backend Protection**: Every admin route is protected by the `protectAdmin` middleware.
```javascript
// server/middleware/adminAuth.js
const protectAdmin = async (req, res, next) => {
  // 1. Extract Token from Headers
  // 2. Verify JWT Secret
  // 3. Fetch Admin User from DB
  // 4. Attach to req.admin and call next()
}
```

---

## 3. Database Schema Design (Mongoose)
The data layer is optimized for high-performance retrieval of products and settings.

### The `Settings` Singleton:
Unlike traditional models, the `Settings` model is a singleton (only one document exists).
```javascript
{
  shopName: String,
  address: String,
  lat: Number,
  lng: Number,
  instagram: String,
  // ... contact info
}
```
*Logic*: In the `settingsController`, we use a helper `getSettingsDocument` that automatically creates the document if it doesn't exist, ensuring the site never crashes due to missing configuration.

### The `Product` Model:
Designed for 3D galleries, it supports an array of images with nested metadata (URL, public_id).

---

## 4. API Request/Response Lifecycle
Example: **Fetching Analytics for the Admin Dashboard**

1. **Client**: `AdminDashboard.jsx` uses TanStack Query to call `GET /api/admin/analytics`.
2. **Security**: The `protectAdmin` middleware intercepts the request, verifies the shopkeeper's identity, and denies access if the token is invalid.
3. **Controller**: `orderController.getAnalytics()` runs multiple MongoDB aggregations:
   - `sum` total revenue.
   - `count` total orders.
   - `count` total products.
4. **Aggregation**: It builds a 30-day sales history array for the BarChart.
5. **Response**: A structured JSON object is returned.
6. **Frontend**: The 3D dashboard renders the numbers with cinematic animations.

---

## 5. Deployment & Scalability
- **Monorepo**: Both frontend and backend can be deployed from a single Git root.
- **Environment Variables**: Managed via `.env`.
  - `MONGO_URI`: For database connectivity.
  - `JWT_SECRET`: For secure token signing.
  - `CLIENT_URL`: For CORS protection.
- **File Uploads**: Currently handled locally in the `uploads/` folder. For large-scale production, this can be swapped to AWS S3 by updating the `config/s3.js` file.

---

## 6. Development Workflow
- **Frontend**: `npm run dev` (Port 5173)
- **Backend**: `npm run dev` (Port 5000)
- **Tooling**: 
  - `Tailwind CSS`: For the 3D design system.
  - `Lucide React`: For consistent iconography.
  - `Axios`: For interceptor-based API calls (automatically attaching JWTs).
