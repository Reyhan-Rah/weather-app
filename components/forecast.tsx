'use client';

import Image from 'next/image';
import { useForecastData } from '@/hooks/useForecastData';

interface Location {
  latitude: number;
  longitude: number;
}

export default function Forecast({ location }: { location: Location | null }) {
  const { forecast, errorMessage } = useForecastData(location);

  if (!location) {
    return <div>No location available</div>;
  }

  return (
    <div className='mt-8'>
      {errorMessage ? (
        <div className='text-red-500'>
          <p>{errorMessage}</p>
        </div>
      ) : forecast.length > 0 ? (
        <>
          <h3 className='mb-4 text-xl font-bold'>6-Day Forecast</h3>
          <div className='grid grid-cols-3 gap-2 md:gap-4'>
            {forecast.map((day, index) => (
              <div key={index} className='rounded-lg bg-gray-100 p-2 md:p-4'>
                <h4 className='text-sm font-bold md:text-base'>{day.date}</h4>
                <Image
                  src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt='Weather Icon'
                  width={50}
                  height={50}
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
        </>
      ) : (
        <p>Loading forecast data...</p>
      )}
    </div>
  );
}
