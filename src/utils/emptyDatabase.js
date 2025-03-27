import { prisma } from "./db.js";

export async function emptyDatabase() {
    try {
        console.log("Starting to empty the database...");

        // Delete all records from dependent tables first
        await prisma.roomAmenity.deleteMany();
        await prisma.roomImage.deleteMany();
        await prisma.hotelRoomType.deleteMany();
        await prisma.hotelImage.deleteMany();
        await prisma.amenity.deleteMany();
        await prisma.hotelManager.deleteMany();
        await prisma.hotelBooking.deleteMany();
        await prisma.flightBooking.deleteMany();
        await prisma.itinerary.deleteMany();
        await prisma.notifications.deleteMany();
        await prisma.hotel.deleteMany();
        await prisma.airport.deleteMany();
        await prisma.city.deleteMany();
        await prisma.user.deleteMany();

        console.log("Database emptied successfully.");
    } catch (error) {
        console.error("Error emptying the database:", error);
    }
}