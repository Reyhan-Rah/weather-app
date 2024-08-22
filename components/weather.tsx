'use client';

import Image from 'next/image';
import { useWeatherData } from '@/hooks/useWeatherData';

interface Location {
  latitude: number;
  longitude: number;
}

export default function Weather({ location }: Location | null) {
  const { weather, errorMessage } = useWeatherData(location);

  if (!location) {
    return <div>No location available</div>;
  }

  return (
    <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
      {errorMessage ? (
        <div className='text-red-500'>
          <p>{errorMessage}</p>
        </div>
      ) : weather ? (
        <>
          <h2 className='mb-2 text-xl font-bold md:text-2xl'>
            {weather.city}, {weather.country}
          </h2>
          <p className='text-xl'>{weather.temperature}°C</p>
          <p className='text-lg capitalize'>{weather.description}</p>
          <Image
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt='Weather Icon'
            width={100}
            height={100}
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
        </>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}
