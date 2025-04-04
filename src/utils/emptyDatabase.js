import { prisma } from "./db.js";

export async function emptyDatabase() {
    try {
        console.log("Starting to empty the database...");

        console.log("Deleting Room Amenities...");
        await prisma.roomAmenity.deleteMany(); // Depends on HotelRoomType
        console.log("Room Amenities deleted.");

        console.log("Deleting Room Images...");
        await prisma.roomImage.deleteMany(); // Depends on HotelRoomType
        console.log("Room Images deleted.");

        console.log("Deleting Hotel Bookings...");
        await prisma.hotelBooking.deleteMany(); // Depends on HotelRoomType
        console.log("Hotel Bookings deleted.");

        console.log("Deleting Hotel Room Types...");
        await prisma.hotelRoomType.deleteMany(); // Depends on Hotel
        console.log("Hotel Room Types deleted.");

        console.log("Deleting Hotel Images...");
        await prisma.hotelImage.deleteMany(); // Depends on Hotel
        console.log("Hotel Images deleted.");

        console.log("Deleting Amenities...");
        await prisma.amenity.deleteMany(); // Depends on Hotel
        console.log("Amenities deleted.");

        console.log("Deleting Hotel Managers...");
        await prisma.hotelManager.deleteMany(); // Depends on Hotel and User
        console.log("Hotel Managers deleted.");

        console.log("Deleting Flight Bookings...");
        await prisma.flightBooking.deleteMany(); // Depends on User
        console.log("Flight Bookings deleted.");

        console.log("Deleting Itineraries...");
        await prisma.itinerary.deleteMany(); // Depends on User, HotelBooking, and FlightBooking
        console.log("Itineraries deleted.");

        console.log("Deleting Notifications...");
        await prisma.notifications.deleteMany(); // Depends on User
        console.log("Notifications deleted.");

        console.log("Deleting Invoices...");
        await prisma.invoice.deleteMany(); // Depends on Itinerary and User
        console.log("Invoices deleted.");

        console.log("Deleting Hotels...");
        await prisma.hotel.deleteMany(); // Depends on City
        console.log("Hotels deleted.");

        console.log("Deleting Airports...");
        await prisma.airport.deleteMany(); // Independent
        console.log("Airports deleted.");

        console.log("Deleting Cities...");
        await prisma.city.deleteMany(); // Independent
        console.log("Cities deleted.");

        console.log("Deleting Users...");
        await prisma.user.deleteMany(); // Independent
        console.log("Users deleted.");

        console.log("Database emptied successfully.");
    } catch (error) {
        console.error("Error emptying the database:", error);
    }
}