# Module 1 - User Authentication & Service Browsing

## Features
- User Registration (Customer / Provider / Admin)
- Secure Login with JWT authentication
- Role-based Access Control
- Service Catalog with 8+ categories
- Password hashing with bcrypt

## Frontend Files
- `Login.tsx` - Login and Registration forms
- `Home.tsx` - Service catalog and landing page
- `Navbar.tsx` - Navigation with role-based links

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/services | Get all services |

## Demo Credentials
- Customer: customer@test.com / password
- Provider: provider@test.com / password
- Admin: admin@test.com / password
