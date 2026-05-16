import { useState } from 'react';
import { Search, Calendar, MapPin, Users, ChevronDown } from 'lucide-react';

function HeroSection({ onSearch }) {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchData);
    // Scroll to rooms section
    document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-primary-300">Stay in Kenya</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
            Browse premium rooms across Nairobi and beyond. 
            Book instantly with M-Pesa — no credit card needed.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
              <span className="text-primary-200">8+ Premium Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
              <span className="text-primary-200">M-Pesa Integrated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
              <span className="text-primary-200">Instant Booking</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form 
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  min={today}
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  min={searchData.checkIn || tomorrow}
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Guests & Search */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Guests
                </label>
                <button
                  type="button"
                  onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span>{searchData.guests} Guest{searchData.guests > 1 ? 's' : ''}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isGuestsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isGuestsOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Number of guests</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSearchData(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{searchData.guests}</span>
                        <button
                          type="button"
                          onClick={() => setSearchData(prev => ({ ...prev, guests: Math.min(10, prev.guests + 1) }))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="self-end bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HeroSection;