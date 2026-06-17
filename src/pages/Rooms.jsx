import { useState } from "react";

const roomsData = [
  {
    id: 1,
    name: "Standard Room",
    price: 80,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    guests: 2,
    beds: "1 Queen Bed",
    size: "25 m²",
  },
  {
    id: 2,
    name: "Deluxe Room",
    price: 120,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
    guests: 2,
    beds: "1 King Bed",
    size: "30 m²",
  },
  {
    id: 3,
    name: "Executive Room",
    price: 180,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    guests: 2,
    beds: "1 King Bed",
    size: "35 m²",
  },
  {
    id: 4,
    name: "Suite Room",
    price: 280,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
    guests: 3,
    beds: "1 King Bed + Living Area",
    size: "50 m²",
  },
];

export default function RoomsPage() {
  const [priceFilter, setPriceFilter] = useState(500);

  const filteredRooms = roomsData.filter(
    (room) => room.price <= priceFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="relative h-[320px] bg-black text-white flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1501117716987-c8e1ecb210c0"
          className="absolute w-full h-full object-cover opacity-50"
        />
        <div className="relative text-center">
          <h1 className="text-4xl font-bold">Our Rooms</h1>
          <p className="text-sm mt-2">Comfort, luxury, and modern design</p>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* FILTER PANEL */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-lg mb-4">Filter Rooms</h2>

          <label className="text-sm">Max Price: ${priceFilter}</label>
          <input
            type="range"
            min="50"
            max="500"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="w-full"
          />

          <button className="mt-4 w-full bg-black text-white py-2 rounded">
            Apply
          </button>
        </div>

        {/* ROOMS GRID */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">

          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-xl shadow overflow-hidden">

              <img
                src={room.image}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold">{room.name}</h3>
                <p className="text-gray-500 text-sm">
                  {room.beds} • {room.size} • {room.guests} Guests
                </p>

                <p className="mt-2 text-lg font-bold">
                  ${room.price} / night
                </p>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 border py-2 rounded">
                    View Details
                  </button>
                  <button className="flex-1 bg-black text-white py-2 rounded">
                    Book Now
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}