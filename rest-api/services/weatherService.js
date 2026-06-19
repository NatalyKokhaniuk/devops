const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({
    stdTTL: 600
});

async function getWeather(city) {

    const key = `weather_${city}`;

    if (cache.has(key)) {
        return cache.get(key);
    }

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const response = await axios.get(url);

    const data = {
        city: response.data.name,
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        weather: response.data.weather[0].description
    };

    cache.set(key, data);

    return data;
}

module.exports = { getWeather };
