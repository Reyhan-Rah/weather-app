'use client';

import Weather from '../components/weather';
import Forecast from '../components/forecast';
import { useWeather } from '../hooks/useWeather';

export default function Home() {
  const { weather, forecast, errorMessage } = useWeather();

  const handleClose = () => {
    if (weather) {
      const weatherData = {
        temperature: weather.temperature,
        feels_like: weather.feels_like,
        humidity: weather.humidity,
        pressure: weather.pressure,
        wind_speed: weather.wind_speed,
        wind_deg: weather.wind_deg,
        description: weather.description,
        city: weather.city,
        country: weather.country,
        icon: weather.icon,
        lastUpdated: new Date().toISOString(),
      };

      // Send the weather data and last updated time to the parent window
      window.parent.postMessage(weatherData, '*');

      // Navigate away (set iframe src to a blank page)
      window.parent.postMessage({ action: 'navigateAway' }, '*');
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center overflow-y-scroll bg-blue-50 p-4'>
      <button className={'absolute right-2 top-2'} onClick={handleClose}>
        Close
      </button>
      <h1 className='mb-8 mt-8 text-2xl font-bold md:text-4xl'>Weather App</h1>
      {errorMessage ? (
        <div className='text-red-500'>
          <p>{errorMessage}</p>
        </div>
      ) : weather ? (
        <>
          <Weather weather={weather} />
          <Forecast forecast={forecast} />
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}
