const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let unit = "metric";
const apiKey = "put your api key here";
const getApiURL = (latitude, longitude) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

const card = document.querySelector(".card");
const loader = document.querySelector(".loader");
const _icon = document.querySelector(".card--icon-container");
const description = document.querySelector(".card--icon-description");
const city = document.querySelector(".card--text-city");
const date = document.querySelector(".card--text-date");
const degree = document.querySelector(".card--text-degree");
const feelslike = document.querySelector(".card--text-feelslike");
const _wind = document.querySelector(".card--text-wind");
const _humidity = document.querySelector(".card--text-humidity");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(updateWeather, showError);
} else {
  alert("Geolocation is not supported by this browser.");
}

function setLoading(value) {
  const loading = value ? "true" : "false";
  card.setAttribute("data-loading", loading);
  loader.setAttribute("data-loading", loading);
}

async function updateWeather(position) {
  try {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = getApiURL(latitude, longitude);

    setLoading(true);

    const response = await fetch(url);
    if (!response.ok) {
      alert("Unable to retrieve weather");
      return;
    }
    const { name, sys, main, weather, wind } = await response.json();
    const { country } = sys;
    const { temp, feels_like, humidity } = main;
    const now = new Date();
    const currentWeather = weather[0];

    _icon.style.backgroundImage = `url("https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png")`;
    description.textContent = currentWeather.description;
    city.textContent = `${name}, ${country}`;
    date.textContent = daysOfWeek[now.getDay()];
    degree.textContent = `${temp}°`;
    feelslike.textContent = `${feels_like}°`;
    _humidity.textContent = `${humidity}%`;
    _wind.textContent = `${wind.speed}KM/H`;

    setLoading(false);
  } catch (error) {
    alert(error.message);
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
