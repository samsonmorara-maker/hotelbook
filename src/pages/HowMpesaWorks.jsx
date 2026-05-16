import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Smartphone,
  CreditCard,
  CheckCircle,
  Zap,
  Home
} from 'lucide-react';

function HowMpesaWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Initiate Booking",
      description: "Complete your hotel booking and select M-Pesa as your payment method. Our system will automatically send an STK Push request to your registered phone number."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-400" />,
      title: "Receive Pin Prompt on Phone",
      description: "Your phone will receive a notification from M-Pesa asking you to enter your PIN. This is a secure verification step to authorize the payment."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-yellow-400" />,
      title: "Enter PIN",
      description: "Enter your M-Pesa PIN on your phone to complete the transaction. This ensures only you can authorize payments from your account."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
      title: "Confirmation",
      description: "Once the PIN is verified, you'll receive a confirmation message and your booking will be instantly confirmed. You'll get a booking reference number."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 opacity-30" />
        <div className="relative px-6 py-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="absolute left-6 top-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-blue-500">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-4">How M-Pesa Works</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Secure, instant payments for your hotel bookings. No credit cards required — just your phone.
          </p>
        </div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-start my-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-gray-400">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-center">Why Choose M-Pesa?</h2>
            <div className="grid gap-6 md:grid-cols-3 text-center">
              <div>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Secure & Trusted</h3>
                <p className="text-gray-300 text-sm">
                  Used by millions across Kenya with bank-level security
                </p>
              </div>
              <div>
                <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Instant Processing</h3>
                <p className="text-gray-300 text-sm">
                  Payments confirmed in seconds, no waiting required
                </p>
              </div>
              <div>
                <Smartphone className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Mobile First</h3>
                <p className="text-gray-300 text-sm">
                  Pay from anywhere using just your phone number
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Rooms Button */}
      <div className="px-6 py-12 text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Rooms
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            M-Pesa is a registered trademark of Safaricom PLC. HotelBook is not affiliated with Safaricom.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HowMpesaWorks;