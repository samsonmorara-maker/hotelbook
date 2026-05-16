import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, MapPin, Wifi, Tv, Check } from 'lucide-react';
import { formatCurrency } from '../utils';
import { updateRoomStatus } from '../utils/api';

function RoomCard({ room, status }) {
  const [currentStatus, setCurrentStatus] = useState(status || room.status);

  useEffect(() => {
    setCurrentStatus(status || room.status);
  }, [status, room.status]);

  const isAvailable = currentStatus === 'available';

  return (
    <div className="card group animate-slide-up">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
            {isAvailable ? 'Available' : 'Booked'}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary">
            {room.category}
          </span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/80 text-xs">per night</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(room.price)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-white/90">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{room.rating}</span>
              <span className="text-xs text-white/60">({room.reviews})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {room.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{room.location}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {amenity === 'WiFi' && <Wifi className="w-3 h-3" />}
              {amenity === 'TV' && <Tv className="w-3 h-3" />}
              {amenity !== 'WiFi' && amenity !== 'TV' && <Check className="w-3 h-3" />}
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 gap-3">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Users className="w-4 h-4" />
            <span>Up to {room.maxGuests} guests</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/room/${room.id}`}
              className={`btn-primary text-sm ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => !isAvailable && e.preventDefault()}
            >
              {isAvailable ? 'Proceed to Checkout' : 'Room Unavailable'}
            </Link>

            {!isAvailable && (
              <button
                type="button"
                onClick={handleCancelBooking}
                className="btn-danger text-sm"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;