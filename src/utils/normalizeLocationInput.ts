export function normalizeLocationInput(input: string): string {
    // Check if the input contains an airport code in parentheses (e.g., "Toronto Pearson International Airport (YYZ), Canada")
    const airportCodeMatch = input.match(/\(([^)]+)\)/);
    if (airportCodeMatch) {
        return airportCodeMatch[1]; // Return the airport code (e.g., "YYZ")
    }

    // Check if the input contains a city and country (e.g., "Toronto, Canada")
    const cityMatch = input.split(',')[0];
    if (cityMatch) {
        return cityMatch.trim(); // Return the city name (e.g., "Toronto")
    }

    // Otherwise, return the input as is (e.g., "toronto")
    return input.trim();
}