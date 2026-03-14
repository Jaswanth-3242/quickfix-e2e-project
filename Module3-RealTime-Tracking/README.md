# Module 3 - Real-Time Tracking & Notifications

## Features
- Live GPS tracking simulation of service provider
- Real-time status updates via Socket.io
- ETA calculations
- Service progress timeline
- Instant push notifications

## Frontend Files
- `Tracking.tsx` - Live tracking page with GPS coordinates and progress timeline

## Backend API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | /api/bookings/:id/status | Update booking status |
| PUT | /api/bookings/:id/accept | Provider accepts booking |

## Socket.io Events
| Event | Direction | Description |
|-------|-----------|-------------|
| newBooking | Server → Client | New booking created |
| bookingUpdate | Server → Client | Booking status changed |
| statusUpdate | Server → Client | Service status updated |
| locationUpdate | Server → Client | Provider GPS location |
| trackingUpdate | Client → Server | Provider sends location |
