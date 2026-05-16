import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // Load from localStorage on init
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('hotel_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentBooking, setCurrentBooking] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('hotel_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 50000],
    location: 'all',
    searchQuery: ''
  });

  // Persist bookings to localStorage
  useEffect(() => {
    localStorage.setItem('hotel_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('hotel_cart', JSON.stringify(cart));
  }, [cart]);

  // Add room to cart
  const addToCart = (room, bookingDetails) => {
    const cartItem = {
      id: `${room.id}-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      price: room.price,
      category: room.category,
      location: room.location,
      checkIn: bookingDetails.checkIn,
      checkOut: bookingDetails.checkOut,
      guests: bookingDetails.guests,
      nights: bookingDetails.nights,
      totalAmount: room.price * bookingDetails.nights,
      // Guest information
      fullName: bookingDetails.fullName || '',
      email: bookingDetails.email || '',
      phone: bookingDetails.phone || '',
      addedAt: new Date().toISOString()
    };

    setCart(prev => [...prev, cartItem]);
    return cartItem;
  };

  // Remove from cart
  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Add completed booking
  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      bookingId: `BK-${Date.now()}`,
      bookedAt: new Date().toISOString(),
      status: 'confirmed'
    };

    setBookings(prev => [newBooking, ...prev]);
    setCurrentBooking(newBooking);
    clearCart();
    return newBooking;
  };

  // Update booking status (e.g., after payment)
  const updateBookingStatus = (bookingId, status, paymentDetails = null) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.bookingId === bookingId 
          ? { 
              ...booking, 
              status, 
              paymentDetails,
              updatedAt: new Date().toISOString()
            }
          : booking
      )
    );
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    updateBookingStatus(bookingId, 'cancelled');
  };

  // Set current booking for checkout
  const setActiveBooking = (booking) => {
    setCurrentBooking(booking);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Calculate cart totals
  const cartTotals = {
    items: cart.length,
    subtotal: cart.reduce((sum, item) => sum + item.totalAmount, 0),
    tax: cart.reduce((sum, item) => sum + item.totalAmount * 0.16, 0), // 16% VAT
    total: cart.reduce((sum, item) => sum + item.totalAmount * 1.16, 0)
  };

  const value = {
    bookings,
    currentBooking,
    cart,
    cartTotals,
    filters,
    addToCart,
    removeFromCart,
    clearCart,
    addBooking,
    updateBookingStatus,
    cancelBooking,
    setActiveBooking,
    updateFilters
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}