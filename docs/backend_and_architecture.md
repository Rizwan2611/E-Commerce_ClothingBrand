# Void Culture: Backend Architecture & Workflow

This document explains the server-side structure, authentication gates, and the overall workflow of the MERN stack application.

## 1. Monorepo Architecture
The project is structured into two main directories:
- `/client`: React (Vite) frontend with Tailwind CSS and TanStack Query.
- `/server`: Node.js/Express backend with MongoDB/Mongoose.

## 2. Global Authentication Gates
We implemented two distinct authentication systems to separate customers from shopkeepers.

### Customer Auth (`AuthContext.jsx`):
- Uses JWT-based authentication.
- **The "Culture Gate"**: Implemented in `App.jsx`, this forces non-authenticated users to land on the `LoginPage` immediately after the 3D intro.
- **Protected Routes**: Components like `Checkout` and `Orders` are wrapped in `<ProtectedRoute>`, preventing unauthorized access.

### Shopkeeper Auth (`AdminAuthContext.jsx`):
- Completely isolated from customer auth.
- **Admin Exclusivity**: Admin routes (`/admin/*`) are protected by a separate `protectAdmin` middleware on the server.
- **Intro Skip**: The `App.jsx` detects if the user is on an admin route and automatically skips the 3D intro for a faster operational workflow.

## 3. Database Schema (`Mongoose Models`)
- **Product**: Handles titles, descriptions, pricing, and 3D-ready image galleries.
- **Order**: Tracks customer purchases, shipping status, and total values.
- **Settings**: A singleton model that stores global store data (Map coordinates, contact info, branding).
- **Customer/Shopkeeper**: User models with hashed passwords (bcrypt) and role-based data.

## 4. API Workflow Example: Adding a Product
1. **Frontend**: Admin fills out the 3D-styled product form.
2. **Request**: `POST /api/admin/products` with `multipart/form-data` (for images).
3. **Middleware**: `protectAdmin` verifies the shopkeeper's JWT.
4. **Processing**: Images are uploaded (S3 or local), and the metadata is stored in MongoDB.
5. **Update**: TanStack Query invalidates the cache, and the new product appears on the customer storefront with its 3D hover effects.

## 5. Security Best Practices
- **Helmet**: Used for setting secure HTTP headers.
- **CORS**: Configured to only allow requests from the trusted client URL.
- **Password Hashing**: Bcrypt is used for all sensitive credentials.
- **Isolated Controllers**: Logic for orders, products, and settings is separated into distinct controller files for scalability.
