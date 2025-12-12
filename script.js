const API_KEY = "57ec129981c8b6b53277873917a03a52";
const LOCATION = "Kuala Lumpur";

let currentRecommendationText = "";

document.addEventListener("DOMContentLoaded", loadWeatherAndSolar);

async function loadWeatherAndSolar() {
    const status = document.getElementById("status");
    status.textContent = "Loading weather...";

    try {
        const data = await fetchWeather();
        updateWeatherCard(data);
        updateSolarCard(data);
        status.textContent = "Updated.";
    } catch (e) {
        console.error(e);
        status.textContent = "Failed to load weather data.";
    }
}

async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    return res.json();
}

/* ---------- ICON LOGIC ---------- */
function getWeatherIcon(cond) {
    cond = cond.toLowerCase();

    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("thunder"))
        return animatedRainIcon();

    if (cond.includes("clear") || cond.includes("sun"))
        return animatedSunIcon();

    if (cond.includes("cloud"))
        return `<span style="font-size:26px;">☁️</span>`;

    return `<span style="font-size:26px;">🌍</span>`;
}

function animatedSunIcon() {
    return `
        <div class="sun">
            <div class="sun-rays"></div>
            <div class="sun-core"></div>
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

/* ---------- WEATHER CARD ---------- */
function updateWeatherCard(data) {
    const condition = data.weather[0].description;
    const temp = data.main.temp;
    const cloud = data.clouds.all;

    document.getElementById("weather-icon").innerHTML = getWeatherIcon(condition);
    document.getElementById("weather-title-text").textContent = `${LOCATION} – ${condition}`;
    document.getElementById("weather-description").textContent = `Cloud cover: ${cloud}%`;
    document.getElementById("temperature").textContent = `Temperature: ${temp.toFixed(1)}°C`;
}

/* ---------- SOLAR RECOMMENDATION ---------- */
function updateSolarCard(data) {
    const cloud = data.clouds.all;
    const card = document.getElementById("solar-card");

    let title, body, badge, cls;

    if (cloud < 30) {
        title = "High solar output expected";
        body = "Great sunlight today. Switch to full solar mode.";
        badge = "Solar Boost Day";
        cls = "solar-high";
    } else if (cloud < 60) {
        title = "Moderate solar output expected";
        body = "Use solar normally and avoid heavy loads at night.";
        badge = "Balanced Mode";
        cls = "solar-medium";
    } else {
        title = "Low solar output expected";
        body = "Reduce AC usage and postpone heavy appliances.";
        badge = "Conservation Day";
        cls = "solar-low";
    }

    currentRecommendationText = `${title}. ${body}`;

    card.innerHTML = `
        <div class="card-title">${title}</div>
        <div class="card-subtitle">${body}</div>
        <span class="solar-mode-badge ${cls}">${badge}</span>
    `;
}

/* ---------- TEXT TO SPEECH ---------- */
function speakRecommendation() {
    if (!currentRecommendationText) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(currentRecommendationText);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
