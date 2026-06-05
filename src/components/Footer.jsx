import { Hotel, Heart, Phone, Mail, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Hotel<span className="text-primary-400">Book</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted hotel booking platform with seamless M-Pesa integration. 
              Book your perfect stay anywhere in Kenya.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-danger-400" />
              <span>Made with love for Kenyan travelers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">Browse Rooms</a>
              </li>
              <li>
                <a href="/bookings" className="hover:text-primary-400 transition-colors">My Bookings</a>
              </li>
              <li>
                <a href="/how-mpesa-works" className="hover:text-primary-400 transition-colors">How M-Pesa Works</a>
              </li>
              <li>
                <a href="/support" className="hover:text-primary-400 transition-colors">Support</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>+254 708 319 101</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>support@hotelbook.co.ke</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2026 HotelBook. All rights reserved. | CloudStack & StayWeb.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;