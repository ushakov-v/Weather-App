import { setupAutocomplete, hideSuggestionsOnClickOutside } from './autocomplete.js';
import { getWeather } from './weather.js';
import { initMap, showCityOnMap, getCityFromCoords } from './map.js';
import { loadSavedCities, saveCity, updateSavedCitiesList } from './storage.js';

// DOM-элементы
const cityInput = document.getElementById('cityInput');
const suggestionsList = document.getElementById('suggestions');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const getLocationBtn = document.getElementById('getLocationBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const savedCitiesList = document.getElementById('savedCitiesList');

// API-ключи
const OPENWEATHER_API_KEY = 'a11827db6666953bc3904f81cc8c6713';
const DADATA_API_KEY = 'c2380d3b39b2a07f9c58e9caadafbdb14268cc49';
const YANDEX_API_KEY = '5894a96f-2697-4c61-9091-d71cef6c9ff5';

// Глобальный массив сохраненных городов
let savedCities = loadSavedCities();

// Инициализация карты
let myMap;
initMap((map) => {
    myMap = map;
});

// Создаем обертку для getWeather с обновлением savedCities
const wrappedGetWeather = async (city, coords = null) => {
    const updatedCities = await getWeather(city, OPENWEATHER_API_KEY, weatherInfo, errorMessage, myMap, showCityOnMap, saveCity, savedCities, savedCitiesList, cityInput, coords);
    if (updatedCities) {
        savedCities = updatedCities; // Обновляем глобальный массив
    }
};

// Инициализация списка сохраненных городов
updateSavedCitiesList(savedCities, savedCitiesList, cityInput, wrappedGetWeather);

// Обработчики событий
cityInput.addEventListener('input', () => setupAutocomplete(cityInput, suggestionsList, wrappedGetWeather, DADATA_API_KEY));
hideSuggestionsOnClickOutside(cityInput, suggestionsList);

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        wrappedGetWeather(city);
    }
});

getLocationBtn.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        errorMessage.innerHTML = 'Определение местоположения...';
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const city = await getCityFromCoords([latitude, longitude], errorMessage);
                if (city) {
                    cityInput.value = city;
                    await wrappedGetWeather(city, [latitude, longitude]);
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage.innerHTML = 'Разрешение на геолокацию отклонено';
                    weatherInfo.innerHTML = '';
                    myMap.geoObjects.removeAll();
                } else {
                    errorMessage.innerHTML = 'Не удалось определить местоположение';
                    weatherInfo.innerHTML = '';
                    myMap.geoObjects.removeAll();
                }
            }
        );
    } else {
        errorMessage.innerHTML = 'Геолокация не поддерживается вашим браузером';
        weatherInfo.innerHTML = '';
        myMap.geoObjects.removeAll();
    }
});
