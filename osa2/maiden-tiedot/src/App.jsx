import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newCountry, setCountry] = useState(null)
  const [newWeather, setWeather] = useState(null)
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setCountry(null)
  }

  const handleCountryChange = (targetCountry) => {
    const [lat, lon] = targetCountry.capitalInfo.latlng

    weatherService
      .getWeather(lat, lon)
      .then(returnedWeather => {
        console.log("weather promise fulfilled")
        setWeather(returnedWeather)

        console.log("Country changed...")
        setCountry(targetCountry)
      })
  }

  useEffect(() => {
    console.log("country effect")
    countryService
      .getAll()
      .then(initialCountries => {
        console.log("country promise fulfilled")
        setCountries(initialCountries)
      })
  }, [])

  return (
    <div>
      <Filter filter={filter} handleChange={handleFilterChange} />
      <Countries countries={countries} filter={filter} newCountry={newCountry} weather={newWeather} handleCountryChange={handleCountryChange} />
    </div>
  )

}

export default App