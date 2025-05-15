export const fetchWeatherData = async (city) => {
  try {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
    const data = await res.json();

    if (data.error) {
      console.error('Weather API error:', data.error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
};


export const fetchWeatherForecast = async (city) => {
  try {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=8`);
    const data = await res.json();

    if (data.error) {
      console.error('Forecast API error:', data.error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
};


export const fetchWeatherHourly = async (city) => {
  try {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`);
    const data = await res.json();

    if (data.error) {
      console.error('Hourly API error:', data.error.message);
      return null;
    }

    return data.forecast.forecastday[0].hour;
  } catch (err) {
    console.error('Fetch failed:', err);
    return null;
  }
};
