'use client'

import { useEffect, useState } from 'react';

interface WeatherData {
    temperature: number;
    description: string;
    city: string;
    country: string;
    icon: string;
}

const API_KEY= '8de104c15991da954068aab4ef638c95';

export default function Home() {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);

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
            const fetchWeather = async () => {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
                );
                const data = await response.json();
                console.log({data})
                setWeather({
                    temperature: data.main.temp,
                    description: data.weather[0].description,
                    city: data.name,
                    country: data.sys.country,
                    icon: data.weather[0].icon,
                });
            };
            fetchWeather();
        }
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <h1 className="text-4xl font-bold mb-8">Weather App</h1>
            {weather ? (
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-2">{weather.city}, {weather.country}</h2>
                    <p className="text-xl">{weather.temperature}°C</p>
                    <p className="text-lg capitalize">{weather.description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="Weather Icon"
                        className="mx-auto"
                    />
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
}
