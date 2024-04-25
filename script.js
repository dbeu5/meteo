const daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentConditionCodeList = [
  [[51, 53, 55], "drizzle"],
  [[45, 48], "fog"],
  [[61, 63, 65, 80, 81, 82], "rain"],
  [[66, 67], "sleet"],
  [[71, 73, 75, 77, 85, 86], "snow"],
  [[56, 57], "frost"],
  [[95, 96, 97], "thunderstorm"]
];
const forecastConditionCodeList = [
  [[0, 1], "day-clear"],
  [[2], "day-cloudy"],
  [[3], "overcast"],
  [[51, 53, 55], "day-cloudy-drizzle"],
  [[45, 48], "day-cloudy-fog"],
  [[61, 63, 65, 80, 81, 82], "day-cloudy-rain"],
  [[66, 67], "day-cloudy-sleet"],
  [[71, 73, 75, 77, 85, 86], "day-cloudy-snow"],
  [[56, 57], "frost"],
  [[95, 96, 97], "thunderstorm"]
];
const conditionNames = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 46: "Rime fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  56: "Freezing drizzle", 57: "Freezing drizzle",
  61: "Light rain", 63: "Moderate rain", 65: "Heavy rain",
  66: "Freezing rain", 67: "Freezing rain",
  71: "Light snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  85: "Light snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Light hail", 99: "Heavy hail"
};

const updateSearchResult = (resultElement, resultList, searchTerm="") => {  
  resultElement.textContent = "";

  if (!searchTerm) {
    resultElement.innerHTML += `
      <a class="header__section--search__row__result-box__item" href="#781">
        <span class="header__section--search__row__result-box__item__town">
          Zagreb
        </span>
        <span class="header__section--search__row__result-box__item__info">
          Croatia
        </span>
      </a>
      <a class="header__section--search__row__result-box__item" href="#95">
        <span class="header__section--search__row__result-box__item__town">
          Berlin
        </span>
        <span class="header__section--search__row__result-box__item__info">
          Germany
        </span>
      </a>
      <a class="header__section--search__row__result-box__item" href="#25">
        <span class="header__section--search__row__result-box__item__town">
          London
        </span>
        <span class="header__section--search__row__result-box__item__info">
          United Kingdom
        </span>
      </a>
      <a class="header__section--search__row__result-box__item" href="#26">
        <span class="header__section--search__row__result-box__item__town">
          New York City
        </span>
        <span class="header__section--search__row__result-box__item__info">
          Unites States
        </span>
      </a>
      <a class="header__section--search__row__result-box__item" href="#29">
        <span class="header__section--search__row__result-box__item__town">
          Tokyo
        </span>
        <span class="header__section--search__row__result-box__item__info">
          Japan
        </span>
      </a>`;
    return;
  }

  if (resultList.length === 0) {
    resultElement.innerHTML += `
      <li class="header__section--search__row__result-box__item">
        <span class="header__section--search__row__result-box__item__town">
          We couldn't find anything matching "${searchTerm}"
        </span>
        <span class="header__section--search__row__result-box__item__info">
          To get precise results, separate town, administrative region and country name with ";"
        </span>
      </li>`;
    return;
  }

  for (resultIndex of resultList) {
    resultElement.innerHTML += `
      <a class="header__section--search__row__result-box__item" href="#${resultIndex}">
        <span class="header__section--search__row__result-box__item__town">
          ${townList[resultIndex][0]}
        </span>
        <span class="header__section--search__row__result-box__item__info">
        ${townList[resultIndex][6] ? admin2List[townList[resultIndex][6]] + "," : ""}
        ${townList[resultIndex][5] ? admin1List[townList[resultIndex][5]] + "," : ""}
        ${countryList[townList[resultIndex][4]]}
        </span>
      </a>`;
  }
}

const searchForPlaces = (searchValue) => {
  if (!searchValue.length) {
    return [];
  }

  let searchInputs = searchValue.toLowerCase();
  let resultCount = 0;
  let result = [];

  for (let i = 0; i < townList.length; i++) {
    let hasFound = true;
    for (const searchInput of searchInputs.split(";")) {
      if (!townList[i][0].toLowerCase().startsWith(searchInput) &&
          !townList[i][1].toLowerCase().startsWith(searchInput) &&
          !countryList[townList[i][4]].toLowerCase().startsWith(searchInput) &&
          !admin1List[townList[i][5]].toLowerCase().startsWith(searchInput) &&
          !admin2List[townList[i][6]].toLowerCase().startsWith(searchInput)) {
        hasFound = false;
        break;
      }
    }
    if (!hasFound) {
      continue;
    }
    result.push(i);
    resultCount++;
    if (resultCount === 10) {
      break;
    }
  }
  return result;
}

