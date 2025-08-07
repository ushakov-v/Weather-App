export function initMap(callback) {
    ymaps.ready(() => {
        const map = new ymaps.Map('map', {
            center: [55.7558, 37.6173],
            zoom: 10
        });
        callback(map);
    });
}

export async function showCityOnMap(city, coords, myMap) {
    let coordinates = coords;
    if (!coordinates) {
        const res = await ymaps.geocode(city, { results: 1 });
        const geoObject = res.geoObjects.get(0);
        if (geoObject) {
            coordinates = geoObject.geometry.getCoordinates();
        } else {
            throw new Error('Не удалось найти координаты города');
        }
    }

    myMap.geoObjects.removeAll();
    myMap.setCenter(coordinates, 10);
    myMap.geoObjects.add(new ymaps.Placemark(coordinates, { balloonContent: `Город: ${city}` }));
}

export async function getCityFromCoords(coords, errorMessage) {
    try {
        const res = await ymaps.geocode(coords, { kind: 'locality', results: 1 });
        const city = res.geoObjects.get(0)?.properties.get('name');
        if (!city) {
            throw new Error('Не удалось определить город');
        }
        return city;
    } catch (error) {
        errorMessage.innerHTML = 'Ошибка при определении города';
        return null;
    }
}