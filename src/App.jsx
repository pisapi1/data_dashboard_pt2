import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import WeatherDetail from './components/WeatherDetail'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY

function App() {
  const [weatherData, setWeatherData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [temperatureFilter, setTemperatureFilter] = useState('all')
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'detail'
  const [selectedCity, setSelectedCity] = useState(null)

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
        setFilteredData(results)
      } catch (error) {
        console.error('Error fetching weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllWeatherData()
  }, [])

  // Handle URL changes for direct links
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname
      if (path.startsWith('/city/')) {
        const cityName = decodeURIComponent(path.split('/city/')[1])
        const city = weatherData.find(d => d.cityDisplayName === cityName)
        if (city) {
          setSelectedCity(city)
          setCurrentView('detail')
        }
      } else {
        setCurrentView('dashboard')
        setSelectedCity(null)
      }
    }

    window.addEventListener('popstate', handlePopState)
    handlePopState() // Handle initial URL

    return () => window.removeEventListener('popstate', handlePopState)
  }, [weatherData])

  // Filter data based on search term and temperature
  useEffect(() => {
    let filtered = weatherData.filter(data =>
      data.cityDisplayName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (temperatureFilter !== 'all') {
      filtered = filtered.filter(data => {
        const temp = data.temp
        switch (temperatureFilter) {
          case 'hot': return temp > 25 // Above 25°C
          case 'warm': return temp >= 15 && temp <= 25 // 15-25°C
          case 'cold': return temp < 15 // Below 15°C
          default: return true
        }
      })
    }

    setFilteredData(filtered)
  }, [searchTerm, temperatureFilter, weatherData])

  // Navigate to city detail
  const navigateToCity = (cityData) => {
    setSelectedCity(cityData)
    setCurrentView('detail')
    const url = `/city/${encodeURIComponent(cityData.cityDisplayName)}`
    window.history.pushState({}, '', url)
  }

  // Navigate back to dashboard
  const navigateToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedCity(null)
    window.history.pushState({}, '', '/')
  }

  return (
    <div className="app">
      {currentView === 'dashboard' ? (
        <Dashboard 
          weatherData={filteredData}
          allData={weatherData}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          temperatureFilter={temperatureFilter}
          setTemperatureFilter={setTemperatureFilter}
          onCityClick={navigateToCity}
        />
      ) : (
        <WeatherDetail 
          cityData={selectedCity}
          allData={weatherData}
          onBackToDashboard={navigateToDashboard}
        />
      )}
    </div>
  )
}

export default App
