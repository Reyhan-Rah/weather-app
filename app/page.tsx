'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";

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

export default function Home() {
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

  return (
    <div className='flex min-h-screen flex-col items-center justify-center overflow-y-scroll bg-blue-50 p-4'>
      <h1 className='mb-8 text-2xl font-bold md:text-4xl'>Weather App</h1>
      {weather ? (
        <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
          <h2 className='mb-2 text-xl font-bold md:text-2xl'>
            {weather.city}, {weather.country}
          </h2>
          <p className='text-xl'>{weather.temperature}°C</p>
          <p className='text-lg capitalize'>{weather.description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt='Weather Icon'
            className='mx-auto mb-4'
          />
          <div className='text-left'>
            <p>
              <strong>Feels like:</strong> {weather.feels_like}°C
            </p>
            <p>
              <strong>Humidity:</strong> {weather.humidity}%
            </p>
            <p>
              <strong>Pressure:</strong> {weather.pressure} hPa
            </p>
            <p>
              <strong>Wind Speed:</strong> {weather.wind_speed} m/s
            </p>
            <p>
              <strong>Wind Direction:</strong> {weather.wind_deg}°
            </p>
          </div>
          <div className='mt-8'>
            <h3 className='mb-4 text-xl font-bold'>6-Day Forecast</h3>
            <div className='grid grid-cols-3 gap-2 md:gap-4'>
              {forecast.map((day, index) => (
                <div key={index} className='rounded-lg bg-gray-100 p-2 md:p-4'>
                  <h4 className='text-sm font-bold md:text-base'>{day.date}</h4>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt='Weather Icon'
                    className='mx-auto mb-2'
                  />
                  <p className='text-sm md:text-lg'>
                    {day.minTemp}°C - {day.maxTemp}°C
                  </p>
                  <p className='text-sm capitalize md:text-base'>
                    {day.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}
