import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, formatDate } from '../utils';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Clock4,
  Hotel,
  Users,
  CreditCard,
  ArrowLeft,
  Download,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BookingHistory() {
  const { bookings, cancelBooking } = useBooking();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Temporarily disable server loading since it's not working
    // loadServerBookings();
    setLoading(false);
  }, []);

  // Use only local bookings for now since server is not working
  const allBookings = [...bookings];

  // Sort by date (newest first)
  const sortedBookings = allBookings.sort((a, b) => 
    new Date(b.bookedAt || b.createdAt) - new Date(a.bookedAt || a.createdAt)
  );

  // Filter bookings
  const filteredBookings = sortedBookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchable = `${booking.roomName} ${booking.bookingId} ${booking.location || ''}`.toLowerCase();
      return searchable.includes(query);
    }
    return true;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-5 h-5 text-success-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-danger-600" />;
      case 'pending':
        return <Clock4 className="w-5 h-5 text-warning-600" />;
      default:
        return <Clock4 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-success-100 text-success-800',
      cancelled: 'bg-danger-100 text-danger-800',
      pending: 'bg-warning-100 text-warning-800'
    };
    return `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const handleDownloadReceipt = (booking) => {
    const receiptContent = [
      'HOTEL BOOKING RECEIPT',
      '=====================',
      '',
      'Booking ID: ' + booking.bookingId,
      'Date: ' + new Date(booking.bookedAt || booking.createdAt).toLocaleString('en-KE'),
      '',
      'ROOM DETAILS',
      '------------',
      'Room: ' + booking.roomName,
      'Location: ' + (booking.location || 'Nairobi'),
      'Check-in: ' + formatDate(booking.checkIn),
      'Check-out: ' + formatDate(booking.checkOut),
      'Nights: ' + booking.nights,
      'Guests: ' + booking.guests,
      '',
      'PAYMENT DETAILS',
      '---------------',
      'Payment Method: ' + (booking.paymentMethod || 'M-Pesa'),
      'Amount: ' + formatCurrency(booking.totalAmount),
      'Tax: ' + formatCurrency(booking.taxAmount || 0),
      booking.paymentDetails?.mpesaReceiptNumber ? 'M-Pesa Receipt: ' + booking.paymentDetails.mpesaReceiptNumber : '',
      '',
      booking.fullName ? 'Guest: ' + booking.fullName : '',
      booking.email ? 'Email: ' + booking.email : '',
      booking.phone ? 'Phone: ' + booking.phone : '',
      '',
      'Status: ' + booking.status.toUpperCase(),
      '',
      'Thank you for choosing HotelBook!'
    ].filter(line => line !== '').join('\n');

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${booking.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancelBooking = (booking) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your booking for "${booking.roomName}"?\n\n` +
      `Booking ID: ${booking.bookingId}\n` +
      `Check-in: ${formatDate(booking.checkIn)}\n` +
      `Total Amount: ${formatCurrency(booking.totalAmount)}\n\n` +
      `This action cannot be undone.`
    );

    if (confirmCancel) {
      cancelBooking(booking.bookingId);
      alert('Booking cancelled successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-500 text-sm mt-1">
                View and manage your hotel reservations
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rooms
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by room name or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'cancelled', label: 'Cancelled' }
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                      filter === f.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filter !== 'all' ? 'No matching bookings' : 'No bookings yet'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {searchQuery || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : "You haven't made any bookings yet. Start by browsing our available rooms."}
            </p>
            {!searchQuery && filter === 'all' && (
              <button
                onClick={() => navigate('/')}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Hotel className="w-4 h-4" />
                Browse Rooms
              </button>
            )}
          </div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.bookingId || booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Room Image */}
                  <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={booking.roomImage || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80'}
                      alt={booking.roomName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{booking.roomName}</h3>
                          <span className={getStatusBadge(booking.status)}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-mono">{booking.bookingId}</p>
                        {booking.fullName && (
                          <p className="text-sm text-gray-500 mt-2">
                            Guest: <span className="font-medium text-gray-900">{booking.fullName}</span>
                          </p>
                        )}
                        {booking.email && (
                          <p className="text-sm text-gray-500">Email: {booking.email}</p>
                        )}
                        {booking.phone && (
                          <p className="text-sm text-gray-500">Phone: {booking.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          {formatCurrency(booking.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatCurrency(booking.pricePerNight || 0)}/night
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <div>
                          <p className="text-xs text-gray-400">Check-in</p>
                          <p className="font-medium">{formatDate(booking.checkIn)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        <div>
                          <p className="text-xs text-gray-400">Check-out</p>
                          <p className="font-medium">{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <div>
                          <p className="text-xs text-gray-400">Duration</p>
                          <p className="font-medium">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-primary-500" />
                        <div>
                          <p className="text-xs text-gray-400">Guests</p>
                          <p className="font-medium">{booking.guests}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {booking.paymentDetails && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <CreditCard className="w-4 h-4 text-primary-600" />
                          <span className="text-gray-600">Paid via {booking.paymentMethod || 'M-Pesa'}</span>
                          {booking.paymentDetails.mpesaReceiptNumber && (
                            <span className="font-mono text-gray-900">
                              • Receipt: {booking.paymentDetails.mpesaReceiptNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDownloadReceipt(booking)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Receipt
                      </button>

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger-200 text-sm font-medium text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingHistory;