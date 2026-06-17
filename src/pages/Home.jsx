import { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import RoomCard from '../components/RoomCard';
import { fetchRooms } from '../utils/api';
import { Loader2, AlertCircle, Hotel } from 'lucide-react';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters } = useBooking();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      try {
        const data = await fetchRooms();
        // Ensure data is an array, if not extract rooms property
        const roomsArray = Array.isArray(data) ? data : (data?.rooms || []);
        if (roomsArray.length > 0) {
          setRooms(roomsArray);
          return; // Success
        }
      } catch (apiErr) {
        console.error('API fetch failed, trying fallback:', apiErr);
      }

      // Fallback: load directly from db.json
      const response = await fetch('/db.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const dbData = await response.json();
      const roomsArray = dbData.rooms || [];
      
      if (roomsArray.length === 0) {
        setError('No rooms available at this time.');
      } else {
        setRooms(roomsArray);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading rooms:', err);
      setError('Failed to load rooms. Please try again later.');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms based on current filters
  const filteredRooms = rooms.filter(room => {
    // Category filter
    if (filters.category !== 'all' && room.category !== filters.category) {
      return false;
    }

    // Location filter
    if (filters.location !== 'all' && room.location !== filters.location) {
      return false;
    }

    // Price range filter
    if (room.price < filters.priceRange[0] || room.price > filters.priceRange[1]) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `
        ${room.name} 
        ${room.description} 
        ${room.location} 
        ${room.category} 
        ${room.amenities.join(' ')}
      `.toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const handleSearch = (searchData) => {
    // Update filters based on search form
    if (searchData.location) {
      // This would typically update location filter
      console.log('Search data:', searchData);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Rooms Section */}
      <section id="rooms-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Type of Rooms
            </h2>
            <p className="text-gray-500 mt-1">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
              {filters.category !== 'all' && ` in ${filters.category} category`}
              {filters.location !== 'all' && ` at ${filters.location}`}
            </p>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-primary-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading...</span>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Error State */}
        {error && !loading && (
          <div className="bg-danger-50 border border-danger-200 rounded-xl p-6 text-center mb-6">
            <AlertCircle className="w-12 h-12 text-danger-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-danger-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-danger-600 mb-4">{error}</p>
            <button
              onClick={loadRooms}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && (
          <>
            {filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} status={room.status} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hotel className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find available rooms.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Choose HotelBook?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We combine convenience, security, and affordability to give you the best booking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">M-Pesa Integration</h3>
              <p className="text-gray-600 text-sm">
                Pay securely using M-Pesa STK Push. No credit card required — just your phone.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Instant</h3>
              <p className="text-gray-600 text-sm">
                Your bookings are confirmed instantly with real-time payment verification.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Selection</h3>
              <p className="text-gray-600 text-sm">
                Curated rooms across Nairobi&apos;s best neighborhoods — from budget to luxury.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;