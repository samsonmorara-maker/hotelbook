import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3005';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const jsonApi = axios.create({
  baseURL: JSON_SERVER_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Room APIs
export const fetchRooms = async () => {
  const response = await jsonApi.get('/rooms');
  return response.data;
};

export const fetchRoomById = async (id) => {
  const response = await jsonApi.get(`/rooms/${id}`);
  return response.data;
};

export const updateRoomStatus = async (id, status) => {
  const response = await jsonApi.patch(`/rooms/${id}`, { status });
  return response.data;
};

// Booking APIs
export const fetchBookings = async () => {
  const response = await jsonApi.get('/bookings');
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await jsonApi.post('/bookings', bookingData);
  return response.data;
};

// M-Pesa APIs
export const initiateSTKPush = async (paymentData) => {
  const response = await api.post('/api/mpesa/stkpush', paymentData);
  return response.data;
};

export const simulateSTKPush = async (paymentData) => {
  const response = await api.post('/api/mpesa/simulate', paymentData);
  return response.data;
};

export const checkTransactionStatus = async (checkoutRequestId) => {
  const response = await api.get(`/api/mpesa/status/${checkoutRequestId}`);
  return response.data;
};

export const fetchTransactions = async () => {
  const response = await api.get('/api/mpesa/transactions');
  return response.data;
};

export { api, jsonApi };