# Hotel Booking App

A high-performance React application for browsing hotel rooms, filtering by preferences, and completing bookings through M-Pesa STK Push integration.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [M-Pesa Integration](#m-pesa-integration)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)

## Features

### Guest Experience
- **Landing Page**: Hero section with search bar for dates and location
- **Room Directory**: Grid display with price, images, and availability status
- **Filtering System**: Filter by price range, category (Single/Double/Suite), and location
- **Room Details**: Comprehensive room information with booking form
- **Booking Cart**: Add multiple rooms, review before checkout
- **Booking History**: View all past bookings with receipt download

### Payment System
- **M-Pesa STK Push**: Real-time payment initiation via Safaricom Daraja API
- **Simulation Mode**: Test payments without real money (for development)
- **Payment Status Polling**: Real-time transaction status updates
- **Receipt Generation**: Download booking receipts as text files
- **Phone Validation**: Kenyan format validation (2547XX or 07XX)

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Axios** for API requests

### Backend
- **Node.js** with Express
- **M-Pesa Daraja API** integration
- **CORS** enabled for cross-origin requests

### Database
- **json-server** for rapid REST API development
- **LocalStorage** for client-side persistence

## Project Structure

```
hotel-booking-app/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with cart counter
│   │   ├── Footer.jsx          # Footer with contact info
│   │   ├── HeroSection.jsx     # Landing page hero with search
│   │   ├── RoomCard.jsx        # Room display card component
│   │   ├── FilterBar.jsx       # Advanced filtering UI
│   │   └── MpesaModal.jsx      # M-Pesa payment modal
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with room grid
│   │   ├── RoomDetails.jsx     # Individual room page
│   │   ├── Checkout.jsx        # Cart and payment page
│   │   └── BookingHistory.jsx  # Past bookings view
│   ├── context/
│   │   └── BookingContext.jsx  # Global state management
│   ├── utils/
│   │   ├── index.js            # Utility functions
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind directives + custom styles
├── server/
│   ├── mpesa-gateway.js        # Express M-Pesa server
│   ├── package.json            # Server dependencies
│   └── .env.example            # Environment template
├── db.json                     # Room & booking database
├── package.json                # Frontend dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind theme config
└── index.html                  # HTML entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Step 1: Install Frontend Dependencies
```bash
cd hotel-booking-app
npm install
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Install json-server (Global)
```bash
npm install -g json-server
```

### Step 4: Start json-server (Database)
```bash
# In a new terminal
json-server --watch db.json --port 3001
```

### Step 5: Start M-Pesa Gateway Server
```bash
# In a new terminal
cd server
npm start
# Or with nodemon for development:
npm run dev
```

### Step 6: Start React Frontend
```bash
# In a new terminal (from project root)
npm run dev
```

### Step 7: Open in Browser
Navigate to `http://localhost:3000`

## M-Pesa Integration

### Sandbox Setup (For Testing)

1. **Register on Daraja Portal**
   - Visit: https://developer.safaricom.co.ke
   - Create an account and log in
   - Create a new app to get Consumer Key and Consumer Secret

2. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   ```
   Edit `.env` with your credentials:
   ```env
   MPESA_CONSUMER_KEY=your_actual_consumer_key
   MPESA_CONSUMER_SECRET=your_actual_consumer_secret
   MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   MPESA_SHORTCODE=174379
   CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/callback
   ```

3. **Expose Local Server with Ngrok**
   ```bash
   # Install ngrok if not already installed
   # Then run:
   ngrok http 5000
   ```
   Copy the HTTPS URL and update `CALLBACK_URL` in `.env`

4. **Restart Server**
   ```bash
   cd server
   npm start
   ```

### Simulation Mode (No Real Credentials Needed)
The app includes a **Simulation Mode** toggle in the payment modal. When enabled:
- No real M-Pesa credentials required
- Simulates STK Push flow
- Auto-completes payment after 5-10 seconds
- Perfect for development and presentations

## API Endpoints

### M-Pesa Gateway (Port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health check |
| POST | `/api/mpesa/stkpush` | Initiate real STK Push |
| POST | `/api/mpesa/simulate` | Simulate STK Push (demo) |
| POST | `/api/mpesa/callback` | M-Pesa callback receiver |
| GET | `/api/mpesa/status/:id` | Check transaction status |
| GET | `/api/mpesa/transactions` | List all transactions |

### JSON Server (Port 3001)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms` | List all rooms |
| GET | `/rooms/:id` | Get specific room |
| POST | `/bookings` | Create new booking |
| GET | `/bookings` | List all bookings |

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_JSON_SERVER_URL=http://localhost:3001
```

### Backend (.env)
```env
# M-Pesa Daraja API
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379

# BlessedTexts SMS
BLESSED_TEXTS_API_KEY=your_blessedtexts_api_key
BLESSED_TEXTS_SENDER_ID=BLESSEDTEXT
BLESSED_TEXTS_ENDPOINT=https://sms.blessedtexts.com/api/sms/v1/sendsms

# Server
PORT=5000
NODE_ENV=development
BASE_URL=https://sandbox.safaricom.co.ke
CALLBACK_URL=https://your-ngrok-url.ngrok-free.app/api/mpesa/callback
```

## Key Features Implemented

### React Router
- `/` - Home page with room directory
- `/room/:id` - Room details with booking form
- `/checkout` - Cart review and payment
- `/bookings` - Booking history

### State Management
- `useState` and `useEffect` for component state
- Context API for global booking/cart state
- LocalStorage persistence for bookings and cart

### Controlled Forms
- Booking form with validation (dates, guests, personal info)
- M-Pesa phone number validation (Kenyan format)
- Real-time error feedback

### External API Integration
- `json-server` for room and booking data
- Express server for M-Pesa STK Push
- Polling mechanism for payment status

### M-Pesa STK Push
- Phone number validation (2547XX or 07XX format)
- STK Push initiation with loading states
- Real-time status polling
- Success/failure handling with receipts

## UI/UX Highlights

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful messages when no data
- **Animations**: Smooth transitions and micro-interactions
- **Toast Notifications**: Success/error feedback
- **Glass Morphism**: Modern backdrop blur effects

## Testing the Payment Flow

1. Add a room to cart from the home page
2. Go to checkout (`/checkout`)
3. Click "Pay with M-Pesa"
4. In the modal:
   - Toggle **Simulation Mode ON** (recommended for testing)
   - Enter a test phone number: `254712345678` or `0712345678`
   - Click "Pay with M-Pesa"
5. Watch the processing state with countdown timer
6. After 5-10 seconds, payment will auto-complete
7. View your confirmed booking in `/bookings`

## Notes for Module 3 Submission

This project demonstrates mastery in:
- **React Router**: Multi-page navigation with dynamic routes
- **State Management**: Context API with useState/useEffect
- **Controlled Forms**: Validated booking and payment forms
- **External API**: json-server for data, Express for M-Pesa
- **M-Pesa Integration**: Full STK Push flow with Daraja API
- **Professional UI**: Tailwind CSS with responsive design
- **Error Handling**: Graceful fallbacks and user feedback

## License

MIT License - Feel free to use for educational purposes.

---

**Built with ❤️ for Module 3 Project**
