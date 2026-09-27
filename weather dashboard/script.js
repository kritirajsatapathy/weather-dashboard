const apiKey = "00d2e852661c20c7437520ed45363a2d";


// Get HTML elements

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherContainer = document.getElementById("weatherContainer");

const city = document.getElementById("city");
const date = document.getElementById("date");

const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const forecast = document.getElementById("forecast");


// Search button

searchBtn.addEventListener("click", getWeather);


// Press Enter to search

cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// Main weather function

async function getWeather() {

    const cityName = cityInput.value.trim();

    if (cityName === "") {
        alert("Please enter a city name.");
        return;
    }

    try {

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},IN&units=metric&appid=${apiKey}`;

        const weatherResponse = await fetch(weatherURL);

        const weatherData = await weatherResponse.json();


        // Show the REAL API error
        if (!weatherResponse.ok) {

            console.error("OpenWeather Error:", weatherData);

            throw new Error(
                `Error ${weatherResponse.status}: ${weatherData.message}`
            );
        }


        // Display current weather

        city.textContent =
            `${weatherData.name}, India 🇮🇳`;

        temperature.textContent =
            `${Math.round(weatherData.main.temp)}°C`;

        description.textContent =
            weatherData.weather[0].description;

        humidity.textContent =
            `${weatherData.main.humidity}%`;

        windSpeed.textContent =
            `${weatherData.wind.speed} m/s`;


        // Date

        const currentDate = new Date();

        date.textContent =
            currentDate.toLocaleString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });


        // Weather icon

        const iconElement =
            document.querySelector(".weather-icon");

        iconElement.textContent =
            getWeatherIcon(weatherData.weather[0].main);


        // Show weather section

        weatherContainer.classList.remove("hidden");


        // Forecast

        await getForecast(cityName);

    }

    catch (error) {

        console.error("REAL ERROR:", error);

        alert(error.message);

        weatherContainer.classList.add("hidden");
    }
}


// Forecast function

async function getForecast(cityName) {

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName},IN&units=metric&appid=${apiKey}`;


    const response = await fetch(forecastURL);


    if (!response.ok) {

        throw new Error("Forecast unavailable");

    }


    const data = await response.json();


    forecast.innerHTML = "";


    /*
        OpenWeather gives data every 3 hours.

        We select approximately one forecast
        for each day.
    */


    const dailyData = {};


    data.list.forEach(item => {

        const day = new Date(item.dt * 1000);

        const dayName =
            day.toLocaleDateString("en-IN", {
                weekday: "short"
            });


        if (!dailyData[dayName]) {

            dailyData[dayName] = item;

        }

    });


    const days =
        Object.keys(dailyData).slice(0, 5);


    days.forEach(dayName => {

        const item = dailyData[dayName];


        const card =
            document.createElement("div");

        card.className =
            "forecast-card";


        const icon =
            getWeatherIcon(
                item.weather[0].main
            );


        const temp =
            Math.round(item.main.temp);


        card.innerHTML = `

            <div class="forecast-day">
                ${dayName}
            </div>

            <div class="forecast-icon">
                ${icon}
            </div>

            <div class="forecast-temp">
                ${temp}°C
            </div>

        `;


        forecast.appendChild(card);

    });

}



// Weather icon function

function getWeatherIcon(weather) {

    switch (weather) {

        case "Clear":
            return "☀️";

        case "Clouds":
            return "☁️";

        case "Rain":
            return "🌧️";

        case "Drizzle":
            return "🌦️";

        case "Thunderstorm":
            return "⛈️";

        case "Snow":
            return "❄️";

        case "Mist":
        case "Fog":
        case "Haze":
            return "🌫️";

        default:
            return "🌤️";
    }

}
