const requestHeaders = new Headers();
requestHeaders.append("Accept", "application/json"),
  ("User-Agent", ("WeatherApp", "jordan.c.koski@outlook.com"));

function init() {
  let longitude = -76.0652;
  let latitude = 42.111;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        longitude = position.coords.longitude.toFixed(4);
        latitude = position.coords.latitude.toFixed(4);
        await weatherApp(longitude, latitude);
      },
      function (error) {
        console.error("Error getting geolocation: ", error);
        getForecast(longitude, latitude);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    getForecast(longitude, latitude);
  }
}

async function weatherApp(longitude, latitude) {
  const apiURL = `https://api.weather.gov/points/${latitude},${longitude}`;
  const apiRequest = new Request(apiURL, {
    method: "GET",
    headers: requestHeaders,
    mode: "cors",
  });

  const response = await fetch(apiRequest);
  if (!response.ok) {
    throw new Error("HTTP Request Failed");
  }

  const data = await response.json();

  const city = data.properties.relativeLocation.properties.city;
  const state = data.properties.relativeLocation.properties.state;

  const forecastURL = data.properties.forecastHourly;
  const forecastRequest = new Request(forecastURL, {
    method: "GET",
    headers: requestHeaders,
    mode: "cors",
  });

  const forecastResponse = await fetch(forecastRequest);
  if (!forecastResponse.ok) {
    throw new Error("HTTP Request Failed");
  }

  const forecastData = await forecastResponse.json();
  const currentTemperature = forecastData.properties.periods[0].temperature;
  const conditions = forecastData.properties.periods[0].shortForecast;
  const relativeHumidity =
    forecastData.properties.periods[0].relativeHumidity.value;

  document.querySelector("#location").textContent = `${city}, ${state}`;
  document.querySelector("#temperature").textContent = `${currentTemperature}℉`;
  document.querySelector("#conditions").textContent = conditions;
  document.querySelector(
    "#humidity"
  ).textContent = `Humidity: ${relativeHumidity}%`;

  console.log(forecastData);
}

init();
