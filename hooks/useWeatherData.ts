import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  description: string;
  city: string;
  country: string;
  icon: string;
}

export function useWeatherData(
  location: { latitude: number; longitude: number } | null
) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
          );

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }

          const data = await response.json();

          setWeather({
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            wind_deg: data.wind.deg,
            description: data.weather[0].description,
            city: data.name,
            country: data.sys.country,
            icon: data.weather[0].icon,
          });
        } catch (error: any) {
          console.error('Failed to fetch weather data:', error);
          setErrorMessage(error.message || 'Failed to fetch weather data.');
          setWeather(null);
        }
      };

      fetchWeather();
    }
  }, [location]);

  return { weather, errorMessage };
}
