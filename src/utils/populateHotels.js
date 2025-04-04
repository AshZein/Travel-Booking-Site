import { prisma } from "./db.js";

const hotels1000Path = "../../importData/hotels_100.json";

import fs from 'fs';

const hotelsData = JSON.parse(fs.readFileSync(new URL(hotels1000Path, import.meta.url), 'utf-8'));
const roomImgPaths = {
    double: [
        "images/hotel/room/double/double01.jpg",
        "images/hotel/room/double/double02.jpg",
        "images/hotel/room/double/double03.jpg",
        "images/hotel/room/double/double04.jpg",
        "images/hotel/room/double/double05.jpg"
    ],
    single: [
        "images/hotel/room/single/single01.jpg",
        "images/hotel/room/single/single02.jpg",
        "images/hotel/room/single/single03.jpg",
        "images/hotel/room/single/single04.jpg"
    ],
    suite: [
        "images/hotel/room/suite/suite01.jpg",
        "images/hotel/room/suite/suite02.jpg",
        "images/hotel/room/suite/suite03.jpg",
        "images/hotel/room/suite/suite04.jpg",
        "images/hotel/room/suite/suite05.jpg"
    ]
};

const hotelImgPaths = [
    "images/hotel/itself/hotel01.jpg",
    "images/hotel/itself/hotel02.jpg",
    "images/hotel/itself/hotel03.jpg",
    "images/hotel/itself/hotel04.jpg",
    "images/hotel/itself/hotel05.jpg",
    "images/hotel/itself/hotel06.jpg",
    "images/hotel/itself/hotel07.jpg",
    "images/hotel/itself/hotel08.jpg"
];

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

        // add hotel image
        const hotelImageData = {
            hotelId: createdHotel.hotelId,
            image: hotelImgPaths[Math.floor(Math.random() * hotelImgPaths.length)],
        };
        await prisma.hotelImage.create({
            data: hotelImageData,
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
                    roomId: createdRoom.roomId,
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