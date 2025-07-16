import './Statistics.css'

const Statistics = ({ data }) => {
  if (!data || data.length === 0) return null

  // Calculate statistics
  const temperatures = data.map(d => d.temp)
  const humidities = data.map(d => d.rh)
  const windSpeeds = data.map(d => d.wind_spd)
  const uvIndexes = data.map(d => d.uv)

  const avgTemp = (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
  const maxTemp = Math.max(...temperatures)
  const minTemp = Math.min(...temperatures)
  const avgHumidity = Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length)
  const maxWindSpeed = Math.max(...windSpeeds).toFixed(1)
  const maxUV = Math.max(...uvIndexes)

  // Find cities with extreme values
  const hottestCity = data.find(d => d.temp === maxTemp)?.cityDisplayName
  const coldestCity = data.find(d => d.temp === minTemp)?.cityDisplayName
  const windiestCity = data.find(d => d.wind_spd === Math.max(...windSpeeds))?.cityDisplayName

  // Count weather conditions
  const weatherCounts = data.reduce((acc, d) => {
    const condition = d.weather.description
    acc[condition] = (acc[condition] || 0) + 1
    return acc
  }, {})

  const mostCommonWeather = Object.entries(weatherCounts)
    .sort(([,a], [,b]) => b - a)[0]

  return (
    <div className="statistics">
      <h2>📊 Weather Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🌡️</div>
          <div className="stat-content">
            <h3>Temperature</h3>
            <div className="stat-value">{avgTemp}°C avg</div>
            <div className="stat-details">
              🔥 {maxTemp}°C in {hottestCity}<br/>
              🧊 {minTemp}°C in {coldestCity}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💨</div>
          <div className="stat-content">
            <h3>Wind</h3>
            <div className="stat-value">{maxWindSpeed} m/s max</div>
            <div className="stat-details">
              Strongest in {windiestCity}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💧</div>
          <div className="stat-content">
            <h3>Humidity</h3>
            <div className="stat-value">{avgHumidity}% avg</div>
            <div className="stat-details">
              Across all cities
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">☀️</div>
          <div className="stat-content">
            <h3>UV Index</h3>
            <div className="stat-value">{maxUV} max</div>
            <div className="stat-details">
              Highest UV exposure
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌤️</div>
          <div className="stat-content">
            <h3>Common Weather</h3>
            <div className="stat-value">{mostCommonWeather[0]}</div>
            <div className="stat-details">
              {mostCommonWeather[1]} cities
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏙️</div>
          <div className="stat-content">
            <h3>Cities Tracked</h3>
            <div className="stat-value">{data.length}</div>
            <div className="stat-details">
              Real-time data
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
