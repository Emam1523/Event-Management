# Event Management System - Frontend

A modern, responsive event management platform built with React, featuring event browsing, ticket booking, and comprehensive admin dashboards.

## Features

### Public Features
- 🎉 **Event Discovery**: Browse and search events with advanced filtering
- 🎫 **Ticket Booking**: Easy ticket selection and purchase flow
- 💳 **Multiple Payment Methods**: Support for cards, bKash, Nagad
- 📱 **Responsive Design**: Mobile-first, works on all devices
- ⭐ **Reviews & Ratings**: Rate and review attended events

### User Features
- 🎟️ **Digital Tickets**: QR code-based tickets
- 📊 **Dashboard**: Track bookings and upcoming events
- 📧 **Email Notifications**: Booking confirmations and reminders
- 🔄 **Ticket Transfer**: Share tickets with friends

### Admin Features
- 📝 **Event Creation**: Complete event management system
- 📈 **Analytics Dashboard**: Revenue, bookings, and performance metrics
- 👥 **User Management**: Track all users and bookings
- 💰 **Revenue Tracking**: Real-time financial insights

## Tech Stack

- **React** 19.2.5 - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API calls
- **Date-fns** - Date formatting
- **React Icons** - Icon library
- **QRCode.react** - QR code generation
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── EventCard.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── layouts/            # Layout components
│   └── MainLayout.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Events.jsx
│   ├── EventDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── user/
│   │   ├── UserDashboard.jsx
│   │   └── MyTickets.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── CreateEvent.jsx
│       ├── ManageEvents.jsx
│       └── Analytics.jsx
├── services/           # API services
│   └── api.js
├── App.jsx             # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Key Features Implementation

### Authentication
- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes for authenticated users

### Cart System
- LocalStorage persistence
- Add/remove items
- Quantity management
- Real-time total calculation

### Payment Integration
- Multiple payment methods support
- Secure checkout process
- Order confirmation

### QR Tickets
- Unique QR code per ticket
- Download ticket as PDF/image
- Email delivery
- Easy verification

### Admin Dashboard
- Event CRUD operations
- Sales analytics
- Revenue tracking
- Booking management

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. Make sure the backend is running before starting the frontend.

Key API endpoints used:
- `/auth/*` - Authentication
- `/events/*` - Event management
- `/bookings/*` - Booking operations
- `/reviews/*` - Reviews and ratings
- `/admin/*` - Admin operations

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
