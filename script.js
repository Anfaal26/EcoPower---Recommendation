
/* -------- CONFIG -------- */
const API_KEY = "57ec129981c8b6b53277873917a03a52"; 
const LOCATION = "Kuala Lumpur";

document.addEventListener("DOMContentLoaded", () => loadWeatherAndSolar());

/* -------- MAIN FUNCTION -------- */
async function loadWeatherAndSolar() {
    const statusEl = document.getElementById("status");
    statusEl.textContent = "Loading weather...";

    try {
        const weather = await fetchWeather();
        updateWeatherCard(weather);
        updateSolarCard(weather);
        statusEl.textContent = "Updated.";
    } catch (err) {
        console.error(err);
        statusEl.textContent = "Failed to load weather data.";
    }
}

/* -------- FETCH WEATHER (OpenWeather) -------- */
async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API failed: " + res.status);
    return await res.json();
}

/* -------- GET ICON BASED ON WEATHER -------- */
function getWeatherIcon(cond) {
    cond = cond.toLowerCase();

    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunder"))
        return animatedRainIcon();

    if (cond.includes("clear") || cond.includes("sun"))
        return animatedSunIcon();

    if (cond.includes("cloud"))
        return `<span style="font-size:32px;">☁️</span>`;

    return `<span style="font-size:32px;">🌍</span>`;
}

/* -------- ICON TEMPLATES -------- */

function animatedSunIcon() {
    return `
        <div class="sun">
            <div class="sun-core"></div>
            <div class="sun-rays"></div>
        </div>
    `;
}

function animatedRainIcon() {
    return `
        <div class="rain-icon">
            <div class="rain-cloud">🌧️</div>
            <div class="raindrop"></div>
            <div class="raindrop"></div>
            <div class="raindrop"></div>
        </div>
    `;
}

/* -------- UPDATE WEATHER CARD -------- */
function updateWeatherCard(data) {
    const condition = data.weather[0].description;
    const temp = data.main.temp;
    const cloud = data.clouds.all;

    document.getElementById("weather-icon").innerHTML = getWeatherIcon(condition);
    document.getElementById("weather-title-text").textContent = `${LOCATION} – ${condition}`;
    document.getElementById("weather-description").textContent = `Cloud cover: ${cloud}%`;
    document.getElementById("temperature").textContent = `Temperature: ${temp.toFixed(1)}°C`;
}

/* -------- UPDATE SOLAR CARD -------- */
function updateSolarCard(data) {
    const cloud = data.clouds.all;
    const card = document.getElementById("solar-card");

    let title, body, badgeClass, badgeText;

    if (cloud < 30) {
        title = "High solar output expected 🌞";
        body = "Great sunlight today. Switch to full solar mode.";
        badgeClass = "solar-high";
        badgeText = "Solar Boost Day";
    } else if (cloud < 60) {
        title = "Moderate solar output 🌤️";
        body = "Use solar normally but avoid heavy loads at night.";
        badgeClass = "solar-medium";
        badgeText = "Balanced Mode";
    } else {
        title = "Low solar output 🌧️";
        body = "Cloudy. Reduce AC usage and postpone heavy appliances.";
        badgeClass = "solar-low";
        badgeText = "Conservation Day";
    }

    card.innerHTML = `
        <div class="card-title">${title}</div>
        <div class="card-subtitle">${body}</div>
        <span class="solar-mode-badge ${badgeClass}">${badgeText}</span>
    `;
}
