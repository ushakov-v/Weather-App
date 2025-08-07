import { updateSavedCitiesList } from './storage.js';

export async function getWeather(city, OPENWEATHER_API_KEY, weatherInfo, errorMessage, myMap, showCityOnMap, saveCity, savedCities, savedCitiesList, cityInput, coords = null) {
    try {
        // Нормализация названия города
        const normalizedCity = city.trim().replace(/\s+/g, ' ');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ru`);
        if (!response.ok) throw new Error('Город не найден или ошибка API');
        const data = await response.json();

        // Отображение погоды
        weatherInfo.innerHTML = `
            <h3>Погода в г. ${normalizedCity}</h3>
            <p>Температура: ${data.main.temp}°C</p>
            <p>Ощущается как: ${data.main.feels_like}°C</p>
            <p>Влажность: ${data.main.humidity}%</p>
            <p>Скорость ветра: ${data.wind.speed} м/с</p>
            <p>Описание: ${data.weather[0].description}</p>
        `;
        errorMessage.innerHTML = '';

        // Отображение на карте
        await showCityOnMap(normalizedCity, coords, myMap);

        // Сохранение города и обновление списка
        saveCity(normalizedCity, savedCities);
        updateSavedCitiesList(savedCities, savedCitiesList, cityInput, getWeather);

        // Возвращаем обновленный массив savedCities
        return savedCities;
    } catch (error) {
        errorMessage.innerHTML = error.message;
        weatherInfo.innerHTML = '';
        myMap.geoObjects.removeAll();
        return savedCities;
    }
}