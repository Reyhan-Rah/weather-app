'use client'

import { useEffect, useState } from 'react';

const API_KEY= '8de104c15991da954068aab4ef638c95';

interface WeatherData {
    temperature: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    description: string;
    city: string;
    country: string;
    icon: string;
}

interface ForecastData {
    date: string;
    temperature: number;
    description: string;
    icon: string;
}

export default function Home() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        if (location) {
            const fetchWeatherAndForecast = async () => {
                const response = await fetch(
                    `https://api.openweathermap.org/data/3.0/onecall?lat=${location.latitude}&lon=${location.longitude}&units=metric&exclude=minutely,hourly&appid=${API_KEY}`
                );
                const data = await response.json();
                console.log(response)
                // Current Weather Data
                setWeather({
                    temperature: data.current.temp,
                    feels_like: data.current.feels_like,
                    humidity: data.current.humidity,
                    pressure: data.current.pressure,
                    wind_speed: data.current.wind_speed,
                    wind_deg: data.current.wind_deg,
                    description: data.current.weather[0].description,
                    city: data.timezone, // Timezone can be used for city name approximation
                    country: '', // Not directly provided by One Call API
                    icon: data.current.weather[0].icon,
                });

                // Forecast Data
                const dailyForecast = data.daily.slice(1, 4).map((day: any) => ({
                    date: new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' }),
                    temperature: day.temp.day,
                    description: day.weather[0].description,
                    icon: day.weather[0].icon,
                }));

                setForecast(dailyForecast);
            };
            fetchWeatherAndForecast();
        }
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
            <h1 className="text-4xl font-bold mb-8">Weather App</h1>
            {weather ? (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-2">{weather.city}</h2>
                    <p className="text-xl">{weather.temperature}°C</p>
                    <p className="text-lg capitalize">{weather.description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="Weather Icon"
                        className="mx-auto mb-4"
                    />
                    <div className="text-left">
                        <p><strong>Feels like:</strong> {weather.feels_like}°C</p>
                        <p><strong>Humidity:</strong> {weather.humidity}%</p>
                        <p><strong>Pressure:</strong> {weather.pressure} hPa</p>
                        <p><strong>Wind Speed:</strong> {weather.wind_speed} m/s</p>
                        <p><strong>Wind Direction:</strong> {weather.wind_deg}°</p>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">3-Day Forecast</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {forecast.map((day, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                    <h4 className="font-bold">{day.date}</h4>
                                    <img
                                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                        alt="Weather Icon"
                                        className="mx-auto mb-2"
                                    />
                                    <p>{day.temperature}°C</p>
                                    <p className="capitalize">{day.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
}


