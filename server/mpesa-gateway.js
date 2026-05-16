const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== CONFIGURATION ====================
function requireEnvVar(key) {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Sandbox credentials (replace with your actual Daraja credentials)
const CONFIG = {
  CONSUMER_KEY: requireEnvVar('MPESA_CONSUMER_KEY'),
  CONSUMER_SECRET: requireEnvVar('MPESA_CONSUMER_SECRET'),
  PASSKEY: requireEnvVar('MPESA_PASSKEY'),
  SHORTCODE: requireEnvVar('MPESA_SHORTCODE'),
  BASE_URL: process.env.BASE_URL || 'https://sandbox.safaricom.co.ke',
  CALLBACK_URL: process.env.CALLBACK_URL || 'https://your-ngrok-url.ngrok-free.app/api/mpesa/callback'
};

// In-memory storage for pending transactions
const pendingTransactions = new Map();
const transactionHistory = [];

// ==================== UTILITY FUNCTIONS ====================

// Generate access token from Daraja
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${CONFIG.CONSUMER_KEY}:${CONFIG.CONSUMER_SECRET}`).toString('base64');

    const response = await axios.get(
      `${CONFIG.BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error generating access token:', error.response?.data || error.message);
    throw new Error('Failed to generate M-Pesa access token');
  }
}

// Generate timestamp in format YYYYMMDDHHMMSS
function generateTimestamp() {
  const date = new Date();
  return date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');
}

// Generate password (Base64 of Shortcode+Passkey+Timestamp)
function generatePassword(timestamp) {
  const passwordString = `${CONFIG.SHORTCODE}${CONFIG.PASSKEY}${timestamp}`;
  return Buffer.from(passwordString).toString('base64');
}

// Validate Kenyan phone number
function validatePhoneNumber(phone) {
  // Remove any spaces, dashes, or parentheses
  phone = phone.replace(/[\s-()]/g, '');

  // Format: 2547XXXXXXXX or 07XXXXXXXX or +2547XXXXXXXX
  if (phone.startsWith('+254')) {
    phone = phone.substring(1); // Remove +
  }

  if (phone.startsWith('07') || phone.startsWith('01')) {
    phone = '254' + phone.substring(1);
  }

  // Validate: must be 2547XXXXXXXX or 2541XXXXXXXX
  const kenyanRegex = /^254(7|1)\d{8}$/;

  if (!kenyanRegex.test(phone)) {
    return { valid: false, formatted: phone, error: 'Invalid Kenyan phone number. Use format: 2547XXXXXXXX or 07XXXXXXXX' };
  }

  return { valid: true, formatted: phone };
}

const BLESSED_TEXTS_API_KEY = requireEnvVar('BLESSED_TEXTS_API_KEY');
const BLESSED_TEXTS_SENDER_ID = requireEnvVar('BLESSED_TEXTS_SENDER_ID');
const BLESSED_TEXTS_ENDPOINT = process.env.BLESSED_TEXTS_ENDPOINT || 'https://sms.blessedtexts.com/api/sms/v1/sendsms';

async function sendBlessedTextsNotifications(phoneNumber, amount, receiptCode) {
  const phoneValidation = validatePhoneNumber(phoneNumber);
  if (!phoneValidation.valid) {
    throw new Error(`Invalid phone number for BlessedTexts SMS: ${phoneValidation.error}`);
  }

  const formattedPhone = phoneValidation.formatted;
  const currentDate = new Date().toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const confirmationMessage = `Confirmed! We have received your payment of KES ${amount}. Your room booking is successful. HotelBook`;
  const receiptMessage = `Official Receipt: ${amount} KES received via M-Pesa. Trans Code: ${receiptCode}. Date: ${currentDate}. Thank you for choosing HotelBook`;

  const payloadBase = {
    apiKey: BLESSED_TEXTS_API_KEY,
    senderId: BLESSED_TEXTS_SENDER_ID,
    sender_id: BLESSED_TEXTS_SENDER_ID,
    to: formattedPhone,
    recipient: formattedPhone
  };

  await axios.post(
    BLESSED_TEXTS_ENDPOINT,
    {
      ...payloadBase,
      message: confirmationMessage
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  await axios.post(
    BLESSED_TEXTS_ENDPOINT,
    {
      ...payloadBase,
      message: receiptMessage
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    success: true,
    phoneNumber: formattedPhone,
    sentAt: new Date().toISOString()
  };
}

// ==================== ROUTES ====================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'M-Pesa Gateway Server is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      stkPush: 'POST /api/mpesa/stkpush',
      callback: 'POST /api/mpesa/callback',
      status: 'GET /api/mpesa/status/:checkoutRequestId',
      transactions: 'GET /api/mpesa/transactions',
      simulate: 'POST /api/mpesa/simulate' // For testing without real Daraja
    }
  });
});

