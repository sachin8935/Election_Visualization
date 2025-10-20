import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, X, Mail, MessageCircle } from 'lucide-react';

export default function ServerLoadingModal({ isOpen, error, showContactModal, onRetry, onCancel }) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || error) {
      setProgress(0);
      return;
    }

    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // Animate progress bar (30 seconds total)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 6); // Increment to fill in 30 seconds (6 attempts x 5 seconds)
      });
    }, 5000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, error]);

  if (!isOpen) return null;

  // Contact information
  const whatsappNumber = "918935904820"; // WhatsApp number with country code (91 for India)
  const email = "sachin89359@gmail.com"; // Your email
  const whatsappMessage = encodeURIComponent("Hi! I'm experiencing issues accessing the Election Dashboard. Please help!");
  const emailSubject = encodeURIComponent("Election Dashboard - Server Issue");
  const emailBody = encodeURIComponent("Hi,\n\nI'm unable to access the Election Dashboard. The server is not responding after multiple attempts.\n\nPlease look into this.\n\nThanks!");

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${email}?subject=${emailSubject}&body=${emailBody}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
        {!error ? (
          // Loading State
          <>
            <div className="flex flex-col items-center">
              {/* Animated Logo/Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-green-600 rounded-full opacity-20 animate-ping"></div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Starting Server{dots}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center mb-6">
                Please wait while we wake up the server. 
                <br />
                <span className="text-sm text-gray-500">
                  (Cold start in progress - checking every 5 seconds)
                </span>
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-green-600 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Time estimate */}
              <p className="text-sm text-gray-500">
                This may take up to 30 seconds...
              </p>
            </div>
          </>
        ) : showContactModal ? (
          // Contact Modal - Shown when all retries fail
          <>
            <div className="flex flex-col items-center">
              {/* Sad Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                This is Unfortunate 😔
              </h3>

              {/* Error Message */}
              <p className="text-gray-600 text-center mb-6">
                We couldn't connect to the server despite multiple attempts. 
                <br />
                <span className="text-sm text-gray-500 mt-2 block">
                  Don't worry! I'll fix this instantly.
                </span>
              </p>

              {/* Contact Buttons */}
              <div className="w-full space-y-3 mb-6">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Ping me on WhatsApp</span>
                </button>

                <button
                  onClick={handleEmailClick}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send me an Email</span>
                </button>
              </div>

              {/* Retry Option */}
              <div className="w-full border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500 text-center mb-3">
                  Or try again:
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={onRetry}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Connection
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Error State (without contact modal)
          <>
            <div className="flex flex-col items-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Connection Failed
              </h3>

              {/* Error Message */}
              <p className="text-gray-600 text-center mb-6">
                {error}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 mt-4 text-center">
                Make sure the backend server is running
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
