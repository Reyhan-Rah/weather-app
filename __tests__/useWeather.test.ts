import { renderHook, waitFor } from '@testing-library/react';
import { useWeather } from '@/hooks/useWeather';

const mockLocation = {
  latitude: 40.7128,
  longitude: -74.006,
};

const mockWeatherData = {
  main: {
    temp: 20,
    feels_like: 18,
    humidity: 50,
    pressure: 1012,
  },
  weather: [
    {
      description: 'clear sky',
      icon: '01d',
    },
  ],
  wind: {
    speed: 3,
    deg: 200,
  },
  sys: {
    country: 'US',
  },
  name: 'New York',
};

const mockForecastData = {
  list: [
    {
      dt: 1625241600,
      main: {
        temp_min: 18,
        temp_max: 25,
      },
      weather: [
        {
          description: 'clear sky',
          icon: '01d',
        },
      ],
    },
  ],
};

describe('useWeather hook', () => {
  beforeAll(() => {
    // Mock the entire navigator.geolocation object
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
    };
  });

  beforeEach(() => {
    // Mock the getCurrentPosition method to invoke success callback with mock location
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success) =>
        success({
          coords: {
            latitude: mockLocation.latitude,
            longitude: mockLocation.longitude,
          },
        })
    );

    // Mock the fetch function to return mock weather and forecast data
    global.fetch = jest.fn((url) => {
      if (url.includes('forecast')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockForecastData),
        });
      } else if (url.includes('weather')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWeatherData),
        });
      }
      return Promise.reject(new Error('Invalid API call'));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches weather data successfully', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.weather).not.toBeNull());

    expect(result.current.weather?.temperature).toBe(mockWeatherData.main.temp);
    expect(result.current.errorMessage).toBeNull();
  });

  it('fetches forecast data successfully', async () => {
    const { result } = renderHook(() => useWeather());

    await waitFor(() =>
      expect(result.current.forecast.length).toBeGreaterThan(0)
    );

    expect(result.current.forecast[0].minTemp).toBe(
      mockForecastData.list[0].main.temp_min
    );
    expect(result.current.forecast[0].maxTemp).toBe(
      mockForecastData.list[0].main.temp_max
    );
    expect(result.current.errorMessage).toBeNull();
  });

  it('handles fetch error properly', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('API error'))
    ) as jest.Mock;

    const { result } = renderHook(() => useWeather());

    await waitFor(() => expect(result.current.errorMessage).not.toBeNull());

    expect(result.current.weather).toBeNull();
    expect(result.current.forecast.length).toBe(0);
    expect(result.current.errorMessage).toBe('API error');
  });
});
