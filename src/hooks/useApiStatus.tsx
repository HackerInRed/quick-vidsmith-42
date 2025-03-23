
import { useState, useCallback, useEffect } from 'react';

export const useApiStatus = () => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkApiStatus = useCallback(async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/`, { 
        method: 'GET',
        // Adding a timeout to prevent long hangs
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setIsApiAvailable(true);
        console.log('Backend API is available at:', apiUrl);
      } else {
        setIsApiAvailable(false);
        console.log('Backend API returned error:', response.status);
      }
    } catch (error) {
      setIsApiAvailable(false);
      console.log('Backend API is not available:', error);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);
  
  // Check on mount and periodically
  useEffect(() => {
    checkApiStatus();
    
    // Set up periodic check (every 30 seconds)
    const interval = setInterval(() => {
      checkApiStatus();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [checkApiStatus]);
  
  return { isApiAvailable, checkApiStatus };
};
