import { prisma } from "./db.js";

const hotels1000Path = "../../importData/hotels_1000.json";

import fs from 'fs';

const hotelsData = JSON.parse(fs.readFileSync(new URL(hotels1000Path, import.meta.url), 'utf-8'));
const roomImgPaths = {
    double: [
        "src/images/hotel/room/double/Altair-QQ-1-LG-1920x1281.jpg",
        "src/images/hotel/room/double/e8c50ce285b0a5730a23db4e1459cd3b.jpg",
        "src/images/hotel/room/double/empire-hotel-nyc-superior-room-two-double-beds-01-high-res-2020_wide.jpg",
        "src/images/hotel/room/double/images (1).jpeg",
        "src/images/hotel/room/double/images.jpeg"
    ],
    single: [
        "src/images/hotel/room/single/download.jpeg",
        "src/images/hotel/room/single/images.jpeg",
        "src/images/hotel/room/single/king-blue-hotel-toronto-royal-suite-1-bed-02_wide.jpg",
        "src/images/hotel/room/single/Single-bed-room-YWCA_Hotel_Vancouver.jpg"
    ],
    suite: [
        "src/images/hotel/room/suite/images (1).jpeg",
        "src/images/hotel/room/suite/images (2).jpeg",
        "src/images/hotel/room/suite/images (3).jpeg",
        "src/images/hotel/room/suite/images.jpeg",
        "src/images/hotel/room/suite/istockphoto-1452529483-612x612.jpg"
    ]
};

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

            
            // add room images
            for (let image of roomImgPaths[room.roomType]) {
                const imageData = {
                    hotelRoomTypeId: createdRoom.hotelRoomTypeId,
                    image: image,
                };
                await prisma.roomImage.create({
                    data: imageData,
                });
            }

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