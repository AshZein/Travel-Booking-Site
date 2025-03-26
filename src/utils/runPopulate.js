import { fillAirport, fillCity } from './populateAirportCity.js';
import { prisma } from "@/utils/db";

async function createAdmingUser() {
    prisma.User.delete({
        where: {
            userId: 1
        }});

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
    console.log('Starting to populate airports and cities...');
    await fillAirport();
    console.log('Finished populating airports.');
    await fillCity();
    console.log('Finished populating cities.');
}

run().catch(error => {
    console.error('Error running populate script:', error);
});