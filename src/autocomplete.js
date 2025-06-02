async function getCitySuggestions(prefix) {
    const response = await fetch('/cities.json');
    const cities = await response.json();

    return cities.filter(city =>
        city.city.toLowerCase().startsWith(prefix.toLowerCase())
    );
}

export default getCitySuggestions;