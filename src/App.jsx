import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RoomDetails from './pages/RoomDetails'
import Checkout from './pages/Checkout'
import BookingHistory from './pages/BookingHistory'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import HowMpesaWorks from './pages/HowMpesaWorks'
import Support from './pages/Support'
import Footer from './components/Footer'
import HotelMap from './components/HotelMap'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/how-mpesa-works" element={<HowMpesaWorks />} />
          <Route path="/support" element={<Support />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/bookings" element={<BookingHistory />} />
        </Routes>
      </main>
      
      <div className="px-4 py-6 bg-white">
        <h2 className="text-xl font-semibold text-center mb-4">Our Location</h2>
        <HotelMap
          lat={-1.286389}
          lng={36.817223}
          hotelName="HotelBook - Nairobi"
        />
      </div>
      <Footer />
    </div>
  )
}

export default App