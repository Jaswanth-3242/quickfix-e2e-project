# Module 4: Admin Dashboard & Analytics

## Features
- Comprehensive analytics with charts
- User management system
- Booking management and oversight
- Revenue tracking
- System health monitoring

## Frontend Files
- `AdminDashboard.tsx` - Analytics, user management, revenue tracking
- `Dashboard.tsx` - Customer booking history and management
- `ProviderDashboard.tsx` - Provider booking acceptance and status updates

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/analytics | Get platform analytics |
| GET | /api/bookings/available | Get pending bookings (provider) |

## Analytics Overview
| Metric | Value |
|--------|-------|
| Total Bookings | 25+ |
| Total Revenue | ₹15,000+ |
| Active Providers | 8 |
| Pending Bookings | 5 |

## User Roles & Access
| Role | Dashboard | Access |
|------|-----------|--------|
| Customer | Dashboard | Bookings, tracking, reviews |
| Provider | ProviderDashboard | Accept bookings, update status |
| Admin | AdminDashboard | Full analytics and management |
