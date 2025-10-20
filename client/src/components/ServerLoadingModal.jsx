import { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, X } from 'lucide-react';

export default function ServerLoadingModal({ isOpen, error, onRetry, onCancel }) {
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
        return prev + (100 / 30); // Increment to fill in 30 seconds
      });
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, [isOpen, error]);

  if (!isOpen) return null;

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
                  (Free tier requires a cold start)
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
        ) : (
          // Error State
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
                Make sure the backend server is running on localhost:4000
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
