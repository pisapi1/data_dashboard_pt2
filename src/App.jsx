import { useState, useEffect } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [loading, setLoading] = useState(true)

  // Major cities to fetch weather data for
  const cities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
    { name: 'San Jose', lat: 37.3382, lon: -121.8863 },
    { name: 'Austin', lat: 30.2672, lon: -97.7431 },
    { name: 'Jacksonville', lat: 30.3322, lon: -81.6557 }
  ]

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      setLoading(true)
      try {
        console.log('Fetching weather data...')
        const promises = cities.map(city => 
          fetch(`https://api.weatherbit.io/v2.0/current?lat=${city.lat}&lon=${city.lon}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => ({
              ...data.data[0],
              cityDisplayName: city.name
            }))
        )
        
        const results = await Promise.all(promises)
        console.log('Weather data fetched:', results)
        setWeatherData(results)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllWeatherData()
  }, [])

  return (
    <div className="app">
      <h1>🌤️ Weather Dashboard</h1>
      
      {loading ? (
        <p>Loading weather data...</p>
      ) : (
        <div className="weather-list">
          {weatherData.map((data, index) => (
            <div key={index} className="weather-item">
              <h3>{data.cityDisplayName}</h3>
              <p>Temperature: {data.temp}°C ({Math.round(data.temp * 9/5 + 32)}°F)</p>
              <p>Description: {data.weather.description}</p>
              <p>Humidity: {data.rh}%</p>
              <p>Wind Speed: {data.wind_spd} m/s</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
