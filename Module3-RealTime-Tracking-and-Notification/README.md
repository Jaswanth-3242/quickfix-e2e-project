# Module 3: Real-Time Tracking & Notification

## Features
- Live GPS tracking simulation
- Socket.io for real-time updates
- Push notifications for status changes
- ETA calculations
- Service progress timeline

## Frontend Files
- `Tracking.tsx` - Live GPS tracking page with ETA and progress timeline

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /api/bookings/:id/accept | Provider accepts booking |
| PUT | /api/bookings/:id/status | Update service status |

## Socket.io Events
| Event | Direction | Description |
|-------|-----------|-------------|
| newBooking | Server → Client | New booking notification |
| bookingUpdate | Server → Client | Booking accepted by provider |
| statusUpdate | Server → Client | Service status changed |
| locationUpdate | Server → Client | Provider GPS location update |
| trackingUpdate | Client → Server | Provider sends live location |

## Service Progress Timeline
1. ✅ Booking Confirmed
2. ✅ Service Provider Assigned
3. 🔄 Service In Progress
4. ✅ Service Completed
