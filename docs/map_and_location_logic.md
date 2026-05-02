# Void Culture: Map Logic & Location Workflow

This document details the "Dual-Engine" map logic that synchronizes the shopkeeper's settings with the customer's "Find Us" page.

## 1. Shopkeeper Side: The "Dual-Engine" Search
The Admin Settings uses a robust search system to ensure every shop address is findable.

### Geocoding Workflow:
1. **Live Entry**: As the shopkeeper types in the `textarea`, a `1500ms` debounce timer waits for a pause.
2. **Engine 1 (Precision)**: The system first calls the OpenStreetMap Nominatim API to find exact Latitude and Longitude coordinates.
3. **Engine 2 (Reliability Fallback)**: If Nominatim fails to find exact coordinates, the system automatically generates a Google Maps query using the **Raw Address Text**.
4. **Anti-Flicker**: The `mapUrl` state only updates when a valid result is returned, ensuring the map doesn't "jump" while the user is typing.

### Lock Location Mechanism:
- The **"Lock Location"** button acts as a verification step. 
- It "freezes" the coordinates and address, preventing accidental changes.
- The **"Save Settings"** button is only enabled once the location is locked, ensuring only verified data enters the database.

## 2. Customer Side: Synchronized Map Display
The `LocationPage.jsx` is designed to be the "Mirror" of the Admin Settings.

### Parity Logic:
- **Priority Rendering**: The customer map prioritizes the **Address Text** query. This is because Google Maps is highly optimized for local neighborhood labels (like "Govandi").
- **Dynamic Directions**: The "Navigate to Studio" button generates a live Google Maps directions link:
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  If coordinates are missing, it intelligently falls back to using the address string.

## 3. Data Flow
1. **Admin Input** -> `AdminSettings.jsx` -> `PUT /api/admin/settings`
2. **Database Persistence** -> `Settings` Model (MongoDB)
3. **Customer Fetch** -> `GET /api/shop-info` -> `LocationPage.jsx`
4. **Map Rendering** -> Google Maps Embed Iframe

This loop ensures that any update made by the shopkeeper is reflected globally across the boutique platform instantly.
