import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { Search, SlidersHorizontal, X, MapPin, Tag } from 'lucide-react';

function FilterBar() {
  const { filters, updateFilters } = useBooking();
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: 'all', label: 'All Rooms' },
    { value: 'Single', label: 'Single' },
    { value: 'Double', label: 'Double' },
    { value: 'Suite', label: 'Suite' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'Nairobi CBD', label: 'Nairobi CBD' },
    { value: 'Westlands', label: 'Westlands' },
    { value: 'Kilimani', label: 'Kilimani' },
    { value: 'Karen', label: 'Karen' },
    { value: 'Lavington', label: 'Lavington' },
    { value: 'Eastleigh', label: 'Eastleigh' }
  ];

  const priceRanges = [
    { value: [0, 50000], label: 'Any Price' },
    { value: [0, 3000], label: 'Under KES 3,000' },
    { value: [3000, 6000], label: 'KES 3,000 - 6,000' },
    { value: [6000, 15000], label: 'KES 6,000 - 15,000' },
    { value: [15000, 50000], label: 'KES 15,000+' }
  ];

  const handleReset = () => {
    updateFilters({
      category: 'all',
      priceRange: [0, 50000],
      location: 'all',
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.location !== 'all' || 
    filters.priceRange[1] !== 50000 ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms by name, location, or amenity..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="input-field pl-10"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilters({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
            isExpanded 
              ? 'bg-primary-50 border-primary-200 text-primary-700' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 animate-fade-in">
          {/* Category Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Room Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => updateFilters({ location: e.target.value })}
              className="input-field"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Price Range
            </label>
            <select
              value={JSON.stringify(filters.priceRange)}
              onChange={(e) => updateFilters({ priceRange: JSON.parse(e.target.value) })}
              className="input-field"
            >
              {priceRanges.map((range, index) => (
                <option key={index} value={JSON.stringify(range.value)}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                {filters.category}
                <button onClick={() => updateFilters({ category: 'all' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.location !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                {filters.location}
                <button onClick={() => updateFilters({ location: 'all' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.priceRange[1] !== 50000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                KES {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
                <button onClick={() => updateFilters({ priceRange: [0, 50000] })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                &quot;{filters.searchQuery}&quot;
                <button onClick={() => updateFilters({ searchQuery: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleReset}
              className="text-sm text-danger-600 hover:text-danger-700 font-medium"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;