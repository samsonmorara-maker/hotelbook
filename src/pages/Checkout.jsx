import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import MpesaModal from '../components/MpesaModal';
import { createBooking, updateRoomStatus } from '../utils/api';
import { formatCurrency, formatDate } from '../utils';
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Hotel
} from 'lucide-react';

function Checkout() {
  const { cart, cartTotals, removeFromCart, clearCart, addBooking } = useBooking();
  const navigate = useNavigate();

  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState(null);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleProceedToPayment = (item) => {
    setCurrentCartItem(item);
    setShowMpesaModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setShowMpesaModal(false);
    setProcessingBooking(true);

    try {
      // Create booking record with guest information
      const bookingData = {
        roomId: currentCartItem.roomId,
        roomName: currentCartItem.roomName,
        roomImage: currentCartItem.roomImage,
        checkIn: currentCartItem.checkIn,
        checkOut: currentCartItem.checkOut,
        guests: currentCartItem.guests,
        nights: currentCartItem.nights,
        pricePerNight: currentCartItem.price,
        totalAmount: currentCartItem.totalAmount * 1.16, // Including tax
        taxAmount: currentCartItem.totalAmount * 0.16,
        // Guest information
        fullName: currentCartItem.fullName || '',
        email: currentCartItem.email || '',
        phone: currentCartItem.phone || '',
        paymentMethod: 'M-Pesa',
        paymentDetails: {
          mpesaReceiptNumber: paymentData.mpesaReceiptNumber,
          phoneNumber: paymentData.phoneNumber,
          checkoutRequestId: paymentData.checkoutRequestId,
          transactionDate: new Date().toISOString()
        },
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      // Save to json-server
      try {
        await createBooking(bookingData);
        await updateRoomStatus(currentCartItem.roomId, 'booked');
      } catch (err) {
        console.error('Error saving to server:', err);
        // Continue anyway - we have localStorage backup
      }

      // Add to context (localStorage)
      const completedBooking = addBooking(bookingData);

      // Remove from cart
      removeFromCart(currentCartItem.id);

      setBookingDetails(completedBooking);
      setBookingSuccess(true);

    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setProcessingBooking(false);
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    // Modal handles its own failure UI
  };

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your room has been successfully booked and payment received.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-mono font-bold text-gray-900">{bookingDetails.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium text-gray-900">{bookingDetails.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="text-gray-900">{formatDate(bookingDetails.checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="text-gray-900">{formatDate(bookingDetails.checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="text-gray-900">{bookingDetails.guests}</span>
              </div>
              {bookingDetails.fullName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Guest Name:</span>
                  <span className="text-gray-900">{bookingDetails.fullName}</span>
                </div>
              )}
              {bookingDetails.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{bookingDetails.email}</span>
                </div>
              )}
              {bookingDetails.phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{bookingDetails.phone}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-bold text-primary-600">{formatCurrency(bookingDetails.totalAmount)}</span>
              </div>
              {bookingDetails.paymentDetails?.mpesaReceiptNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">M-Pesa Receipt:</span>
                  <span className="font-mono text-gray-900">{bookingDetails.paymentDetails.mpesaReceiptNumber}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/bookings')}
              className="flex-1 btn-primary"
            >
              View My Bookings
            </button>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setBookingDetails(null);
                navigate('/');
              }}
              className="flex-1 btn-secondary"
            >
              Book Another Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t added any rooms to your cart yet. Browse our available rooms and find your perfect stay.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-500 text-sm mt-1">
                Review your booking and complete payment
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                  Booking Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <img
                      src={item.roomImage}
                      alt={item.roomName}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.roomName}</h3>
                          <p className="text-sm text-gray-500">{item.location}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-danger-500 transition-colors p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(item.checkIn)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(item.checkOut)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Hotel className="w-4 h-4" />
                          <span>{item.nights} night{item.nights > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Shield className="w-4 h-4" />
                          <span>{item.guests} guest{item.guests > 1 ? 's' : ''}</span>
                        </div>
                        {(item.fullName || item.email || item.phone) && (
                          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                            {item.fullName && (
                              <p><span className="font-medium text-gray-900">Guest:</span> {item.fullName}</p>
                            )}
                            {item.email && (
                              <p><span className="font-medium text-gray-900">Email:</span> {item.email}</p>
                            )}
                            {item.phone && (
                              <p><span className="font-medium text-gray-900">Phone:</span> {item.phone}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">{formatCurrency(item.price)} x {item.nights} nights</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatCurrency(item.totalAmount)}</p>
                          <p className="text-xs text-gray-500">+ {formatCurrency(item.totalAmount * 0.16)} tax</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleProceedToPayment(item)}
                        disabled={processingBooking}
                        className="mt-3 w-full btn-success text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay with M-Pesa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cart */}
            {cart.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-danger-600 hover:text-danger-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Items
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(cartTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (16% VAT)</span>
                  <span className="font-medium">{formatCurrency(cartTotals.tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-primary-600">{formatCurrency(cartTotals.total)}</span>
                </div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">Secure M-Pesa Payment</p>
                    <p className="text-xs text-primary-600 mt-1">
                      Your payment is processed securely through Safaricom&apos;s M-Pesa API.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-warning-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning-800">Important</p>
                    <p className="text-xs text-warning-600 mt-1">
                      Ensure your M-Pesa number has sufficient balance before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Modal */}
      {currentCartItem && (
        <MpesaModal
          isOpen={showMpesaModal}
          onClose={() => {
            setShowMpesaModal(false);
            setCurrentCartItem(null);
          }}
          amount={currentCartItem.totalAmount * 1.16}
          bookingId={currentCartItem.id}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
}

export default Checkout;