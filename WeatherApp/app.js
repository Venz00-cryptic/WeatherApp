document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "sCDrv5wEAZwfTgQOTZ32curaX0ZAWcuK"; 
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyForecastData(locationKey);
                    fetchHourlyForecastData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }
    
    function fetchHourlyForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }
    function fetchDailyForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }


    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(forecasts) {
        let forecastContent = `
            <h2>Hourly Forecast</h2>
        `;
        forecasts.forEach(forecast => {
            forecastContent += `
                <p>${new Date(forecast.DateTime).toLocaleTimeString()}: ${forecast.Temperature.Value}°C, ${forecast.IconPhrase}</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function displayDailyForecast(forecasts) {
        let forecastContent = `
            <h2>5 Days of Daily Forecasts</h2>
        `;
        forecasts.forEach(forecast => {
            forecastContent += `
                <p>${new Date(forecast.Date).toDateString()}: ${forecast.Temperature.Minimum.Value}°C - ${forecast.Temperature.Maximum.Value}°C, ${forecast.Day.IconPhrase}</p>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }
});