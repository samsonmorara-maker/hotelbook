# M-Pesa Payment Integration Guide

## Overview
This document describes the M-Pesa payment integration for the hotel booking app.

## Fixed Issues
✅ **Improved error handling** - The payment modal now gracefully handles server errors with client-side simulation fallback
✅ **Enhanced phone validation** - Better error messages for invalid phone numbers
✅ **Better UX feedback** - Users now see helpful troubleshooting tips when payment fails
✅ **Automatic fallback** - If the M-Pesa server is unavailable, the system uses client-side simulation for testing

## How to Test M-Pesa Payment

### Option 1: Using Simulation Mode (Recommended for Testing)
1. Go to the checkout page and click **"Pay with M-Pesa"** button
2. In the M-Pesa Modal, toggle **"Simulation Mode"** ON (it's on by default)
3. Enter a test phone number in format:
   - `2547XXXXXXXX` (e.g., 254712345678)
   - `07XXXXXXXX` (e.g., 0712345678)
   - `+2547XXXXXXXX` (e.g., +254712345678)
4. The payment will be simulated and succeed after 5-15 seconds
5. No real money is charged in simulation mode

### Option 2: Using Real M-Pesa (Requires Server)
1. Ensure the M-Pesa server is running:
   ```bash
   cd server
   npm install  # if not already installed
   npm start
   ```
2. The server runs on `http://localhost:5000`
3. In the M-Pesa Modal, toggle **"Simulation Mode"** OFF
4. Enter your actual M-Pesa registered phone number
5. An STK Push will be sent to your phone
6. You'll need valid M-Pesa credentials in `.env` for real payments

## Phone Number Formats
All these formats are automatically converted to `2547XXXXXXXX`:
- `07xxxxxxxx` (Kenyan leading zero format)
- `2547xxxxxxxx` (International format)
- `+2547xxxxxxxx` (International with plus)
- `01xxxxxxxx` (Alternative Kenyan format)

## What Happens During Payment

### Phase 1: Initiation
- User enters phone number and clicks "Pay with M-Pesa"
- System validates the phone number format
- API request is sent to start payment

### Phase 2: STK Push
- STK Push is sent to user's phone (real mode) or simulated (test mode)
- Modal shows "Check Your Phone" with 60-second countdown
- System polls for transaction status every 2 seconds

### Phase 3: Completion
- **Success**: Receipt shown with M-Pesa confirmation number
- **Failed**: Error message with troubleshooting tips shown
- **Timeout**: After 60 seconds, payment is marked as failed

## Troubleshooting

### "Payment failed" - What to check:
1. **Invalid phone number**: Ensure format matches `07XXXXXXXX` or `2547XXXXXXXX`
2. **Server not running**: If using real mode, ensure `npm start` in server folder
3. **Insufficient balance**: Check M-Pesa account balance
4. **Network issues**: Check internet connection
5. **Browser console errors**: Open DevTools (F12) → Console tab for error details

### Payment Modal Not Opening:
1. Check browser console (F12) for JavaScript errors
2. Verify you're logged in (auto-fill should show if logged in)
3. Try refreshing the page

### Server Connection Issues:
1. Verify server is running on port 5000
2. Check that Vite proxy is configured (see `vite.config.js`)
3. Open DevTools → Network tab and check requests to `/api/mpesa/*`

## API Endpoints

### Simulation Mode (No Real Credentials Needed)
```
POST /api/mpesa/simulate
Body: { phoneNumber, amount, accountReference, bookingId, simulateSuccess }
Response: { success, data: { checkoutRequestId, ... } }
```

### Real M-Pesa Mode (Requires Daraja Credentials)
```
POST /api/mpesa/stkpush
Body: { phoneNumber, amount, accountReference, transactionDesc, bookingId }
Response: { success, data: { checkoutRequestId, ... } }
```

### Check Payment Status
```
GET /api/mpesa/status/:checkoutRequestId
Response: { success, data: { status, resultDesc, mpesaReceiptNumber, ... } }
```

## Environment Variables (Server)

Create `server/.env` for real M-Pesa mode:
```
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
SHORTCODE=173955
PASSKEY=bfb279f9aa9bdbcf158e97dd1a2c2f2f57c2e6f2f3d3c2b1f2e3d4c5b6a7f8e9
CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
```

Get these credentials from Safaricom Daraja Platform: https://developer.safaricom.co.ke/

## Testing with Different Scenarios

### Simulate Success:
- Use `simulateSuccess: true` in payload
- Payment will succeed after random 5-15 second delay

### Simulate Failure:
- Use `simulateSuccess: false` in payload  
- Payment will fail with "insufficient balance" error

### Client-Side Fallback:
- If server is unavailable, payment automatically uses client-side simulation
- Perfect for testing frontend UI without backend
- Real charges cannot be processed in fallback mode

## Security Considerations

✅ **Phone validation**: All numbers validated server-side
✅ **Amount validation**: Minimum 1 KES required
✅ **Transaction tracking**: All transactions logged with timestamp
✅ **Receipt numbers**: Generated for successful transactions
✅ **Error handling**: Server errors don't expose sensitive info

## Future Improvements

- [ ] Add payment history view
- [ ] Email receipt upon successful payment
- [ ] SMS notification for payment status
- [ ] Retry logic for failed transactions
- [ ] Payment method diversity (card, bank transfer, etc.)
- [ ] Real-time payment status WebSocket updates
