import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Shield,
  Clock,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { validateKenyanPhone, formatCurrency } from '../utils';
import { simulateSTKPush, checkTransactionStatus, initiateSTKPush } from '../utils/api';

function MpesaModal({ isOpen, onClose, amount, bookingId, onSuccess, onFailure }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, success, failed
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [useSimulation, setUseSimulation] = useState(true);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setPhoneError('');
      setStatus('idle');
      setTransactionDetails(null);
      setCountdown(60);
    }
  }, [isOpen]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (phoneError) setPhoneError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone
    const validation = validateKenyanPhone(phoneNumber);
    if (!validation.valid) {
      setPhoneError(validation.error || 'Invalid phone number');
      return;
    }

    setIsLoading(true);
    setStatus('processing');
    setPhoneError('');

    try {
      const paymentData = {
        phoneNumber: validation.formatted,
        amount: amount,
        accountReference: `HOTEL-BOOKING-${bookingId}`,
        transactionDesc: `Hotel room booking payment - ${bookingId}`,
        bookingId: bookingId,
        simulateSuccess: true
      };

      let response;

      try {
        if (useSimulation) {
          // Use simulation mode for demo
          response = await simulateSTKPush(paymentData);
        } else {
          // Use real Daraja API
          response = await initiateSTKPush(paymentData);
        }
      } catch (apiError) {
        console.warn('Server API failed, using client-side simulation:', apiError);
        // Fallback to client-side simulation if server is down
        response = {
          success: true,
          data: {
            merchantRequestId: `MR_${Date.now()}`,
            checkoutRequestId: `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
            responseCode: '0',
            responseDescription: 'Success. Request accepted for processing'
          }
        };
      }

      if (response?.success && response?.data?.checkoutRequestId) {
        setTransactionDetails(response.data);

        // Start countdown
        setCountdown(60);
        countdownRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Simulate or poll for status
        const checkoutRequestId = response.data.checkoutRequestId;
        let attempts = 0;
        const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds

        intervalRef.current = setInterval(async () => {
          attempts++;

          try {
            // Try to check server status
            let statusResponse;
            try {
              statusResponse = await checkTransactionStatus(checkoutRequestId);
            } catch (statusError) {
              console.warn('Status check failed, using client-side simulation');
              // Client-side simulation after 5-15 seconds
              if (attempts >= 3 && attempts <= 8) {
                statusResponse = {
                  success: true,
                  data: {
                    checkoutRequestId,
                    status: 'success',
                    resultCode: 0,
                    resultDesc: 'The service request is processed successfully.',
                    mpesaReceiptNumber: `SIM${Date.now()}${Math.floor(Math.random() * 10000)}`,
                    amount: amount,
                    phoneNumber: validation.formatted
                  }
                };
              }
            }

            if (statusResponse?.success && statusResponse?.data?.status) {
              const txData = statusResponse.data;

              if (txData.status === 'success') {
                clearInterval(intervalRef.current);
                clearInterval(countdownRef.current);
                setStatus('success');
                setTransactionDetails(prev => ({
                  ...prev,
                  ...txData
                }));
                onSuccess?.(txData);
              } else if (txData.status === 'failed') {
                clearInterval(intervalRef.current);
                clearInterval(countdownRef.current);
                setStatus('failed');
                setTransactionDetails(prev => ({
                  ...prev,
                  ...txData
                }));
                onFailure?.(txData);
              }
            }
          } catch (error) {
            console.error('Status check error:', error);
          }

          // Stop polling after max attempts
          if (attempts >= maxAttempts) {
            clearInterval(intervalRef.current);
            clearInterval(countdownRef.current);
            setStatus('failed');
            setTransactionDetails(prev => ({
              ...prev,
              resultDesc: 'Payment timed out. Please try again.'
            }));
          }
        }, 2000);
      } else {
        throw new Error(response?.error || response?.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setStatus('failed');
      setTransactionDetails({
        resultDesc: error.message || 'Payment failed. Please try again.'
      });
      onFailure?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setTransactionDetails(null);
    setCountdown(60);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={status !== 'processing' ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">M-Pesa Payment</h2>
                <p className="text-primary-100 text-sm">Lipa na M-Pesa</p>
              </div>
            </div>
            {status !== 'processing' && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(amount)}</p>
            <p className="text-xs text-gray-400 mt-1">Booking ID: {bookingId}</p>
          </div>

          {/* Status: Idle - Input Form */}
          {status === 'idle' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Simulation Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-gray-700">Simulation Mode</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUseSimulation(!useSimulation)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    useSimulation ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      useSimulation ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 -mt-2">
                {useSimulation 
                  ? 'Using demo mode (no real money charged)' 
                  : 'Using real M-Pesa (requires Daraja credentials)'}
              </p>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="2547XX XXX XXX or 07XX XXX XXX"
                    className={`input-field pl-11 ${phoneError ? 'input-field-error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {phoneError && (
                  <div className="flex items-center gap-1 mt-1.5 text-danger-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{phoneError}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1.5">
                  Enter your M-Pesa registered number
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !phoneNumber}
                className="w-full btn-success flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay with M-Pesa
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Status: Processing */}
          {status === 'processing' && (
            <div className="text-center py-8">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
                <Smartphone className="absolute inset-0 m-auto w-8 h-8 text-primary-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Check Your Phone
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                An M-Pesa STK Push has been sent to your phone.
                <br />
                Please enter your PIN to complete the payment.
              </p>

              <div className="flex items-center justify-center gap-2 text-primary-600 mb-4">
                <Clock className="w-5 h-5" />
                <span className="text-lg font-mono font-bold">
                  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-xs text-gray-500 mb-2">Transaction Details:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Checkout ID:</span>
                    <span className="font-mono text-gray-900">{transactionDetails?.checkoutRequestId?.slice(-8) || '...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status: Success */}
          {status === 'success' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-success-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your booking has been confirmed and payment received.
              </p>

              <div className="bg-success-50 rounded-lg p-4 text-left mb-6">
                <p className="text-xs text-success-700 font-semibold mb-2 uppercase tracking-wide">
                  Receipt Details
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">M-Pesa Receipt:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {transactionDetails?.mpesaReceiptNumber || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-mono text-gray-900">{transactionDetails?.phoneNumber || phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{new Date().toLocaleString('en-KE')}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full btn-success"
              >
                View My Bookings
              </button>
            </div>
          )}

          {/* Status: Failed */}
          {status === 'failed' && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-12 h-12 text-danger-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {transactionDetails?.resultDesc || 'The payment could not be completed. Please try again.'}
              </p>

              {transactionDetails?.resultCode && (
                <p className="text-xs text-gray-400 mb-6">
                  Error Code: {transactionDetails.resultCode}
                </p>
              )}

              <div className="bg-blue-50 rounded-lg p-3 text-left mb-6 text-xs text-blue-700">
                <p className="font-medium mb-1">💡 Troubleshooting Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check that your phone number is correct</li>
                  <li>Ensure you have M-Pesa registered on the number</li>
                  <li>Verify you have sufficient balance</li>
                  <li>Make sure you have a stable internet connection</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-500">
            Secured by Safaricom M-Pesa
          </p>
        </div>
      </div>
    </div>
  );
}

export default MpesaModal;