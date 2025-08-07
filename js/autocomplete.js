export async function setupAutocomplete(cityInput, suggestionsList, getWeather, DADATA_API_KEY) {
    const query = cityInput.value.trim();
    if (query.length < 3) {
        suggestionsList.innerHTML = '';
        return;
    }

    try {
        const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Token ${DADATA_API_KEY}`
            },
            body: JSON.stringify({
                query,
                count: 5,
                restrict_value: true,
                locations: [{ city: null }],
                from_bound: { value: "city" },
                to_bound: { value: "city" }
            })
        });

        if (!response.ok) throw new Error('Ошибка при получении предложений');
        const data = await response.json();
        suggestionsList.innerHTML = '';
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion.data.city || suggestion.value;
            li.addEventListener('click', () => {
                cityInput.value = suggestion.data.city || suggestion.value;
                suggestionsList.innerHTML = '';
                getWeather(suggestion.data.city || suggestion.value);
            });
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        suggestionsList.innerHTML = '';
        document.getElementById('errorMessage').innerHTML = 'Ошибка при загрузке предложений городов';
    }
}

export function hideSuggestionsOnClickOutside(cityInput, suggestionsList) {
    document.addEventListener('click', (event) => {
        if (!suggestionsList.contains(event.target) && event.target !== cityInput) {
            suggestionsList.innerHTML = '';
        }
    });
}