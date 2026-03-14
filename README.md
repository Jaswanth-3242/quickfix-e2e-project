# Quick Fix - Home Maintenance Service Platform

A comprehensive web-based home maintenance service platform that connects customers with verified service providers in a transparent, reliable, and efficient manner.

## 🎯 Project Overview

**Course**: B.Tech 3-2 Semester E2E Mini Project  
**Technology Stack**: React.js + Node.js + Express.js + SQLite  
**Database**: SQLite for simplified deployment  
**Team Members**: M.Jaswanth,M.Venkatesh,K.Gowtham,M.Dharani
**Deployment link:https://quickfix-frontend-y42h.onrender.com

## 📦 Git Repository

This repository contains all module-wise code, documentation, and regular updates as required for E2E project reviews.  

## 🚀 Key Features

### Module 1: Customer Service Request & Booking
- User registration and authentication
- Service browsing and selection
- Real-time booking system
- Customer dashboard with booking history

### Module 2: Dynamic Pricing & Service Management
- Location-based pricing
- Urgency-based multipliers (Normal, Urgent, Emergency)
- Time slot premiums (Evening, Weekend)
- Real-time price calculation
- Transparent pricing breakdown

### Module 3: Real-Time Tracking & Notification
- Live GPS tracking simulation
- Socket.io for real-time updates
- Push notifications for status changes
- ETA calculations
- Service progress timeline

### Module 4: Admin Dashboard & Analytics
- Comprehensive analytics with charts
- User management system
- Booking management
- Revenue tracking
- System health monitoring

## 🛠 Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite
- **Real-time**: Socket.io
- **Authentication**: JWT
- **Styling**: CSS3 with Serene Cool Tones design system

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm package manager
- Git for version control

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd quickfix-project
```

### 2. Backend Setup
```bash
cd backend
npm install
node setup-sqlite.js  # Initialize SQLite database
node server.js        # Start backend server
```

### 3. Frontend Setup (Open new terminal)
```bash
cd frontend
npm install
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: SQLite file (backend/quickfix.db)

## 👥 User Roles & Access

### Customer
- Browse and book services
- Track service progress
- View booking history
- Real-time notifications

### Service Provider
- View available bookings
- Accept/manage bookings
- Update service status
- Track earnings

### Admin
- Analytics dashboard
- User management
- Booking oversight
- System monitoring

## 🔐 Demo Login Credentials

### Customer Account
- Email: customer@test.com
- Password: password

### Service Provider Account
- Email: provider@test.com
- Password: password

### Admin Account
- Email: admin@test.com
- Password: password

## 📊 Dynamic Pricing Algorithm

```javascript
Base Price × Urgency Multiplier × Time Slot Multiplier × Location Multiplier

Urgency Multipliers:
- Normal: 1x
- Urgent: 1.5x
- Emergency: 2x

Time Slot Multipliers:
- Morning/Afternoon: 1x
- Evening/Weekend: 1.2x

Location Multipliers:
- Regular areas: 1x
- Premium areas: 1.3x
```

## 🏗 Project Structure

```
quickfix-project/
├── backend/
│   ├── server.js          # Main server file
│   ├── database.sql       # Database schema
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── App.css        # Global styles
│   └── package.json       # Frontend dependencies
└── README.md
```

## 🎨 Key Components

### Frontend Components
- **Navbar**: Navigation with role-based access
- **Home**: Landing page with services
- **Login**: Authentication forms
- **Dashboard**: User-specific dashboards
- **BookService**: Service booking with dynamic pricing
- **Tracking**: Real-time service tracking
- **AdminDashboard**: Analytics and management
- **ProviderDashboard**: Provider booking management

### Backend Features
- **Authentication**: Session-based auth system
- **Dynamic Pricing**: Real-time price calculation with urgency, time slot, and location factors
- **Real-time Updates**: Socket.io integration for live notifications
- **Database Operations**: SQLite with better-sqlite3
- **API Endpoints**: RESTful API design
- **Membership System**: Three-tier discount system (Basic 10%, Premium 20%, Gold 30%)

## 📈 Analytics Features

- Total bookings and revenue tracking
- User growth analytics
- Service performance metrics
- Real-time dashboard updates
- Interactive charts and graphs

## 🔄 Real-time Features

- Live booking notifications
- Service status updates
- GPS tracking simulation
- Push notifications
- Real-time price updates

## 📁 Module-wise Code Organization

### Module 1: User Authentication & Service Browsing
- `frontend/src/pages/Login.tsx` - Login/Registration
- `frontend/src/pages/Home.tsx` - Service catalog
- `backend/server.js` - Auth endpoints

### Module 2: Dynamic Pricing & Booking
- `frontend/src/pages/BookService.tsx` - Booking interface
- `frontend/src/pages/Membership.tsx` - Membership plans
- `backend/server.js` - Pricing algorithm & booking APIs

### Module 3: Real-time Tracking & Notifications
- `frontend/src/pages/Tracking.tsx` - GPS tracking UI
- `backend/server.js` - Socket.io implementation

### Module 4: Dashboard & Analytics
- `frontend/src/pages/Dashboard.tsx` - Customer dashboard
- `frontend/src/pages/ProviderDashboard.tsx` - Provider panel
- `frontend/src/pages/AdminDashboard.tsx` - Admin analytics

## 🎨 Design System

**Serene Cool Tones Palette (2025-2026 Award-winning Design)**
- Background: #EEF2FF (Soft Lavender)
- Primary: #4F46E5 (Indigo)
- Secondary: #14B8A6 (Teal)
- Accent: #84CC16 (Sage Green)
- Modern, trustworthy, and professional aesthetic
  

## 📊 Git Workflow

```bash
# Regular updates
git add .
git commit -m "Module X: Feature description"
git push origin main

# Before each review
git status
git log --oneline
```

## ✅ Review Checklist

- [ ] All team members have repository access
- [ ] Regular commits with meaningful messages
- [ ] Module-wise code organization maintained
- [ ] README updated with latest features
- [ ] Demo credentials working
- [ ] Application runs without errors

## 🤝 Contributing

This is a B.Tech 3-2 E2E mini project. All team members must contribute regularly and push updates to this repository.

## 📝 License

This project is for educational purposes as part of B.Tech curriculum.

## 📞 Support

For project-related queries, contact the development team.

---

**Quick Fix** - Connecting homes with trusted service providers through technology.
