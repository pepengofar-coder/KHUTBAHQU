import { useState, useEffect } from 'react';
import './WeatherWidget.css';

const JAKARTA_COORD = { lat: -6.2088, lon: 106.8456 }; // Default: Jakarta

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState('Memuat lokasi...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async (lat, lon, fallbackName = null) => {
    try {
      setLoading(true);
      setError(false);

      // Fetch Weather (Open-Meteo)
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
      const weatherData = await weatherRes.json();

      // Fetch Location Name (Nominatim)
      let locName = fallbackName;
      if (!locName) {
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
          const geoData = await geoRes.json();
          locName = geoData.address?.city || geoData.address?.town || geoData.address?.county || geoData.address?.state || 'Lokasi Anda';
        } catch {
          locName = 'Lokasi Anda';
        }
      }

      setWeather(weatherData.current_weather);
      setLocationName(locName);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    setError(false);
    
    if (!navigator.geolocation) {
      // Geolocation not supported, fallback to Jakarta
      fetchWeather(JAKARTA_COORD.lat, JAKARTA_COORD.lon, 'Jakarta');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation error/denied:', err.message);
        // Fallback to Jakarta if denied
        fetchWeather(JAKARTA_COORD.lat, JAKARTA_COORD.lon, 'Jakarta');
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWeatherInfo = (code) => {
    // WMO Weather interpretation codes
    if (code === 0) return { label: 'Cerah', icon: '☀️' };
    if (code === 1 || code === 2) return { label: 'Cerah Berawan', icon: '⛅' };
    if (code === 3) return { label: 'Berawan', icon: '☁️' };
    if (code === 45 || code === 48) return { label: 'Berkabut', icon: '🌫️' };
    if (code >= 51 && code <= 55) return { label: 'Gerimis', icon: '🌦️' };
    if (code >= 61 && code <= 65) return { label: 'Hujan', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { label: 'Bersalju', icon: '❄️' };
    if (code >= 80 && code <= 82) return { label: 'Hujan Lebat', icon: '🌧️' };
    if (code >= 95) return { label: 'Badai Petir', icon: '⛈️' };
    return { label: 'Cerah', icon: '☀️' };
  };

  if (loading) {
    return (
      <div className="weather-widget">
        <div className="weather-widget__loading">
          <span style={{ fontSize: '2rem' }}>⏳</span>
          <p>Mengecek cuaca...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-widget">
        <div className="weather-widget__error">
          <span style={{ fontSize: '2rem' }}>⚠️</span>
          <p>Gagal memuat cuaca</p>
          <button className="weather-widget__btn" onClick={getUserLocation}>Coba Lagi</button>
        </div>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weathercode);

  return (
    <div className="weather-widget">
      <span className="weather-widget__bg-icon">{info.icon}</span>
      <div className="weather-widget__content">
        <div className="weather-widget__location">
          <span>📍</span> {locationName}
        </div>
        <div className="weather-widget__temp">
          {Math.round(weather.temperature)}°C
        </div>
        <div className="weather-widget__desc">
          <span>{info.icon}</span> {info.label}
        </div>
      </div>
    </div>
  );
}
