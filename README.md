# Burghar

BitByte is a modern, mobile-first web application designed for restaurant menu digitization and real-time order management. It allows customers to browse menus and place orders instantly by scanning QR codes, while providing restaurant owners with an intuitive dashboard to manage tables, menu items, incoming orders, and live analytics.

---

## Key Features

- **Customer QR Code Ordering:** Mobile-first customer experience to browse menus, filter by categories/dietary preferences, and submit orders directly to the kitchen.
- **Real-Time Order Tracking:** Automatic, real-time status updates (Pending, Preparing, Completed, Cancelled) for both customers and kitchen staff via Socket.io.
- **Restaurant Owner Dashboard:** Comprehensive control panel to manage restaurant details, branding, menus, digital tables, active orders, and sales performance.
- **Dynamic Analytics Panel:** Displays metrics on total revenue, order count, average order value, top menu items, and active tables.
- **Digital Table Management:** Generates unique QR codes for each dining table to track customer locations automatically.
- **Cloudinary Image Storage:** High-performance, direct uploads for food items and brand logos.
- **Secure Authentication:** Integrated NextAuth.js v5 with custom role permissions protecting administrative endpoints.

---

## System Architecture Overview

The project is structured as a TypeScript monorepo with an Express backend and Next.js frontend:
1. **Frontend (`/client`):** Next.js 16 (App Router) client server responsible for UI layout, customer ordering interface, dashboard components, and server actions.
2. **Backend (`/server`):** Express framework serving REST APIs, managing database instances, and streaming real-time notifications via WebSockets.

For a detailed dive into execution modes (Split vs. Unified processes) and the visual architecture flow, refer to the [DEVELOPMENT.md](file:///Users/priyanshubehere/Desktop/gamma/DEVELOPMENT.md) guide.

---

## Quick Start Setup

For complete system prerequisites, troubleshooting tips, and troubleshooting port conflicts, please read the [DEVELOPMENT.md](file:///Users/priyanshubehere/Desktop/gamma/DEVELOPMENT.md) documentation. Below is a quick setup summary:

### 1. Installation
Clone the repository and install the NPM packages in the root directory:
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root folder containing your database, auth, and image storage credentials:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_crypt_key
AUTH_SECRET=your_auth_secret_key
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_browser_maps_key
SIGNUP_SECRET_KEY=gamma-secret-2026
```

The Maps key enables Google address suggestions on signup and restaurant settings. Enable Maps JavaScript API and Places API (New) for that key, and restrict it to your website origins. The address field also accepts manual entry when the key is not configured.

### 3. Run Development Server
Boot both the Express API backend and Next.js frontend concurrently:
```bash
npm run dev
```

- **Frontend Server:** [http://localhost:3000](http://localhost:3000)
- **Backend API Server:** [http://localhost:3001](http://localhost:3001)

### 4. Build and Compile for Production
```bash
# Compile Next.js assets
npm run build:client

# Compile TypeScript backend files
npm run build:server

# Start the production services concurrently
npm run start
```

---

## Project Directory Structure

```
├── client/                 # Next.js Frontend Application
│   ├── app/                # Next.js App Router (Layouts, Actions, APIs)
│   ├── components/         # React UI Components (Dashboard, Customer pages)
│   ├── hooks/              # Custom frontend react hooks
│   └── public/             # Static images and icons
│
├── server/                 # Express Backend API Server
│   ├── controllers/        # Business logic controllers (Orders, Restaurant, Tables)
│   ├── lib/                # Database connections, socket configurations
│   ├── models/             # Shared Mongoose Models (Orders, MenuItems, Tables)
│   └── routes/             # Express API Endpoints
│
└── package.json            # Unified scripts & monorepo dependencies
```

---

## License

This project is licensed under the MIT License.
