import { render, screen } from '@testing-library/react';
import Home from '../app/page';

jest.mock('../hooks/useWeather', () => ({
    useWeather: () => ({
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
    }),
}));

describe('Home component', () => {
    test('renders weather and forecast data correctly', () => {
        render(<Home />);

        expect(screen.getByText('London, GB')).toBeInTheDocument();
        expect(screen.getByText('15°C')).toBeInTheDocument();
        expect(screen.getAllByText('clear sky')[0]).toBeInTheDocument();
        //Feels like:
        expect(screen.getByText('13°C')).toBeInTheDocument();
        //Humidity:
        expect(screen.getByText('80%')).toBeInTheDocument();
        //Pressure:
        expect(screen.getByText('1012 hPa')).toBeInTheDocument();
        //Wind Speed:
        expect(screen.getByText('5 m/s')).toBeInTheDocument();
        expect(screen.getByText('Monday, 21 March')).toBeInTheDocument();
    });
});
