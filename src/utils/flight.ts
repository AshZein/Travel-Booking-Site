import { Flight } from '@/types/flight';

function dateSplitter(dateString: string, dateCache: { [key: string]: { [key: string]: string } }) {
    if (dateCache[dateString]) {
        return dateCache[dateString];
    }

    const pieces: { [key: string]: string } = {};

    const splitDate = dateString.split('T');
    if (splitDate.length !== 2) {
        console.error('Invalid date format:', dateString);
        return pieces;
    }

    const [datePart, timePart] = splitDate;
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    pieces.day = day;
    pieces.month = monthNames[parseInt(month) - 1];
    pieces.monthNumeric = month;
    pieces.year = year;
    pieces.hour = hour;
    pieces.minute = minute;

    dateCache[dateString] = pieces;
    return pieces;
}

function totalFlightCost(flights: Flight[]) {
    return flights.reduce((total, flight) => total + flight.price, 0);
}

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
    } catch (error) {
        console.error('Booking failed:', error);
    }
}

export { totalFlightCost, dateSplitter };