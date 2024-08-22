import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useForecastData } from '@/hooks/useForecastData';
import { useLocation } from '@/hooks/useLocation';

// Mock the useWeather hook
jest.mock('../hooks/useWeatherData');
jest.mock('../hooks/useForecastData');
jest.mock('../hooks/useLocation');

describe('Home component', () => {
  beforeEach(() => {
    // Clear all instances and calls to the mock before each test
    jest.clearAllMocks();
  });

  test('renders weather and forecast data correctly', () => {
    // Define the mock implementation for the first test
    useLocation.mockImplementation(() => ({
      location: {
        latitude: 51.50853,
        longitude: -0.12574,
      },

      errorMessage: null,
    }));
    useWeatherData.mockImplementation(() => ({
      weather: {
        temperature: 15,
        feels_like: 13,
        humidity: 80,
        pressure: 1012,
        wind_speed: 5,
        wind_deg: 200,
        description: 'clear sky',
        city: 'London',
        country: 'GB',
        icon: '01d',
      },
      errorMessage: null,
    }));
    useForecastData.mockImplementation(() => ({
      forecast: [
        {
          date: 'Monday, 21 March',
          minTemp: 10,
          maxTemp: 20,
          description: 'clear sky',
          icon: '01d',
        },
      ],
      errorMessage: null,
    }));

    render(<Home />);

    expect(screen.getByText('London, GB')).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getAllByText('clear sky')[0]).toBeInTheDocument();
    expect(screen.getByText('13°C')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('1012 hPa')).toBeInTheDocument();
    expect(screen.getByText('5 m/s')).toBeInTheDocument();
    expect(screen.getByText('Monday, 21 March')).toBeInTheDocument();
  });

  test('renders error message when there is an error', () => {
    useLocation.mockImplementation(() => ({
      location: {
        latitude: 51.50853,
        longitude: -0.12574,
      },
      errorMessage: null,
    }));
    useWeatherData.mockImplementation(() => ({
      weather: null,
      errorMessage: 'Failed to fetch weather data.',
    }));
    useForecastData.mockImplementation(() => ({
      forecast: [],
      errorMessage: 'Failed to fetch forecast data.',
    }));
    render(<Home />);

    expect(
      screen.getByText('Failed to fetch weather data.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Failed to fetch forecast data.')
    ).toBeInTheDocument();
  });
});
