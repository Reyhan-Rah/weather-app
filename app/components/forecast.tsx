'use client';

import Image from 'next/image';

interface ForecastData {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
}

interface ForecastProps {
  forecast: ForecastData[];
}

export default function Forecast({ forecast }: ForecastProps) {
  return (
    <div className='mt-8'>
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
            <p className='text-sm capitalize md:text-base'>{day.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
