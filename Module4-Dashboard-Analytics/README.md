# Module 4 - Dashboard & Analytics

## Features
- Customer dashboard with booking history
- Service provider dashboard with available bookings
- Admin analytics with revenue and user stats
- Role-based dashboard access

## Frontend Files
- `Dashboard.tsx` - Customer booking management
- `ProviderDashboard.tsx` - Provider booking acceptance and status updates
- `AdminDashboard.tsx` - Admin analytics and user management

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings/available | Get pending bookings (provider) |
| GET | /api/admin/analytics | Get platform analytics (admin) |

## User Roles & Access
| Role | Dashboard | Features |
|------|-----------|----------|
| Customer | Dashboard | Book services, track, review |
| Provider | ProviderDashboard | Accept bookings, update status |
| Admin | AdminDashboard | Analytics, user management |
