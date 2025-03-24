import { Flight } from '@/types/flight';

async function bookFlights(firstName: string, lastName: string, email: string, passportNumber: string, flights: Flight[]) {
    console.log('Booking flights:', flights);

    const bookingData = {
        firstName,
        lastName,
        email,
        passportNumber,
        flightIds: flights.map(flight => flight.id),
    };

    try {
        const response = await fetch('http://localhost:3000/api/flight/booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Booking successful:', result);
        return result;
    } catch (error) {
        console.error('Booking failed:', error);
    }
}

export default bookFlights;