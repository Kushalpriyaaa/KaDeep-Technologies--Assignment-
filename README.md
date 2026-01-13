
SahOne

> A modern, full-stack restaurant web application enabling users to browse menus,add items to cart, place orders,and get home delivery and restaurant admins to view and edit menu items and receive orders, all while enjoying seamless food ordering experiences. Built with React, Convex, and Firebase.

🔗 Live Demo: https://kadeep-technologies-assignment.onrender.com




---

## ✨ Features

### 👥 User Features
- ✅ User registration and authentication (Email/Password)
- 🍕 Browse restaurant menu with categories and filters
- 🛒 Add items to cart with customization options
- 📍 Manage multiple delivery addresses
- 💳 Secure checkout and payment integration
- 📦 Real-time order tracking with status updates
- 🎁 View and apply promotional offers
- 📱 Access special serving hours and restaurant status
- 👤 Profile management and order history


### 🔧 Admin Features
- 📊 Comprehensive dashboard with key metrics
- 🍽️ Complete menu management (CRUD operations)
- 📷 Image upload and management via Cloudinary
- 🎯 Create and manage promotional offers
- 📝 Order management and status updates
- ⏰ Configure special serving hours
- 📈 Generate detailed reports and analytics
- 👨‍💼 User and delivery personnel management
- ⚙️ Restaurant settings and configuration

---

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI library for building interactive interfaces
- **Vite 5.0.8** - Next-generation frontend build tool
- **React Router DOM 6.21.0** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework (via styles)
- **Recharts 3.6.0** - Data visualization library for analytics

### Backend & Database
- **Convex 1.31.2** - Real-time backend-as-a-service with TypeScript support
- **Firebase 10.7.1** - Authentication and storage
- **Firestore** - Document database for user data

### Cloud Services
- **Cloudinary** - Image and media management
- **Vercel** - Hosting and deployment platform
- **Firebase Hosting** - Alternative hosting option

### Development Tools
- **TypeScript** - Type-safe development for backend
- **ESLint** - Code linting and quality
- **Vite Dev Server** - Fast development experience


---

## 📸 Screenshots

![Screenshot 1](client/public/ssone.png)

![Screenshot 2](client/public/sstwo.png)

![Screenshot 3](client/public/ssthree.png)

![Screenshot 4](client/public/ssfour.png)

![Screenshot 5](client/public/ssfive.png)


![Screenshot 6](client/public/sssix.png)

![Screenshot 7](client/public/ssseven.png)

![Screenshot 8](client/public/sseight.png)

---

## 📁 Folder Structure

```
KaDeep-Technologies--Assignment-/
│
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   │   ├── manifest.json        # PWA manifest
│   │   └── service-worker.js    # Service worker for offline support
│   │
│   ├── src/
│   │   ├── admin/              # Admin panel components
│   │   │   ├── components/     # Reusable admin components
│   │   │   ├── pages/          # Admin page components
│   │   │   └── styles/         # Admin-specific styles
│   │   │
│   │   ├── app/                # Main application pages
│   │   │   └── pages/          # Home, Landing pages
│   │   │
│   │   ├── auth/               # Authentication components
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── delivery/           # Delivery personnel interface
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   │
│   │   ├── user/               # User-facing components
│   │   │   ├── components/     # Cart, Menu, Navbar
│   │   │   ├── pages/          # User pages
│   │   │   └── styles/         # User-specific styles
│   │   │
│   │   ├── components/         # Shared components
│   │   │   ├── ImageUpload.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── config/             # Configuration files
│   │   │   └── firebase.js     # Firebase config
│   │   │
│   │   ├── context/            # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── ConvexProvider.jsx
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── cloudinary.js
│   │   │   └── restaurantStatus.js
│   │   │
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # Application entry point
│   │   └── styles.css          # Global styles
│   │
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
│
├── convex/                     # Convex backend
│   ├── _generated/             # Auto-generated files
│   ├── lib/                    # Shared backend utilities
│   │   ├── auth.ts             # Auth helpers
│   │   └── role.ts             # Role-based access control
│   │
│   ├── modules/                # Backend API modules
│   │   ├── auth/               # Authentication APIs
│   │   ├── delivery/           # Delivery management
│   │   ├── menu/               # Menu management
│   │   ├── offers/             # Offers and promotions
│   │   ├── orders/             # Order processing
│   │   ├── reports/            # Analytics and reporting
│   │   ├── servingHours/       # Restaurant hours
│   │   ├── settings/           # App settings
│   │   └── users/              # User management
│   │
│   ├── schema.ts               # Database schema
│   ├── convex.config.js        # Convex configuration
│   └── convex.json             # Convex project settings
│
├── firebase/                   # Firebase configuration
│   ├── firebase.js
│   └── serviceAccountKey.json  # Firebase admin SDK key
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   ├── DEPLOYMENT.md           # Deployment guide
│   ├── QUICKSTART.md           # Quick start guide
│   └── WORKFLOW.md             # Development workflow
│
├── .env.example                # Environment variables template
├── .env.local                  # Local environment variables
├── package.json                # Root package configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # This file
```

