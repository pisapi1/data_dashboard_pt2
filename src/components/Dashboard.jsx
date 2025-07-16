import { useState } from 'react'
import WeatherCard from './WeatherCard'
import Statistics from './Statistics'
import './Dashboard.css'

const Dashboard = ({ 
  weatherData, 
  allData, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  temperatureFilter, 
  setTemperatureFilter 
}) => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🌤️ Global Weather Dashboard</h1>
        <p>Real-time weather conditions across major US cities</p>
      </header>

      {/* Statistics Overview */}
      {!loading && <Statistics data={allData} />}

      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <label htmlFor="temp-filter">Filter by temperature:</label>
          <select
            id="temp-filter"
            value={temperatureFilter}
            onChange={(e) => setTemperatureFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All temperatures</option>
            <option value="hot">Hot ({'>'}25°C / 77°F)</option>
            <option value="warm">Warm (15-25°C / 59-77°F)</option>
            <option value="cold">Cold ({'<'}15°C / 59°F)</option>
          </select>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="weather-grid">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : weatherData.length > 0 ? (
          weatherData.map((data, index) => (
            <WeatherCard key={`${data.cityDisplayName}-${index}`} data={data} />
          ))
        ) : (
          <div className="no-results">
            <p>No cities match your search criteria</p>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <div className="results-info">
          Showing {weatherData.length} of {allData.length} cities
        </div>
      )}
    </div>
  )
}

export default Dashboard
