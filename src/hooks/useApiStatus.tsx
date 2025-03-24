
import { useState, useCallback } from 'react';

export const useApiStatus = () => {
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  
  const checkApiStatus = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/`, { 
        method: 'GET',
        // Adding a timeout to prevent long hangs
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setIsApiAvailable(true);
        console.log('Backend API is available');
      } else {
        setIsApiAvailable(false);
        console.log('Backend API returned error:', response.status);
      }
    } catch (error) {
      setIsApiAvailable(false);
      console.log('Backend API is not available:', error);
    }
  }, []);
  
  return { isApiAvailable, checkApiStatus };
};
