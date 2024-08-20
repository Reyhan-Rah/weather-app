'use client';

import Weather from './components/weather';
import Forecast from './components/forecast';
import { useWeather } from './hooks/useWeather';

export default function Home() {
  const { weather, forecast, errorMessage } = useWeather();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center overflow-y-scroll bg-blue-50 p-4'>
      <h1 className='mb-8 text-2xl font-bold md:text-4xl'>Weather App</h1>
        {errorMessage ? (
            <div className="text-red-500">
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
