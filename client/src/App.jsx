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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  const checkServerWithRetry = async () => {
    const maxRetries = 30; // 30 seconds (1 attempt per second)
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.get(`${API_BASE_URL}/ping`, { 
          timeout: 3000 // 3 second timeout per request
        });
        
        if (response.status === 200) {
          return { success: true };
        }
      } catch (error) {
        console.log(`Ping attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        // If it's the last attempt, return error
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: 'Server failed to start after 30 seconds. Please check if the server is running.' 
          };
        }
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    return { success: false, error: 'Max retries reached' };
  };

  const handleEnterDashboard = async () => {
    setIsCheckingServer(true);
    setServerError(null);

    const result = await checkServerWithRetry();

    if (result.success) {
      // Server is ready, navigate to dashboard
      setTimeout(() => {
        setIsCheckingServer(false);
        navigate('/dashboard');
      }, 500); // Small delay for smooth transition
    } else {
      // Server failed to start
      setServerError(result.error);
      setIsCheckingServer(false);
    }
  };

  const handleRetry = () => {
    setServerError(null);
    handleEnterDashboard();
  };

  const handleCancel = () => {
    setIsCheckingServer(false);
    setServerError(null);
  };

  return (
    <>
      <LandingPage onEnterDashboard={handleEnterDashboard} />
      <ServerLoadingModal 
        isOpen={isCheckingServer}
        error={serverError}
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
