const input = document.getElementById('cityInput');
const button = document.getElementById('searchBtn');
const display = document.getElementById('weatherDisplay');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearHistory');

window.onload = loadHistory;


button.onclick = () => searchWeather();

input.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWeather();
});


async function searchWeather() {
    const city = input.value.trim();
    if (!city) return;

    display.innerHTML = "<p>Loading...</p>";

    try {
        
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
        );
        const geoData = await geoRes.json();

        if (!geoData.results) throw Error("City not found");

        const { latitude, longitude, name, country } = geoData.results[0];

        
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`
        );
        const weatherData = await weatherRes.json();

        
        display.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p style="font-size: 2rem;">${Math.round(weatherData.current.temperature_2m)}°C</p>
            <p>🌤️ Current Weather</p>
            <p>💨 Wind: ${weatherData.current.wind_speed_10m} km/h</p>
        `;

        saveHistory(city);

    } catch (err) {
        display.innerHTML = `<p class="error">${err.message}</p>`;
    }
}


function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        loadHistory();
    }
}


function loadHistory() {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

    historyList.innerHTML = history.map(city =>
        `<li onclick="searchFromHistory('${city}')">${city}</li>`
    ).join('');
}

function searchFromHistory(city) {
    input.value = city;
    searchWeather();
}

clearBtn.onclick = () => {
    localStorage.removeItem('weatherHistory');
    loadHistory();
};