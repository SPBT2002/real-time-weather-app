import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WeatherCard from '../WeatherCard/WeatherCard';
import './Dashboard.css';

// Import weather icons
import clearIcon from '../../assets/icons/clear.png';
import cloudIcon from '../../assets/icons/cloud.png';
import mistIcon from '../../assets/icons/mist.png';
import rainIcon from '../../assets/icons/rain.png';
import snowIcon from '../../assets/icons/snow.png';
import weatherIcon from '../../assets/icons/weather.png';

const Dashboard = () => {
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [selected, setSelected] = useState(null);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            navigate('/login');
        }
    };

    //pick icon based on condition
    const getWeatherIcon = (condition) => {
        if (!condition) return weatherIcon;
        const lower = condition.toLowerCase();
        if (lower.includes('cloud')) return cloudIcon;
        if (lower.includes('rain')) return rainIcon;
        if (lower.includes('clear')) return clearIcon;
        if (lower.includes('mist')) return mistIcon;
        if (lower.includes('snow')) return snowIcon;
        return weatherIcon;
    };

    //assign color per card
    const getCardColor = (index) => {
        const colors = ['card-blue', 'card-purple', 'card-green', 'card-orange', 'card-red'];
        return colors[index % colors.length];
    };

    //convert kelvin to celsius
    const kelvinToCelsius = (kelvin) => {
        return (kelvin - 273.15).toFixed(1);
    };

    //Fetch weather data from backend
    const fetchWeatherData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/weather', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const weatherList = response.data.map((w, index) => ({
                id: index + 1,
                city: w.city,
                country: w.country || '',
                temp: kelvinToCelsius(w.temperature), 
                tempMin: w.tempMin ? kelvinToCelsius(w.tempMin) : null,
                tempMax: w.tempMax ? kelvinToCelsius(w.tempMax) : null,
                description: w.condition,
                icon: getWeatherIcon(w.condition),
                cardColor: getCardColor(index),
                pressure: w.pressure ?? 'N/A',
                humidity: w.humidity ?? 'N/A',
                visibility: w.visibility ?? 'N/A',
                sunrise: w.sunrise ?? 'N/A',
                sunset: w.sunset ?? 'N/A',
                wind: w.wind ?? 'N/A',
                comfortScore: w.comfortScore,
                rank: w.rank
            }));
            setCities(weatherList);
            setLastUpdated(new Date().toLocaleTimeString());
            setError(null);
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError('Unable to load weather data');
        } finally {
            setLoading(false);
        }
    };

    //Fetch immediately + every 5 minutes
    useEffect(() => {
        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 300000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-left">
                    <div className="app-title">
                        <img src={weatherIcon} alt="Weather App" className="app-weather-icon" />
                        <h1>Real-Time Weather App</h1>
                    </div>
                    {lastUpdated && <p className="update-time">Last Updated: {lastUpdated}</p>}
                </div>
                <div className="header-right">
                    <button 
                        className="logout-btn" 
                        onClick={handleLogout}
                    >
                         Log Out ➜]
                    </button>
                </div>
            </div>

            {!loading && !error && cities.length > 0 && (
                <div className="comfort-ranking-header">
                    <h2>Cities Ranked by Comfort Index  ☑</h2>
                    <p className="ranking-description">
                        Comfort score calculated based on: Temperature (50%) • Humidity (30%) • Wind Speed (20%)
                    </p>
                </div>
            )}

            {loading && <p>Loading weather data...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="weather-grid">
                {!loading && !error && cities.map(weather => (
                    <WeatherCard
                        key={weather.id}
                        city={weather.city}
                        country={weather.country}
                        temp={weather.temp}
                        tempMin={weather.tempMin}
                        tempMax={weather.tempMax}
                        description={weather.description}
                        icon={weather.icon}
                        pressure={weather.pressure}
                        humidity={weather.humidity}
                        visibility={weather.visibility}
                        sunrise={weather.sunrise}
                        sunset={weather.sunset}
                        wind={weather.wind}
                        cardColor={weather.cardColor}
                        comfortScore={weather.comfortScore}
                        rank={weather.rank}
                        onClick={() => setSelected(weather)}
                    />
                ))}
            </div>

            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-back-btn" 
                            onClick={() => setSelected(null)}
                            aria-label="Go back"
                        >
                            ↩
                        </button>
                        <WeatherCard
                            city={selected.city}
                            country={selected.country}
                            temp={selected.temp}
                            tempMin={selected.tempMin}
                            tempMax={selected.tempMax}
                            description={selected.description}
                            icon={selected.icon}
                            pressure={selected.pressure}
                            humidity={selected.humidity}
                            visibility={selected.visibility}
                            sunrise={selected.sunrise}
                            sunset={selected.sunset}
                            wind={selected.wind}
                            cardColor={selected.cardColor}
                            comfortScore={selected.comfortScore}
                            rank={selected.rank}
                        />
                    </div>
                </div>
            )}

            <footer className="dashboard-footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <img src={weatherIcon} alt="Weather" className="footer-icon" />
                        <div className="footer-text">
                            <h3>Weather App</h3>
                            <p>Stay updated with real-time weather</p>
                        </div>
                    </div>
                    <div className="footer-right">
                        <p className="footer-credit">Created by <span>Supun Piyumal</span></p>
                        <p className="footer-year">© {new Date().getFullYear()} All rights reserved</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