const getCurrentConditionSymbol = (currentCode, cloudCover, isDay, isRain, isSnow) => {
  let toReturn = "";
  if (cloudCover >= 75) {
    toReturn = "overcast"
  } else if (cloudCover <= 25 && [0, 1, 45, 48].includes(currentCode)) {
    toReturn = isDay ? "day-clear" : "night-clear";
  } else {
    toReturn = isDay ? "day-cloudy" : "night-cloudy";
  }

  for (codeList of currentConditionCodeList) {
    for (codeInList of codeList[0]) {
      if (currentCode === codeInList) {
        if (codeList[1] == "frost") {
          toReturn = "frost";
          continue;
        }
        if (codeList[1] == "thunderstorm") {
          toReturn = `thunderstorm${isRain ? "-rain" : (isSnow ? "-snow" : "")}`;
          continue;
        }
        toReturn += `-${codeList[1]}`;
        break;
      }
    }
  }
  return toReturn;
}

const getForecastConditionSymbol = (forecastCode) => {
  toReturn = "";
  for (codeList of forecastConditionCodeList) {
    for (codeInList of codeList[0]) {
      if (forecastCode === codeInList) {
        toReturn = codeList[1];
        break;
      }
    }
  }
  return toReturn;
}

const getCurrentLocation = async () => {
  const res = await fetch("https://api.techniknews.net/ipgeo/");
  const data = await res.json();

  return {
    error: data.status !== "success",
    place: data.status === "success" ? data.city : "Earth",
    lat: data.status === "success" ? data.lat : 0.0,
    lon: data.status === "success" ? data.lon : 0.0,
  };
}

