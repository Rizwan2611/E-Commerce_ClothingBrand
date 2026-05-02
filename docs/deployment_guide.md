# Void Culture: Complete Deployment Guide

This guide provides a step-by-step walkthrough to take the Void Culture boutique platform from your local machine to a live production environment.

---

## Phase 1: Database Setup (MongoDB Atlas)

Since we are moving to production, you need a cloud database that is accessible from anywhere.

1.  **Create an Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2.  **Create a Cluster**: Choose the **FREE Shared Tier**.
3.  **Network Access**: 
    - Go to "Network Access" in the sidebar.
    - Click "Add IP Address".
    - Select **"Allow Access from Anywhere"** (0.0.0.0/0). This is necessary for cloud hosting services like Render or Vercel.
4.  **Database Access**: 
    - Create a user with a username and a strong password. Note these down.
5.  **Get Connection String**:
    - Click "Connect" on your Cluster.
    - Choose "Drivers" (Node.js).
    - Copy the string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/void-culture?retryWrites=true&w=majority`

---

## Phase 2: Backend Deployment (Render.com)

Render is the recommended choice for hosting the Express.js server.

1.  **New Web Service**: Connect your GitHub repository.
2.  **Root Directory**: Set this to `server`.
3.  **Build Command**: `npm install`
4.  **Start Command**: `node index.js`
5.  **Environment Variables**: Add the following:
    - `PORT`: `5000`
    - `MONGO_URI`: (Your string from Phase 1)
    - `JWT_SECRET`: (A random long string for security)
    - `CLIENT_URL`: (Your future Vercel frontend URL - you can update this later)
    - `NODE_ENV`: `production`

---

## Phase 3: Frontend Deployment (Vercel)

Vercel is the industry standard for React/Vite applications.

1.  **New Project**: Connect your GitHub repository.
2.  **Framework Preset**: Select **Vite**.
3.  **Root Directory**: Set this to `client`.
4.  **Build Command**: `npm run build`
5.  **Output Directory**: `dist`
6.  **Environment Variables**:
    - `VITE_API_URL`: (The URL of your Render backend from Phase 2, e.g., `https://void-backend.onrender.com/api`)

---

## Phase 4: User Access Control

Once deployed, the platform maintains strict isolation between the two types of users:

### For Customers (The Public):
- **Access Link**: `https://your-site.vercel.app/`
- **Initial Flow**: Intro Animation -> Culture Gate (Login) -> Storefront.
- **Privacy**: Customers are technically blocked from entering any `/admin` path via the `AdminProtectedRoute`.

### For Shopkeepers (Administrative):
- **Access Link**: `https://your-site.vercel.app/admin`
- **Initial Flow**: Admin Login -> Dashboard.
- **Control**: The Admin side skips the customer intro for efficiency and uses a separate authentication token (`AdminAuthContext`) that never interacts with customer data.

---

## Phase 5: Post-Deployment Verification

1.  **CORS Check**: Ensure the `CLIENT_URL` in your Backend settings matches your Vercel URL exactly (no trailing slash).
2.  **Image Uploads**: Since production environments (like Render) have ephemeral file systems, local uploads to `/server/uploads` will be deleted when the server restarts. 
    - *Production Recommendation*: Set up an **AWS S3 bucket** and add your `AWS_ACCESS_KEY` to the server environment variables. The code is already prepared to handle S3 in `server/config/s3.js`.
3.  **Map Check**: Open the Admin Settings and ensure the map loads. If it doesn't, ensure your `VITE_API_URL` is correctly pointing to the production server.

---

## Summary of URLs
| User Type | URL Path | Access Level |
| :--- | :--- | :--- |
| **Customer** | `/` | Browse, Cart, Checkout |
| **Shopkeeper** | `/admin` | Analytics, Inventory, Map Settings |
| **Guest** | `/login` | Authentication Gate |
