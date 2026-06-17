

import React from "react";

const rooms = [
  {
    id: 1,
    name: "Standard Room",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    price: "KSH 6000",
    description:
      "Comfortable room with modern amenities for business and leisure travelers.",
    guests: "2 Guests",
  },
  {
    id: 2,
    name: "Deluxe Room",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    price: "KSH 12,000",
    description:
      "Spacious room with premium furnishings and city views.",
    guests: "2 Guests",
  },
  {
    id: 3,
    name: "Family Room",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    price: "KSH 20,000",
    description:
      "Perfect for families with extra sleeping space and comfort.",
    guests: "4 Guests",
  },
  {
    id: 4,
    name: "Executive Suite",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    price: "KSH 10,000",
    description:
      "Luxury suite featuring a living area and premium amenities.",
    guests: "2 Guests",
  },
];

export default function RoomsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c"
          alt="Hotel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold">
              Our Rooms & Suites
            </h1>

            <p className="mt-4 text-lg">
              Discover comfort, elegance and luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Heading */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Choose Your Perfect Room
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our hotel features over 50 beautifully designed
            rooms ranging from standard accommodations to
            luxurious executive suites.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-semibold">
                  {room.name}
                </h3>

                <p className="text-gray-500 mt-2">
                  {room.description}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600">
                    {room.guests}
                  </span>

                  <span className="text-amber-600 font-bold text-xl">
                    {room.price}
                    <span className="text-sm text-gray-500">
                      /night
                    </span>
                  </span>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 border border-amber-600 text-amber-600 py-2 rounded-lg hover:bg-amber-50">
                    View Details
                  </button>

                  <button className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-12">
            Included Amenities
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-semibold">Free Wi-Fi</h3>
            </div>

            <div>
              <h3 className="font-semibold">
                Daily Housekeeping
              </h3>
            </div>

            <div>
              <h3 className="font-semibold">
                24/7 Reception
              </h3>
            </div>

            <div>
              <h3 className="font-semibold">
                Room Service
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
