import { fillAirport, fillCity } from './populateAirportCity.js';

async function run() {
    console.log('Starting to populate airports and cities...');
    await fillAirport();
    console.log('Finished populating airports.');
    await fillCity();
    console.log('Finished populating cities.');
}

run().catch(error => {
    console.error('Error running populate script:', error);
});