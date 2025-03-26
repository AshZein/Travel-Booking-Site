import { fillAirport, fillCity } from './populateAirportCity.js';
import { fillHotel } from './populateHotels.js';
import { prisma } from "./db.js";
import { emptyDatabase } from './emptyDatabase.js';



async function createAdmingUser() {
    const admin = await prisma.user.create({
        data: {
            userId: 1,
            password: "123",
            firstName: "hotel",
            lastName: "admin",
            email: "hoteladmin@admin.com",
            phoneNumber: "1234567890",
        }
    });

    console.log('Created admin user:', admin);
}

async function run() {
    await emptyDatabase();

    console.log('Starting to populate airports and cities...');
    await fillAirport();
    console.log('Finished populating airports.');
    await fillCity();
    console.log('Finished populating cities.');

    console.log("created admin user");
    createAdmingUser();

    console.log('Starting to populate hotels...');
    await fillHotel();
    console.log('Finished populating hotels.');
}

run().catch(error => {
    console.error('Error running populate script:', error);
});