# Module 1: Customer Service Request & Booking

## Features
- User registration and authentication
- Service browsing and selection
- Real-time booking system
- Customer dashboard with booking history

## Frontend Files
- `Login.tsx` - User registration and login forms
- `Home.tsx` - Service browsing and selection
- `Navbar.tsx` - Navigation with role-based links

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/services | Get all services |
| POST | /api/bookings | Create new booking |
| GET | /api/bookings/customer/:id | Get customer booking history |

## Demo Credentials
- Customer: customer@test.com / password
- Provider: provider@test.com / password
- Admin: admin@test.com / password
