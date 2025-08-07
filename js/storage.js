export function loadSavedCities() {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    if (savedCities.length > 5) {
        savedCities = savedCities.slice(0, 5);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
    return savedCities;
}

export function saveCity(city, savedCities) {
    if (!savedCities.includes(city)) {
        savedCities.unshift(city);
        if (savedCities.length > 5) {
            savedCities.pop();
        }
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

export function updateSavedCitiesList(savedCities, savedCitiesList, cityInput, getWeather) {
    savedCitiesList.innerHTML = '';
    savedCities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => {
            cityInput.value = city;

        });
        savedCitiesList.appendChild(li);
    });
}