import { useEffect, useState } from 'react';

const API_KEY = '8de104c15991da954068aab4ef638c95';

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

interface ForecastData {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}

export function useWeather() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);

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
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    if (location) {
      const fetchWeather = async () => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
        );
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
      };

      const fetchForecast = async () => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
        );
        const data = await response.json();

        // Group the forecast data by day
        const dailyForecast: { [key: string]: ForecastData } = {};

        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          });
          if (!dailyForecast[date]) {
            dailyForecast[date] = {
              date,
              minTemp: item.main.temp_min,
              maxTemp: item.main.temp_max,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            };
          } else {
            dailyForecast[date].minTemp = Math.min(
              dailyForecast[date].minTemp,
              item.main.temp_min
            );
            dailyForecast[date].maxTemp = Math.max(
              dailyForecast[date].maxTemp,
              item.main.temp_max
            );
          }
        });

        // Convert the object to an array and limit to 6 days
        setForecast(Object.values(dailyForecast).slice(0, 6));
      };

      fetchWeather();
      fetchForecast();
    }
  }, [location]);

  return { weather, forecast };
}
