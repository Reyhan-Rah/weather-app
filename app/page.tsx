'use client';

import Weather from '../components/weather';
import Forecast from '../components/forecast';
import { useLocation } from '@/hooks/useLocation';
import { useWeatherData } from '@/hooks/useWeatherData';

export default function Home() {
  const { location, errorMessage } = useLocation();
  const { weather } = useWeatherData(location);

  const handleClose = () => {
    if (weather) {
      const weatherData = {
        ...weather,
        lastUpdated: new Date().toISOString(),
      };

      // Send the weather data and last updated time to the parent window
      window.parent.postMessage(weatherData, '*');

      // Navigate away (set iframe src to a blank page)
      window.parent.postMessage({ action: 'navigateAway' }, '*');
    }
    // Navigate away (set iframe src to a blank page)
    window.parent.postMessage({ action: 'navigateAway' }, '*');
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
      ) : !location ? (
        <p>Loading ...</p>
      ) : (
        <>
          <Weather location={location} />
          <Forecast location={location} />
        </>
      )}
    </div>
  );
}
