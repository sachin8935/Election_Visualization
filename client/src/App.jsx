import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ServerLoadingModal from './components/ServerLoadingModal';
import axios from 'axios';

function LandingPageWrapper() {
  const navigate = useNavigate();
  const [isCheckingServer, setIsCheckingServer] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  // Initial ping on landing page load (silent warm-up)
  useEffect(() => {
    const initialPing = async () => {
      try {
        await axios.get(`${API_BASE_URL}/ping`, { timeout: 3000 });
        console.log('✅ Server is already active');
      } catch (error) {
        console.log('⏳ Server warming up in background...');
      }
    };
    
    initialPing();
  }, [API_BASE_URL]);

  const checkServerWithRetry = async () => {
    const maxRetries = 6; // 6 attempts over 30 seconds
    const retryDelay = 5000; // 5 seconds between attempts

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(`${API_BASE_URL}/ping`, { 
          timeout: 3000 // 3 second timeout per request
        });
        
        if (response.status === 200) {
          console.log(`✅ Server responded on attempt ${attempt}`);
          return { success: true };
        }
      } catch (error) {
        console.log(`⏳ Ping attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        // If it's the last attempt, return error
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: 'Unable to reach server. Please try again or contact support.' 
          };
        }
        
        // Wait before next retry (5 seconds)
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    return { success: false, error: 'Max retries reached' };
  };

  const handleEnterDashboard = async () => {
    setIsCheckingServer(true);
    setServerError(null);
    setShowContactModal(false);

    const result = await checkServerWithRetry();

    if (result.success) {
      // Server is ready, navigate to dashboard
      setTimeout(() => {
        setIsCheckingServer(false);
        navigate('/dashboard');
      }, 500); // Small delay for smooth transition
    } else {
      // Server failed to start - show contact modal
      // Keep isCheckingServer TRUE so modal stays open!
      setServerError(result.error);
      setShowContactModal(true);
      // DON'T close the modal - we need it to show the contact info
    }
  };

  const handleRetry = () => {
    setServerError(null);
    setShowContactModal(false);
    handleEnterDashboard();
  };

  const handleCancel = () => {
    setIsCheckingServer(false);
    setServerError(null);
    setShowContactModal(false);
  };

  return (
    <>
      <LandingPage onEnterDashboard={handleEnterDashboard} />
      <ServerLoadingModal 
        isOpen={isCheckingServer}
        error={serverError}
        showContactModal={showContactModal}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
