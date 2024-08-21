import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { useWeather } from '../hooks/useWeather';

// Mock the useWeather hook
jest.mock('../hooks/useWeather');

describe('Home component', () => {
  beforeEach(() => {
    // Clear all instances and calls to the mock before each test
    jest.clearAllMocks();
  });

  test('renders weather and forecast data correctly', () => {
    // Define the mock implementation for the first test
    useWeather.mockImplementation(() => ({
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
    useWeather.mockImplementation(() => ({
      weather: null,
      forecast: [],
      errorMessage: 'Failed to fetch weather data.',
    }));

    render(<Home />);

    expect(
      screen.getByText('Failed to fetch weather data.')
    ).toBeInTheDocument();
  });
});
