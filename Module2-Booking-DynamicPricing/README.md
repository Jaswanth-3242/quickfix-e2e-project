# Module 2 - Booking & Dynamic Pricing

## Features
- Service booking with real-time price calculation
- Dynamic pricing based on urgency, time slot, location
- Membership discount system (Basic 10%, Premium 20%, Gold 30%)
- Booking confirmation and history

## Frontend Files
- `BookService.tsx` - Booking form with dynamic pricing
- `Membership.tsx` - Membership plans and benefits

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create new booking |
| GET | /api/bookings/customer/:id | Get customer bookings |

## Dynamic Pricing Formula
```
Final Price = Base Price × Urgency × Time Slot × Location × (1 - Membership Discount)

Urgency:    Normal=1x, Urgent=1.5x, Emergency=2x
Time Slot:  Morning/Afternoon=1x, Evening/Weekend=1.2x
Location:   Regular=1x, Premium Areas=1.3x
```
