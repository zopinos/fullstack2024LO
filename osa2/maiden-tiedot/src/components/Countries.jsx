const Country = ({ country, weather }) => {
    const languages = Object.keys(country.languages).map(key => country.languages[key])
    const flag = country.flags.png
    const capital = country.capital[0]
    const temp = (weather.main.temp - 273.15).toFixed(2)
    const wthIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
    const wind = weather.wind.speed.toFixed(2)
    console.log(languages)
    console.log(country.flags.png)
    console.log(weather)

    return (
        <div>
            <h1>{country.name.common}</h1>

            <p>Capital: {capital}</p>
            <p>Area: {country.area}</p>

            <h2>Languages:</h2>
            <ul>
                {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>

            <h2>Flag:</h2>
            <img src={flag} />

            <h2>Weather in {capital}</h2>
            <p>Temperature: {temp} Celsius</p>
            <img src={wthIcon} />
            <p>Wind: {wind}</p>
        </div>
    )
}

const CountryList = ({ countries, handleCountryChange }) => {
    return (
        <div>
            <ul>
                {countries
                    .map(country => (
                        <li key={country.name.official}>{country.name.common} <button onClick={() => { handleCountryChange(country) }}>show</button></li>)
                    )
                }
            </ul>
        </div>
    )
}

const Countries = ({ countries, filter, newCountry, handleCountryChange, weather }) => {
    const shownCountries = countries.filter(country =>
        (country.name.common.toLowerCase().includes(filter.toLowerCase()))
    )

    if (newCountry !== null) {
        return (
            <div>
                <Country country={newCountry} weather={weather} />
            </div>
        )
    } else if (shownCountries.length > 10) {
        return (
            <div>Too many matches, specify another filter</div>
        )
    } else if (shownCountries.length == 1) {
        handleCountryChange(shownCountries[0])
    } else {
        return (
            <div>
                <CountryList countries={shownCountries} handleCountryChange={handleCountryChange} />
            </div>
        )
    }
}

export default Countries