const getWeatherData = async (lat, lon, days, hourly="", daily="", current="") => {
  let url = "https://api.open-meteo.com/v1/forecast?timezone=auto&wind_speed_unit=ms";
  url += `&latitude=${lat}&longitude=${lon}&forecast_days=${days}`;
  url += hourly ? `&hourly=${hourly}` : "";
  url += daily ? `&daily=${daily}` : "";
  url += current ? `&current=${current}` : "";

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

const updateLogo = (isError, isDay = false) => {
  const logo = document.getElementById("logo-image");
  logo.src = `./res/logo-${isError ? "error" : (isDay ? "day" : "night")}.svg`;
}

const updateWeatherNow = (data = {error: true}, placeName) => {
  if (data.error) { return; }

  const place = document.querySelector(".header__section--info__place");
  const temp = document.querySelector(".main__section--current__grid__temperature");
  const feelsLike = document.querySelector(".main__section--current__grid__feels-like__temp");
  const conditionSymbol = document.querySelector(".main__section--current__grid__condition");
  const conditionName = document.querySelector(".main__section--current__grid__condition-name");
  const statuses = Array.from(document.querySelectorAll(".main__section--current__grid__status__value"));

  const statusNames = ["cloud_cover", "precipitation_probability", "wind_speed_10m", "surface_pressure"];
  const statusValueList = statusNames.map(
    (statusName) => `${Math.round(data.current[statusName])} ${data.current_units[statusName]}`
  );
  
  place.textContent = placeName;
  temp.textContent = `${Math.round(data.current.temperature_2m)}°`;
  feelsLike.textContent = `${Math.round(data.current.apparent_temperature)}°`;
  for (let i = 0; i < statusValueList.length; i++) {
    statuses[i].textContent = statusValueList[i];
  }
  const conditionSymbolName = getCurrentConditionSymbol(
    data.current.weather_code,
    data.current.cloud_cover,
    data.current.is_day,
    data.current.rain,
    data.current.snowfall
  );
  conditionSymbol.src = `./res/${conditionSymbolName}.svg`;
  conditionSymbol.alt = conditionSymbolName;
  conditionName.textContent = conditionNames[data.current.weather_code];
}

const updateForecast = (data = {error: true}) => {
  if (data.error) { return; }

  const forecastList = document.querySelector(".main__section--forecast__list");
  forecastList.textContent = "";

  for (let i = 0; i < data.daily.time.length; i++) {
    const day = new Date(Date.parse(data.daily.time[i]));
    const dayInWeek = daysInWeek[day.getDay()].slice(0, 3);
    forecastCodeName = getForecastConditionSymbol(data.daily.weather_code[i]);
    forecastList.innerHTML += `
      <div class="main__section--forecast__list__day">
        <span class="main__section--forecast__list__day__date">
          ${dayInWeek} ${day.getDate()}/${day.getMonth() + 1}
        </span>
        <div class="main__section--forecast__list__day__temp">
          <span class="main__section--forecast__list__day__temp__max">
            ${Math.round(data.daily.temperature_2m_max[i])}°
          </span>
          <strong>/</strong>
          <span class="main__section--forecast__list__day__temp__min">
            ${Math.round(data.daily.temperature_2m_min[i])}°
          </span>
        </div>
        <img
          class="main__section--forecast__list__day__image"
          src="./res/${forecastCodeName}.svg"
          alt="forecast condition">
      </div>`;
  }
}

const updateDetailedDay = (dayName) => {
  const day = new Date(Date.parse(dayName));
  const dayInWeek = daysInWeek[day.getDay()];
  document.getElementById("detailed-day").textContent = dayInWeek;
}

const updateDetails = (dataset = {error: true}, offset = 0) => {
  if (dataset.error) { return; }

  document.getElementById("details-grid").textContent = "";

  const rem = parseInt(getComputedStyle(document.querySelector(":root")).fontSize);
  const graphHeight = 10 * rem;
  const graphWidthUnit = 5.5 * rem;

  const times = dataset.hourly.time.slice(offset, 24 + offset).filter((_, i) => (i + 1) % 2);
  const symbols = dataset.hourly.weather_code.slice(offset, 24 + offset).map(
    (weatherCode, i) => [
      weatherCode,
      dataset.hourly.cloud_cover[i],
      dataset.hourly.is_day[i],
      false,
      false
    ]
  ).filter((_, i) => (i + 1) % 2);
  const temperatures = dataset.hourly.temperature_2m.slice(offset, 24 + offset).filter((_, i) => (i + 1) % 2);
  const precipitationProbabilities = dataset.hourly.precipitation_probability.slice(offset, 25 + offset);
  let precipitationPercentages = [];
  for (let i = 0; i < 24; i+= 2) {
    precipitationPercentages.push(Math.max(
      precipitationProbabilities[i],
      precipitationProbabilities[i + 1],
    ));
  }

  // display day
  updateDetailedDay(dataset.daily.time[offset / 24]);

  // times
  const userOffsetSeconds = new Date(Date.now()).getTimezoneOffset() * 60;
  d3.select("#details-grid").selectAll(".main__section--details__grid__time")
    .data(times).enter().append("p")
    .attr("class", "main__section--details__grid__time")
    .text((d) => {
      const difference = (Date.parse(d) - Date.now() - (userOffsetSeconds + dataset.utc_offset_seconds) * 1000) / 3600000;
      if (difference < 0 && !parseInt(difference / 2)) {
        return "Now";
      }
      return d.split("T")[1];
    });

  // symbol
  d3.select("#details-grid").selectAll(".main__section--details__grid__symbol")
    .data(symbols).enter().append("img")
    .attr("class", "main__section--details__grid__symbol")
    .attr("src", (d) => `./res/${getCurrentConditionSymbol(...d)}.svg`);
  
  // temperature
  d3.select("#details-grid").selectAll(".main__section--details__grid__temperature")
    .data(temperatures).enter().append("p")
    .attr("class", "main__section--details__grid__temperature")
    .text((d) => `${Math.round(d)}°`);

  // precipitation graph
  const yRange = d3.scaleLinear()
    .domain([-2, 101])
    .range([graphHeight, 5]);
  const xRange = d3.scaleLinear()
    .domain([0, 25])
    .range([-1, (graphWidthUnit + 1) * 12.5]);

  const areaGenerator = d3.area()
    .x((_, i) => xRange(i))
    .y0(yRange(-2))
    .y1((d) => yRange(d))
    .curve(d3.curveBasis);

  d3.select("#details-grid")
    .append("svg")
    .attr("width", graphWidthUnit * 12)
    .attr("height", graphHeight)
    .attr("class", "main__section--details__grid__graph")
    .attr("id", "graph");
  
  d3.select("#graph")
    .append("path")
    .datum(precipitationProbabilities)
    .attr("fill", "var(--back-blue)")
    .attr("stroke", "var(--text-blue)")
    .attr("d", areaGenerator);
  
  d3.select("#graph")
    .append("image")
    .attr("x", 1.5 * rem)
    .attr("y", 1.5 * rem)
    .attr("width", 2 * rem)
    .attr("height", 2 * rem)
    .attr("xlink:href", "./res/details-precipitation.svg");
  
  // precipitation percentages
  d3.select("#details-grid").selectAll(".main__section--details__grid__percentage")
    .data(precipitationPercentages).enter().append("p")
    .attr("class", "main__section--details__grid__percentage")
    .text((d) => `${d}%`);
  
  // statuses
  const statuses = Array.from(document.querySelectorAll(".main__section--details__day__status__value"));

  const statusValueList = [
    `${dataset.daily.sunrise[Math.floor(offset / 24)].split("T")[1]}`,
    `${dataset.daily.sunset[Math.floor(offset / 24)].split("T")[1]}`,
    `${Math.floor(dataset.daily.uv_index_max[Math.floor(offset / 24)])}`,
    `${Math.round(dataset.daily.precipitation_sum[Math.floor(offset / 24)])} mm`,
  ];

  for (let i = 0; i < statusValueList.length; i++) {
    statuses[i].textContent = statusValueList[i];
  }

  const uviImage = document.getElementById("status-uvi");
  const uvi = Math.floor(dataset.daily.uv_index_max[Math.floor(offset / 24)]);
  uviImage.src = `./res/status-uvi-${uvi > 11 ? "11-plus" : uvi}.svg`;
}

const updateLocation = async (latitude, longitude, placeName) => {
  const weatherData = await getWeatherData(
    latitude,
    longitude,
    12,
    "temperature_2m,precipitation_probability,weather_code,cloud_cover,is_day",
    "temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max,precipitation_sum",
    "temperature_2m,apparent_temperature,is_day,rain,snowfall,weather_code,cloud_cover,precipitation_probability,wind_speed_10m,surface_pressure",
  );
  // document.body.innerHTML += JSON.stringify(weatherData);
  
  updateLogo(weatherData.error, weatherData.current.is_day);
  updateWeatherNow(weatherData, placeName);
  updateForecast(weatherData);
  updateDetails(weatherData);
  
  return weatherData;
}

const main = async () => {
  const maxDetailedDays = 6;
  let offsetHours = 0;

  const townResult = document.getElementById("town-result");
  const townSearch = document.getElementById("town-search");
  const locationButton = document.getElementById("location-button");
  const detailsPrevButton = document.getElementById("detailed-prev");
  const detailsNextButton = document.getElementById("detailed-next");

  const locationData = await getCurrentLocation();
  let weatherData = await updateLocation(locationData.lat, locationData.lon, locationData.place);

  if (window.location.hash && window.location.hash !== "#") {
    window.location.hash = "";
  }
  if (!weatherData.error) {
    for (el of document.querySelectorAll(".main__section")) {
      el.style.display = "flex";
    }
  }

  window.addEventListener("hashchange", async () => {
    offsetHours = 0;
    detailsPrevButton.disabled = true;
    detailsNextButton.disabled = false;

    if (!window.location.hash || window.location.hash === "#") {
      townSearch.value = "";
      weatherData = await updateLocation(locationData.lat, locationData.lon, locationData.place);
      return;
    }
    const id = parseInt(window.location.hash.substring(1));
    townSearch.value = townList[id][0];
    weatherData = await updateLocation(townList[id][2], townList[id][3], townList[id][0]);
  });
  townSearch.addEventListener("keyup", () => {
    updateSearchResult(townResult, searchForPlaces(townSearch.value), townSearch.value);
  });
  townResult.addEventListener("click", () => document.activeElement.blur());
  locationButton.addEventListener("click", () => { window.location.hash = ""; });

  detailsPrevButton.addEventListener("click", () => {
    offsetHours = Math.max(offsetHours - 24, 0);
    updateDetails(weatherData, offsetHours);
    detailsPrevButton.disabled = !offsetHours;
    detailsNextButton.disabled = false;
  });
  detailsNextButton.addEventListener("click", () => {
    offsetHours = Math.min(offsetHours + 24, 24 * maxDetailedDays);
    updateDetails(weatherData, offsetHours);
    detailsNextButton.disabled = offsetHours === 24 * maxDetailedDays;
    detailsPrevButton.disabled = false;
  });
  detailsPrevButton.disabled = true;
}

main().catch((error) => {
  updateLogo(true);
  updateWeatherNow();
  console.log(error);
});
