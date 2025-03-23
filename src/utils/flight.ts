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

export { totalFlightCost, dateSplitter };