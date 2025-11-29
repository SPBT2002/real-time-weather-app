import React from 'react';
import './WeatherCard.css';
import compassIcon from '../../assets/icons/compass.png';

const WeatherCard = ({ city, country, date, temp, tempMin, tempMax, description, icon, pressure, humidity, visibility, sunrise, sunset, wind, cardColor, onClick, comfortScore, rank }) => {
    

    const getComfortLevel = (score) => {
        if (score >= 80) return { text: 'Excellent', color: '#10b981' };
        if (score >= 65) return { text: 'Good', color: '#3b82f6' };
        if (score >= 50) return { text: 'Moderate', color: '#cf9b20ff' };
        if (score >= 35) return { text: 'Fair', color: '#bf44efff' };
        return { text: 'Poor', color: '#ec2828ff' };
    };

    const comfortLevel = comfortScore ? getComfortLevel(comfortScore) : null;

    return (
        <div
            className={`weather-card ${cardColor} ${onClick ? 'is-clickable' : ''}`}
            onClick={onClick}
        >   
            {rank && (
                <div className="rank-badge">
                    <span className="rank-number">#{rank}</span>
                </div>
            )}

            <div className="card-top">
                <div className="card-header">
                    <h3 className="city-name">{city}, {country}</h3>
                    <p className="date">{date}</p>
                </div>
                
                <div className="card-content">
                    <div className="left-section">
                        <div className="main-temp">{temp}°c</div>
                        {comfortScore && (
                            <div className="comfort-score-section">
                                <div className="comfort-score-value" style={{ color: comfortLevel.color }}>
                                    {comfortScore}
                                </div>
                                <div className="comfort-score-label" style={{ color: comfortLevel.color }}>
                                    {comfortLevel.text}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="right-section">
                        <div className="weather-info">
                            <span className="weather-icon-text">
                                <img src={icon} alt={description} className="weather-icon-img" />
                                {description}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-row">
                    <span>Pressure: {pressure}hPa</span>
                    <span>Sunrise: {sunrise}</span>
                </div>
                <div className="detail-row">
                    <span>Humidity: {humidity}%</span>
                    <span>Sunset: {sunset}</span>
                </div>
                <div className="detail-row">
                    <span>Visibility: {visibility}km</span>
                    <span>Wind Speed: {wind}</span>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
