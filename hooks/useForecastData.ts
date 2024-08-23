import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

interface ForecastData {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}
interface ForecastListData {
  main: {
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  dt: number;
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
}

export function useForecastData(
  location: { latitude: number; longitude: number } | null
) {
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      const fetchForecast = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
          );

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }

          const data = await response.json();

          const dailyForecast: { [key: string]: ForecastData } = {};

          data?.list?.forEach((item: ForecastListData) => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
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

          setForecast(Object.values(dailyForecast).slice(0, 6));
        } catch (error: any) {
          console.error('Failed to fetch forecast data:', error);
          setErrorMessage(error.message || 'Failed to fetch forecast data.');
          setForecast([]);
        }
      };

      fetchForecast();
    }
  }, [location]);

  return { forecast, errorMessage };
}
