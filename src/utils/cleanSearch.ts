async function searchSuggestCities(search: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/airport?query=${search}`);
        const data = await response.json();
        const cities = data.data.cities.map((city: { city: string; country: string }) => `${city.city}, ${city.country}`);
        return cities;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

async function searchSuggestAirports(search: string) {
    try {
        const response = await fetch(`/api/airport?query=${search}`);
        const data = await response.json();
        const airports = data.data.airports.map((airport: { name: string; code: string; country: string }) => `${airport.name} (${airport.code}), ${airport.country}`);
        return airports;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

export { searchSuggestAirports, searchSuggestCities };