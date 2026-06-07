import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../hooks/useAuth';
import { fetchRoomById } from '../utils/api';
import { formatCurrency, calculateNights } from '../utils';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Users, 
  Check,
  Calendar,
  Minus,
  Plus,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useBooking();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize form with user data if logged in
  const [bookingForm, setBookingForm] = useState(() => ({
    checkIn: '',
    checkOut: '',
    guests: 1,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: ''
  }));
  const [formErrors, setFormErrors] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Sync guest information when user logs in
  useEffect(() => {
    if (user) {
      setBookingForm(prevForm => ({
        ...prevForm,
        fullName: user.name || prevForm.fullName,
        email: user.email || prevForm.email
      }));
    }
  }, [user]);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading room with id:', id);
        
        // Try to fetch from API first
        try {
          const data = await fetchRoomById(id);
          console.log('API response:', data);
          if (data && data.id) {
            setRoom(data);
            return; // Success
          }
        } catch (apiErr) {
          console.error('API fetch failed, trying fallback:', apiErr);
        }

        // Fallback: load from db.json
        console.log('Trying fallback fetch...');
        const response = await fetch('/db.json');
        console.log('Fallback response status:', response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const dbData = await response.json();
        console.log('db.json data:', dbData);
        const foundRoom = dbData.rooms && dbData.rooms.find(r => String(r.id) === String(id));
        console.log('Found room:', foundRoom);
        
        if (foundRoom) {
          setRoom(foundRoom);
        } else {
          setError('Room not found.');
        }
      } catch (err) {
        console.error('Error loading room:', err);
        setError('Failed to load room details.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRoom();
  }, [id]);

  const validateForm = () => {
    const errors = {};

    if (!bookingForm.checkIn) errors.checkIn = 'Check-in date is required';
    if (!bookingForm.checkOut) errors.checkOut = 'Check-out date is required';
    if (bookingForm.checkIn && bookingForm.checkOut) {
      const checkIn = new Date(bookingForm.checkIn);
      const checkOut = new Date(bookingForm.checkOut);
      if (checkOut <= checkIn) {
        errors.checkOut = 'Check-out must be after check-in';
      }
    }

    if (!bookingForm.fullName.trim()) errors.fullName = 'Full name is required';
    if (!bookingForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email)) {
      errors.email = 'Invalid email format';
    }

    if (!bookingForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (bookingForm.guests < 1 || bookingForm.guests > (room?.maxGuests || 1)) {
      errors.guests = `Guests must be between 1 and ${room?.maxGuests}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = async () => {
    if (!validateForm()) return;

    setIsAddingToCart(true);

    try {
      const nights = calculateNights(bookingForm.checkIn, bookingForm.checkOut);

      addToCart(room, {
        ...bookingForm,
        nights
      });

      // Navigate to checkout
      navigate('/checkout');
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const nights = calculateNights(bookingForm.checkIn, bookingForm.checkOut);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Room Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The room you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = room.status === 'available';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Back */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all rooms
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image & Details */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                  {isAvailable ? 'Available' : 'Booked'}
                </span>
                <span className="badge badge-primary">{room.category}</span>
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {room.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{room.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{room.rating}</span>
                      <span>({room.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">
                    {formatCurrency(room.price)}
                  </p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">
                {room.description}
              </p>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room?.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Check className="w-4 h-4 text-success-500" />
                        <span>{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No amenities information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">M-Pesa protected</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Instant Confirm</p>
                <p className="text-xs text-gray-500">Book in seconds</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Sparkles className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Best Price</p>
                <p className="text-xs text-gray-500">Guaranteed rates</p>
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Book This Room</h2>
                <p className="text-primary-100 text-sm">Fill in your details to reserve</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Check-in
                      </div>
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={bookingForm.checkIn}
                      onChange={(e) => {
                        setBookingForm(prev => ({ ...prev, checkIn: e.target.value }));
                        if (formErrors.checkIn) setFormErrors(prev => ({ ...prev, checkIn: '' }));
                      }}
                      className={`input-field ${formErrors.checkIn ? 'input-field-error' : ''}`}
                      disabled={!isAvailable}
                    />
                    {formErrors.checkIn && (
                      <p className="text-danger-600 text-xs mt-1">{formErrors.checkIn}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Check-out
                      </div>
                    </label>
                    <input
                      type="date"
                      min={bookingForm.checkIn || tomorrow}
                      value={bookingForm.checkOut}
                      onChange={(e) => {
                        setBookingForm(prev => ({ ...prev, checkOut: e.target.value }));
                        if (formErrors.checkOut) setFormErrors(prev => ({ ...prev, checkOut: '' }));
                      }}
                      className={`input-field ${formErrors.checkOut ? 'input-field-error' : ''}`}
                      disabled={!isAvailable}
                    />
                    {formErrors.checkOut && (
                      <p className="text-danger-600 text-xs mt-1">{formErrors.checkOut}</p>
                    )}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      Guests (Max {room.maxGuests})
                    </div>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingForm(prev => ({ 
                        ...prev, 
                        guests: Math.max(1, prev.guests - 1) 
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={bookingForm.guests <= 1 || !isAvailable}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{bookingForm.guests}</span>
                    <button
                      type="button"
                      onClick={() => setBookingForm(prev => ({ 
                        ...prev, 
                        guests: Math.min(room.maxGuests, prev.guests + 1) 
                      }))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={bookingForm.guests >= room.maxGuests || !isAvailable}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formErrors.guests && (
                    <p className="text-danger-600 text-xs mt-1">{formErrors.guests}</p>
                  )}
                </div>

                {/* Personal Details */}
                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Guest Information
                    </h3>
                    {user && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-success-50 text-success-700 text-xs font-medium rounded-full border border-success-200">
                        <Check className="w-3 h-3" />
                        Pre-filled
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Full Name</span>
                      {user && bookingForm.fullName === user.name && (
                        <span className="text-xs text-success-600 font-medium">From your account</span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={bookingForm.fullName}
                      onChange={(e) => {
                        setBookingForm(prev => ({ ...prev, fullName: e.target.value }));
                        if (formErrors.fullName) setFormErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all placeholder-gray-400 ${
                        user && bookingForm.fullName === user.name
                          ? 'border-success-300 bg-success-50/50 focus:border-success-500 focus:outline-none'
                          : formErrors.fullName
                          ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                          : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                      }`}
                      disabled={!isAvailable}
                    />
                    {formErrors.fullName && (
                      <p className="text-danger-600 text-xs mt-1 flex items-center gap-1">
                        <span>•</span>
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center justify-between">
                      <span>Email Address</span>
                      {user && bookingForm.email === user.email && (
                        <span className="text-xs text-success-600 font-medium">From your account</span>
                      )}
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={bookingForm.email}
                      onChange={(e) => {
                        setBookingForm(prev => ({ ...prev, email: e.target.value }));
                        if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all placeholder-gray-400 ${
                        user && bookingForm.email === user.email
                          ? 'border-success-300 bg-success-50/50 focus:border-success-500 focus:outline-none'
                          : formErrors.email
                          ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                          : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                      }`}
                      disabled={!isAvailable}
                    />
                    {formErrors.email && (
                      <p className="text-danger-600 text-xs mt-1 flex items-center gap-1">
                        <span>•</span>
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Phone Number (M-Pesa)
                    </label>
                    <input
                      type="tel"
                      placeholder="2547XX XXX XXX"
                      value={bookingForm.phone}
                      onChange={(e) => {
                        setBookingForm(prev => ({ ...prev, phone: e.target.value }));
                        if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg transition-all placeholder-gray-400 ${
                        formErrors.phone
                          ? 'border-danger-500 focus:border-danger-600 focus:outline-none'
                          : 'border-gray-200 focus:border-primary-500 focus:outline-none'
                      }`}
                      disabled={!isAvailable}
                    />
                    {formErrors.phone && (
                      <p className="text-danger-600 text-xs mt-1 flex items-center gap-1">
                        <span>•</span>
                        {formErrors.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      For M-Pesa payment confirmation
                    </p>
                  </div>

                  {/* Edit Note for Logged-in Users */}
                  {user && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">💡 Booking for someone else?</span> Feel free to edit the guest information above. Your details are saved for next time.
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatCurrency(room.price)} x {nights} night{nights > 1 ? 's' : ''}
                      </span>
                      <span className="font-medium">{formatCurrency(room.price * nights)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees (16%)</span>
                      <span className="font-medium">{formatCurrency(room.price * nights * 0.16)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-primary-600">
                        {formatCurrency(room.price * nights * 1.16)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isAddingToCart}
                  className={`w-full btn-success flex items-center justify-center gap-2 ${
                    !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : !isAvailable ? (
                    'Room Unavailable'
                  ) : (
                    <>
                      Checkout
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </>
                  )}
                </button>

                {!isAvailable && (
                  <p className="text-center text-sm text-danger-600">
                    This room is currently booked. Please check back later.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;