import './WeatherCard.css'

const WeatherCard = ({ data }) => {
  // Helper function to convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32)
  }

  // Helper function to get weather icon URL
  const getWeatherIcon = (iconCode) => {
    return `https://www.weatherbit.io/static/img/icons/${iconCode}.png`
  }

  // Helper function to format time
  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="weather-card">
      <div className="card-header">
        <h3 className="city-name">{data.cityDisplayName}</h3>
        <div className="weather-icon">
          <img 
            src={getWeatherIcon(data.weather.icon)} 
            alt={data.weather.description}
            title={data.weather.description}
          />
        </div>
      </div>

      <div className="temperature-section">
        <div className="main-temp">
          <span className="temp-celsius">{Math.round(data.temp)}°C</span>
          <span className="temp-fahrenheit">({celsiusToFahrenheit(data.temp)}°F)</span>
        </div>
        <div className="feels-like">
          Feels like {Math.round(data.app_temp)}°C ({celsiusToFahrenheit(data.app_temp)}°F)
        </div>
        <div className="weather-description">{data.weather.description}</div>
      </div>

      <div className="weather-details">
        <div className="detail-row">
          <span className="detail-label">💨 Wind:</span>
          <span className="detail-value">{data.wind_spd.toFixed(1)} m/s {data.wind_cdir}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">💧 Humidity:</span>
          <span className="detail-value">{data.rh}%</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">👁️ Visibility:</span>
          <span className="detail-value">{data.vis} km</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">🌅 Sunrise:</span>
          <span className="detail-value">{formatTime(data.sunrise)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">🌇 Sunset:</span>
          <span className="detail-value">{formatTime(data.sunset)}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">☀️ UV Index:</span>
          <span className="detail-value">{data.uv}</span>
        </div>
        
        <div className="detail-row">
          <span className="detail-label">🌫️ Air Quality:</span>
          <span className="detail-value">AQI {data.aqi}</span>
        </div>
      </div>

      <div className="observation-time">
        Last updated: {new Date(data.ob_time).toLocaleString()}
      </div>
    </div>
  )
}

export default WeatherCard
