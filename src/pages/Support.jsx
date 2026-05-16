import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, Send, HelpCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I cancel a booking?',
      answer: 'You can cancel your booking up to 24 hours before check-in through your booking dashboard. Go to "My Bookings", select the booking you want to cancel, and click "Cancel Booking". Cancellations within 24 hours may incur a fee.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed through M-Pesa\'s secure platform with bank-level encryption. We never store your payment information on our servers. Your M-Pesa PIN and transaction details are handled directly by Safaricom\'s secure systems.'
    },
    {
      question: 'How do I modify my booking?',
      answer: 'Booking modifications can be made through your booking dashboard. Contact our support team at least 48 hours before check-in for date changes, room upgrades, or other modifications. Some changes may incur additional fees.'
    },
    {
      question: 'What is the cancellation policy?',
      answer: 'Free cancellation up to 24 hours before check-in. Cancellations within 24 hours are charged 50% of the booking amount. No-shows are charged the full amount. Refunds are processed within 5-7 business days.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team via email at support@hotelbook.co.ke or by phone at +254 708 319 101. We\'re available Monday to Friday, 9 AM to 6 PM EAT, and respond to emails within 24 hours.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-green-500">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Support Center</h1>
            <p className="text-gray-300">Get help with your bookings and questions</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="flex justify-start my-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Contact Us</h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Please describe your question or issue..."
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Direct Contact */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Direct Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email Support</p>
                <p className="text-white font-medium">support@hotelbook.co.ke</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Phone Support</p>
                <p className="text-white font-medium">+254 708 319 101</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Available Monday to Friday, 9 AM to 6 PM EAT
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Support;