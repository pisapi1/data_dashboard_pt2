import { useState, useEffect } from 'react'
import Statistics from './Statistics'
import Chart from './Chart'
import './WeatherDetail.css'

const WeatherDetail = ({ cityData, allData, onBackToDashboard }) => {
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper functions
  const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32)
  
  const getWeatherIcon = (iconCode) => {
    return `https://www.weatherbit.io/static/img/icons/${iconCode}.png`
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    return directions[Math.round(degrees / 22.5) % 16]
  }

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: '#4CAF50' }
    if (aqi <= 100) return { level: 'Moderate', color: '#FFC107' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF9800' }
    if (aqi <= 200) return { level: 'Unhealthy', color: '#F44336' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#9C27B0' }
    return { level: 'Hazardous', color: '#8B0000' }
  }

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: 'Low', color: '#4CAF50' }
    if (uv <= 5) return { level: 'Moderate', color: '#FFC107' }
    if (uv <= 7) return { level: 'High', color: '#FF9800' }
    if (uv <= 10) return { level: 'Very High', color: '#F44336' }
    return { level: 'Extreme', color: '#9C27B0' }
  }

  useEffect(() => {
    // Simulate loading for additional data
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [cityData])

  if (!cityData) return null

  const aqiInfo = getAQILevel(cityData.aqi)
  const uvInfo = getUVLevel(cityData.uv)

  return (
    <div className="weather-detail">
      {/* Navigation */}
      <div className="detail-nav">
        <button onClick={onBackToDashboard} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="breadcrumb">
          <span onClick={onBackToDashboard} style={{cursor: 'pointer'}}>Dashboard</span> 
          <span className="separator">/</span> 
          <span>{cityData.cityDisplayName}</span>
        </div>
      </div>

      {/* Statistics Overview (same as dashboard) */}
      {allData && <Statistics data={allData} />}

      <div className="detail-content">
        {/* City Header */}
        <div className="city-header">
          <div className="city-main-info">
            <h1>{cityData.cityDisplayName}</h1>
            <div className="current-weather">
              <img 
                src={getWeatherIcon(cityData.weather.icon)} 
                alt={cityData.weather.description}
                className="weather-icon-large"
              />
              <div className="temperature-large">
                <span className="temp-main">{Math.round(cityData.temp)}°C</span>
                <span className="temp-secondary">({celsiusToFahrenheit(cityData.temp)}°F)</span>
                <div className="feels-like">
                  Feels like {Math.round(cityData.app_temp)}°C ({celsiusToFahrenheit(cityData.app_temp)}°F)
                </div>
                <div className="weather-desc">{cityData.weather.description}</div>
              </div>
            </div>
          </div>
          
          <div className="location-info">
            <p>📍 Coordinates: {cityData.lat}°, {cityData.lon}°</p>
            <p>🌅 Sunrise: {formatTime(cityData.sunrise)}</p>
            <p>🌇 Sunset: {formatTime(cityData.sunset)}</p>
            <p>🕐 Local Time: {cityData.timezone}</p>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>🌡️ Temperature Details</h3>
            <div className="metric-content">
              <p><strong>Current:</strong> {cityData.temp}°C ({celsiusToFahrenheit(cityData.temp)}°F)</p>
              <p><strong>Feels Like:</strong> {cityData.app_temp}°C ({celsiusToFahrenheit(cityData.app_temp)}°F)</p>
              <p><strong>Dew Point:</strong> {cityData.dewpt}°C</p>
            </div>
          </div>

          <div className="metric-card">
            <h3>💨 Wind Information</h3>
            <div className="metric-content">
              <p><strong>Speed:</strong> {cityData.wind_spd.toFixed(1)} m/s ({(cityData.wind_spd * 2.237).toFixed(1)} mph)</p>
              <p><strong>Direction:</strong> {cityData.wind_cdir_full} ({cityData.wind_dir}°)</p>
              <p><strong>Gust:</strong> {cityData.gust ? `${cityData.gust.toFixed(1)} m/s` : 'N/A'}</p>
            </div>
          </div>

          <div className="metric-card">
            <h3>💧 Humidity & Pressure</h3>
            <div className="metric-content">
              <p><strong>Humidity:</strong> {cityData.rh}%</p>
              <p><strong>Pressure:</strong> {cityData.pres.toFixed(1)} mb</p>
              <p><strong>Sea Level Pressure:</strong> {cityData.slp.toFixed(1)} mb</p>
            </div>
          </div>

          <div className="metric-card">
            <h3>👁️ Visibility & Clouds</h3>
            <div className="metric-content">
              <p><strong>Visibility:</strong> {cityData.vis} km ({(cityData.vis * 0.621371).toFixed(1)} miles)</p>
              <p><strong>Cloud Cover:</strong> {cityData.clouds}%</p>
              <p><strong>Precipitation:</strong> {cityData.precip} mm/hr</p>
            </div>
          </div>

          <div className="metric-card">
            <h3>☀️ UV Index</h3>
            <div className="metric-content">
              <p><strong>UV Index:</strong> 
                <span style={{ color: uvInfo.color, fontWeight: 'bold', marginLeft: '5px' }}>
                  {cityData.uv} ({uvInfo.level})
                </span>
              </p>
              <p><strong>Solar Radiation:</strong> {cityData.solar_rad} W/m²</p>
              <p><strong>Elevation Angle:</strong> {cityData.elev_angle}°</p>
            </div>
          </div>

          <div className="metric-card">
            <h3>🌬️ Air Quality</h3>
            <div className="metric-content">
              <p><strong>AQI:</strong> 
                <span style={{ color: aqiInfo.color, fontWeight: 'bold', marginLeft: '5px' }}>
                  {cityData.aqi} ({aqiInfo.level})
                </span>
              </p>
              <p><strong>Station:</strong> {cityData.station}</p>
              <p><strong>Last Update:</strong> {cityData.ob_time}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <h2>📊 Weather Analysis</h2>
          <div className="charts-grid">
            <Chart 
              data={allData} 
              currentCity={cityData} 
              type="temperature"
              title="Temperature Comparison Across Cities"
            />
            <Chart 
              data={allData} 
              currentCity={cityData} 
              type="humidity-wind"
              title="Humidity vs Wind Speed Analysis"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherDetail
