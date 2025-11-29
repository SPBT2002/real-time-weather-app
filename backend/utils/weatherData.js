
require('dotenv').config();
const axios = require('axios');
const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY_OWM;

async function weatherData(cityCode) {

  const url = `${BASE_URL}${cityCode}&appid=${API_KEY}`;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error(`Error fetching weather for ${cityCode}:`, err.message);
    return null;
  }
}

module.exports = weatherData;
