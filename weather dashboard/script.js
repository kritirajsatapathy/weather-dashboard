const apiKey = "27bead20e3113eca1b90daa96fd87635"; // Replace with your OpenWeatherMap API key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

const cityNameEl = document.getElementById("cityName");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temp");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherInfoEl = document.getElementById("weatherInfo");
const forecastContainer = document.getElementById("forecastContainer");
const forecastTitle = document.getElementById("forecastTitle");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeatherData(city);
});

async function getWeatherData(city) {
  try {
    // 🌦️ Fetch current weather for Indian city
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      alert("City not found in India! Please try another Indian city.");
      return;
    }

    displayCurrentWeather(currentData);

    // 🌦️ Fetch 5-day forecast for Indian city
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${apiKey}&units=metric`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    displayForecast(forecastData.list);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Something went wrong while fetching data.");
  }
}

function displayCurrentWeather(data) {
  const { name } = data;
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  cityNameEl.textContent = `${name}, India 🇮🇳`;
  dateEl.textContent = new Date().toLocaleString("en-IN");
  tempEl.textContent = `${Math.round(temp)}°C`;
  descriptionEl.textContent = description;
  humidityEl.textContent = humidity;
  windEl.textContent = speed;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  weatherInfoEl.classList.remove("hidden");
}

function displayForecast(list) {
  forecastContainer.innerHTML = "";
  forecastTitle.classList.remove("hidden");

  // Pick one reading per day (~every 8th item)
  for (let i = 0; i < list.length; i += 8) {
    const item = list[i];
    const date = new Date(item.dt_txt);
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <p>${date.toLocaleDateString("en-IN", { weekday: "short" })}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
      <p>${temp}°C</p>
    `;
    forecastContainer.appendChild(card);
  }
}
