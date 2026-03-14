# Module 2: Dynamic Pricing & Service Management

## Features
- Location-based pricing
- Urgency-based multipliers (Normal, Urgent, Emergency)
- Time slot premiums (Evening, Weekend)
- Real-time price calculation
- Transparent pricing breakdown

## Frontend Files
- `BookService.tsx` - Booking form with real-time dynamic pricing
- `Membership.tsx` - Membership plans (Basic 10%, Premium 20%, Gold 30%)

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking with dynamic price |
| GET | /api/services | Get services with base prices |

## Dynamic Pricing Formula
```
Final Price = Base Price × Urgency × Time Slot × Location × (1 - Membership Discount)

Urgency Multipliers:
  Normal    → 1.0x
  Urgent    → 1.5x
  Emergency → 2.0x

Time Slot Multipliers:
  Morning / Afternoon → 1.0x
  Evening / Weekend   → 1.2x

Location Multipliers:
  Regular Areas                        → 1.0x
  Premium (Banjara Hills, Jubilee Hills, Gachibowli) → 1.3x

Membership Discounts:
  Basic   → 10% OFF
  Premium → 20% OFF
  Gold    → 30% OFF
```
