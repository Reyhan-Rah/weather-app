import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: Location | null;
  errorMessage: string | null;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setErrorMessage('Error getting location.');
          console.error('Error getting location:', error);
        }
      );
    } else {
      setErrorMessage('Geolocation is not supported by this browser.');
    }
  }, []);

  return { location, errorMessage };
}
