import './Chart.css'

const Chart = ({ data, currentCity, type, title }) => {
  if (!data || data.length === 0) return null

  const renderTemperatureChart = () => {
    const maxTemp = Math.max(...data.map(d => d.temp))
    const minTemp = Math.min(...data.map(d => d.temp))
    const tempRange = maxTemp - minTemp

    return (
      <div className="bar-chart">
        <div className="chart-title">{title}</div>
        <div className="chart-content">
          <div className="bars-container">
            {data
              .sort((a, b) => b.temp - a.temp)
              .map((city, index) => {
                const height = ((city.temp - minTemp) / tempRange) * 200 + 20
                const isCurrentCity = city.cityDisplayName === currentCity.cityDisplayName
                
                return (
                  <div key={city.cityDisplayName} className="bar-group">
                    <div 
                      className={`bar ${isCurrentCity ? 'highlighted' : ''}`}
                      style={{ 
                        height: `${height}px`,
                        backgroundColor: isCurrentCity ? '#FF6B6B' : '#4ECDC4'
                      }}
                    >
                      <div className="bar-value">{Math.round(city.temp)}°C</div>
                    </div>
                    <div className="bar-label">
                      {city.cityDisplayName.split(' ').map(word => word.charAt(0)).join('')}
                    </div>
                  </div>
                )
              })}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
              <span>Current City ({currentCity.cityDisplayName})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#4ECDC4' }}></div>
              <span>Other Cities</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHumidityWindChart = () => {
    const maxHumidity = Math.max(...data.map(d => d.rh))
    const maxWind = Math.max(...data.map(d => d.wind_spd))

    return (
      <div className="scatter-chart">
        <div className="chart-title">{title}</div>
        <div className="chart-content">
          <div className="scatter-container">
            <div className="y-axis-label">Wind Speed (m/s)</div>
            <div className="chart-area">
              {data.map((city) => {
                const x = (city.rh / maxHumidity) * 90
                const y = (city.wind_spd / maxWind) * 80
                const isCurrentCity = city.cityDisplayName === currentCity.cityDisplayName
                
                return (
                  <div
                    key={city.cityDisplayName}
                    className={`scatter-point ${isCurrentCity ? 'highlighted' : ''}`}
                    style={{
                      left: `${x}%`,
                      bottom: `${y}%`,
                      backgroundColor: isCurrentCity ? '#FF6B6B' : '#4ECDC4'
                    }}
                    title={`${city.cityDisplayName}: ${city.rh}% humidity, ${city.wind_spd.toFixed(1)} m/s wind`}
                  >
                    {isCurrentCity && <span className="point-label">{city.cityDisplayName}</span>}
                  </div>
                )
              })}
            </div>
            <div className="x-axis-label">Humidity (%)</div>
          </div>
          <div className="chart-insights">
            <h4>💡 Insights:</h4>
            <ul>
              <li>Higher humidity often correlates with different wind patterns</li>
              <li>{currentCity.cityDisplayName} has {currentCity.rh}% humidity and {currentCity.wind_spd.toFixed(1)} m/s wind speed</li>
              <li>Cities in the upper right tend to have both high humidity and high wind</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      {type === 'temperature' && renderTemperatureChart()}
      {type === 'humidity-wind' && renderHumidityWindChart()}
    </div>
  )
}

export default Chart
