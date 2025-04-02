import { prisma } from "./db.js";

const hotels1000Path = "../../importData/hotels_1000.json";

import fs from 'fs';

const hotelsData = JSON.parse(fs.readFileSync(new URL(hotels1000Path, import.meta.url), 'utf-8'));

export async function fillHotel() {
    // Iterate over the keys of the hotelsData object (e.g., hotel1, hotel2, ...)
    for (let hotelKey of Object.keys(hotelsData)) {
        const hotel = hotelsData[hotelKey]; // Access the hotel object

        // Create hotel entry
        const hotelData = {
            name: hotel.hotelInfo.name,
            address: hotel.hotelInfo.address,
            city: hotel.hotelInfo.city.toLowerCase(),
            country: hotel.hotelInfo.country.toLowerCase(),
            latitude: hotel.hotelInfo.latitude,
            longitude: hotel.hotelInfo.longitude,
            starRating: hotel.hotelInfo.starRating,
        };

        const createdHotel = await prisma.hotel.create({
            data: hotelData,
        });

        // Create manager entry
        const managerData = { userId: 1, hotelId: createdHotel.hotelId };

        await prisma.hotelManager.create({
            data: managerData,
        });

        // Create hotel rooms
        for (let room of hotel.hotelRoomTypes) {
            // Create room entry
            const roomData = {
                hotelId: createdHotel.hotelId,
                roomType: room.roomType,
                price: room.price,
                numberAvailable: room.numberAvailable,
            };

            const createdRoom = await prisma.hotelRoomType.create({
                data: roomData,
            });

            // Add room amenities
            for (let amenity of room.amenities) {
                const amenityData = {
                    roomId: createdRoom.roomId,
                    amenity: amenity,
                };
                await prisma.roomAmenity.create({
                    data: amenityData,
                });
            }
        }
    }
}