// STK Push Endpoint
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc, bookingId } = req.body;

    // Validation
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and amount are required'
      });
    }

    if (amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be at least 1 KES'
      });
    }

    // Validate and format phone
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({
        success: false,
        error: phoneValidation.error
      });
    }

    const formattedPhone = phoneValidation.formatted;
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);

    // Get access token
    const accessToken = await getAccessToken();

    // Prepare STK Push payload
    const payload = {
      BusinessShortCode: CONFIG.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: CONFIG.SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: CONFIG.CALLBACK_URL,
      AccountReference: accountReference || `BOOKING-${bookingId || Date.now()}`,
      TransactionDesc: transactionDesc || 'Hotel Room Booking Payment'
    };

    console.log('Initiating STK Push:', {
      phone: formattedPhone,
      amount: amount,
      timestamp: timestamp,
      accountRef: payload.AccountReference
    });

    // Call Daraja API
    const response = await axios.post(
      `${CONFIG.BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage } = response.data;

    // Store pending transaction
    const transaction = {
      merchantRequestId: MerchantRequestID,
      checkoutRequestId: CheckoutRequestID,
      phoneNumber: formattedPhone,
      amount: amount,
      accountReference: payload.AccountReference,
      bookingId: bookingId,
      status: 'pending',
      responseCode: ResponseCode,
      responseDescription: ResponseDescription,
      customerMessage: CustomerMessage,
      createdAt: new Date().toISOString(),
      callbackData: null
    };

    pendingTransactions.set(CheckoutRequestID, transaction);
    transactionHistory.push(transaction);

    // Log to file
    fs.appendFileSync(
      path.join(__dirname, 'transactions.log'),
      JSON.stringify({ type: 'initiated', ...transaction }) + '\n'
    );

    res.json({
      success: true,
      message: CustomerMessage || 'STK Push sent successfully',
      data: {
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        responseCode: ResponseCode,
        responseDescription: ResponseDescription
      }
    });

  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: 'Failed to initiate STK Push',
      details: error.response?.data || error.message
    });
  }
});

// M-Pesa Callback Endpoint (Called by Safaricom)
app.post('/api/mpesa/callback', async (req, res) => {
  try {
    const callbackData = req.body;

    console.log('M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    // Log callback
    fs.appendFileSync(
      path.join(__dirname, 'callbacks.log'),
      JSON.stringify({ timestamp: new Date().toISOString(), ...callbackData }) + '\n'
    );

    // Extract data from callback
    const { Body } = callbackData;
    const stkCallback = Body?.stkCallback;

    if (!stkCallback) {
      return res.status(400).json({ error: 'Invalid callback format' });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Find and update transaction
    const transaction = pendingTransactions.get(CheckoutRequestID);

    if (transaction) {
      transaction.status = ResultCode === 0 ? 'success' : 'failed';
      transaction.resultCode = ResultCode;
      transaction.resultDesc = ResultDesc;
      transaction.callbackData = CallbackMetadata;
      transaction.completedAt = new Date().toISOString();

      // Extract receipt number if success
      if (ResultCode === 0 && CallbackMetadata?.Item) {
        const receiptItem = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
        if (receiptItem) {
          transaction.mpesaReceiptNumber = receiptItem.Value;
        }
      }

      pendingTransactions.set(CheckoutRequestID, transaction);

      console.log(`Transaction ${CheckoutRequestID} updated: ${transaction.status}`);

      if (ResultCode === 0) {
        const receiptCode = transaction.mpesaReceiptNumber || CheckoutRequestID;
        sendBlessedTextsNotifications(transaction.phoneNumber, transaction.amount, receiptCode)
          .then(() => {
            console.log(`BlessedTexts SMS notifications sent for ${CheckoutRequestID}`);
          })
          .catch(err => {
            console.error('BlessedTexts SMS send failed:', err.response?.data || err.message || err);
          });
      }
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully'
    });

  } catch (error) {
    console.error('Callback processing error:', error);
    // Still return 200 to prevent Safaricom retries
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback received'
    });
  }
});

// Check transaction status
app.get('/api/mpesa/status/:checkoutRequestId', (req, res) => {
  const { checkoutRequestId } = req.params;
  const transaction = pendingTransactions.get(checkoutRequestId);

  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }

  res.json({
    success: true,
    data: {
      checkoutRequestId: transaction.checkoutRequestId,
      status: transaction.status,
      resultCode: transaction.resultCode,
      resultDesc: transaction.resultDesc,
      amount: transaction.amount,
      phoneNumber: transaction.phoneNumber,
      mpesaReceiptNumber: transaction.mpesaReceiptNumber,
      createdAt: transaction.createdAt,
      completedAt: transaction.completedAt
    }
  });
});

// Get all transactions
app.get('/api/mpesa/transactions', (req, res) => {
  const transactions = Array.from(pendingTransactions.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// ==================== SIMULATION MODE (For Testing Without Real Daraja) ====================

// Simulate STK Push (for development/testing)
app.post('/api/mpesa/simulate', async (req, res) => {
  try {
    const { phoneNumber, amount, accountReference, bookingId, simulateSuccess = true } = req.body;

    if (!phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and amount are required'
      });
    }

    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({
        success: false,
        error: phoneValidation.error
      });
    }

    const formattedPhone = phoneValidation.formatted;
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const merchantRequestId = `MR_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

    // Create simulated transaction
    const transaction = {
      merchantRequestId: merchantRequestId,
      checkoutRequestId: checkoutRequestId,
      phoneNumber: formattedPhone,
      amount: amount,
      accountReference: accountReference || `BOOKING-${bookingId || Date.now()}`,
      bookingId: bookingId,
      status: 'pending',
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: 'Success. Request accepted for processing',
      createdAt: new Date().toISOString(),
      callbackData: null,
      simulated: true
    };

    pendingTransactions.set(checkoutRequestId, transaction);
    transactionHistory.push(transaction);

    // Simulate callback after 5-10 seconds
    const delay = Math.floor(Math.random() * 5000) + 5000;

    setTimeout(() => {
      if (simulateSuccess) {
        // Simulate successful payment
        transaction.status = 'success';
        transaction.resultCode = 0;
        transaction.resultDesc = 'The service request is processed successfully.';
        transaction.mpesaReceiptNumber = `SIM${Date.now()}${Math.floor(Math.random() * 10000)}`;
        transaction.completedAt = new Date().toISOString();
        transaction.callbackData = {
          Item: [
            { Name: 'Amount', Value: amount },
            { Name: 'MpesaReceiptNumber', Value: transaction.mpesaReceiptNumber },
            { Name: 'TransactionDate', Value: generateTimestamp() },
            { Name: 'PhoneNumber', Value: formattedPhone }
          ]
        };

        sendBlessedTextsNotifications(formattedPhone, amount, transaction.mpesaReceiptNumber)
          .then(() => {
            console.log(`BlessedTexts SMS notifications sent for simulated transaction ${checkoutRequestId}`);
          })
          .catch(err => {
            console.error('BlessedTexts SMS send failed for simulated transaction:', err.response?.data || err.message || err);
          });
      } else {
        // Simulate failed payment
        transaction.status = 'failed';
        transaction.resultCode = 1;
        transaction.resultDesc = 'The balance is insufficient for the transaction.';
        transaction.completedAt = new Date().toISOString();
      }

      pendingTransactions.set(checkoutRequestId, transaction);

      console.log(`Simulated transaction ${checkoutRequestId} completed: ${transaction.status}`);

    }, delay);

    res.json({
      success: true,
      message: 'Simulated STK Push initiated',
      simulated: true,
      data: {
        merchantRequestId: merchantRequestId,
        checkoutRequestId: checkoutRequestId,
        responseCode: '0',
        responseDescription: 'Success. Request accepted for processing',
        simulationDelay: `${delay}ms`
      }
    });

  } catch (error) {
    console.error('Simulation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Simulation failed',
      details: error.message
    });
  }
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`🚀 M-Pesa Gateway Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Callback URL: ${CONFIG.CALLBACK_URL}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /`);
  console.log(`  POST /api/mpesa/stkpush`);
  console.log(`  POST /api/mpesa/callback`);
  console.log(`  GET  /api/mpesa/status/:checkoutRequestId`);
  console.log(`  GET  /api/mpesa/transactions`);
  console.log(`  POST /api/mpesa/simulate`);
});

module.exports = app;