---



### installation & Setup 

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download here](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Kushalpriyaaa/KaDeep-Technologies--Assignment-.git
cd KaDeep-Technologies--Assignment-
```

2. **Install root dependencies**

```bash
npm install
```

3. **Install client dependencies**

```bash
cd client
npm install
cd ..
```

4. **Install Convex CLI (if not already installed)**

```bash
npm install -g convex
```

### Environment Variables

Create environment files with the required variables:

#### 1. Client Environment Variables

Create `client/.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Convex Backend
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset



#### 2. Root Environment Variables

Create `.env.local` file in the root directory:

```env
# Convex Deployment
CONVEX_DEPLOYMENT=your_convex_deployment
CONVEX_URL=https://your-deployment.convex.cloud
```

### Running Locally

#### Option 1: Run Everything Together

```bash
npm run dev
```

This command runs both the Vite dev server (client) and Convex backend simultaneously.

#### Option 2: Run Separately

**Terminal 1: Start the client**
```bash
npm run client
```

**Terminal 2: Start Convex backend**
```bash
npm run convex
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Convex Dashboard**: Check terminal output for URL

### Initial Setup

1. **Configure Convex**

```bash
npx convex dev
```



2. **Setup Firebase**

- Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Enable Storage
- Copy your Firebase config to `client/.env`

3. **Configure Cloudinary**

- Create account at [Cloudinary](https://cloudinary.com/)
- Create an upload preset
- Copy your cloud name and preset to `client/.env`

4. **Seed Initial Data **

```bash
npx convex run convex/seedCategories.ts
```

---

## 📡 API Endpoints

### Authentication
POST /api/auth/register  
POST /api/auth/login  
POST /api/auth/logout  
GET /api/auth/user

### Menu
GET /api/menu  
GET /api/menu/:id  
POST /api/menu  
PUT /api/menu/:id  
DELETE /api/menu/:id

### Orders
POST /api/orders  
GET /api/orders  
GET /api/orders/:id  
PUT /api/orders/:id/status  
DELETE /api/orders/:id



### Offers
GET /api/offers  
GET /api/offers/:id  
POST /api/offers  
POST /api/offers/apply

### Reports
GET /api/reports/sales  
GET /api/reports/top-items  
GET /api/reports/revenue  
GET /api/reports/customers

---

## 🔐 Authentication Flow

### User Registration & Login

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Submit credentials
       ▼
┌─────────────────────┐
│  Firebase Auth      │
│  - Email/Password   │
└──────┬──────────────┘
       │
       │ 2. Auth token
       ▼
┌─────────────────────┐
│  Convex Backend     │
│  - Create user      │
│  - Set role         │
└──────┬──────────────┘
       │
       │ 3. User data
       ▼
┌─────────────────────┐
│  AuthContext        │
│  - Store user       │
│  - Update state     │
└──────┬──────────────┘
       │
       │ 4. Redirect based on role
       ▼
┌─────────────────────┐
│  Dashboard          │
│  - User/Admin/      │
│    Delivery         │
└─────────────────────┘
```

### Role-Based Access Control

The application implements three user roles:

1. **User** - Regular customers
   - Browse menu
   - Place orders
   - Track deliveries

2. **Admin** - Restaurant administrators
   - Manage menu
   - Process orders
   - View analytics


---





---



Made by [Kushal Priya](https://github.com/Kushalpriyaaa)

</div>
