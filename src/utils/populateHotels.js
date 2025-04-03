import { prisma } from "./db.js";

const hotels1000Path = "../../importData/hotels_100.json";

import fs from 'fs';

const hotelsData = JSON.parse(fs.readFileSync(new URL(hotels1000Path, import.meta.url), 'utf-8'));
const roomImgPaths = {
    double: [
        "images/hotel/room/double/Altair-QQ-1-LG-1920x1281.jpg",
        "images/hotel/room/double/e8c50ce285b0a5730a23db4e1459cd3b.jpg",
        "images/hotel/room/double/empire-hotel-nyc-superior-room-two-double-beds-01-high-res-2020_wide.jpg",
        "images/hotel/room/double/images (1).jpeg",
        "images/hotel/room/double/images.jpeg"
    ],
    single: [
        "images/hotel/room/single/download.jpeg",
        "images/hotel/room/single/images.jpeg",
        "images/hotel/room/single/king-blue-hotel-toronto-royal-suite-1-bed-02_wide.jpg",
        "images/hotel/room/single/Single-bed-room-YWCA_Hotel_Vancouver.jpg"
    ],
    suite: [
        "images/hotel/room/suite/images (1).jpeg",
        "images/hotel/room/suite/images (2).jpeg",
        "images/hotel/room/suite/images (3).jpeg",
        "images/hotel/room/suite/images.jpeg",
        "images/hotel/room/suite/istockphoto-1452529483-612x612.jpg"
    ]
};

const hotelImgPaths = [
    "images/hotel/itself/13.png",
    "images/hotel/itself/14.png",
    "images/hotel/itself/360_F_869975348_HXGi8LdxOP4wGZJkd4NruWYNW2IRrdVZ.jpg",
    "images/hotel/itself/default.png",
    "images/hotel/itself/DSCN4976.jpg",
    "images/hotel/itself/images.jpeg",
    "images/hotel/itself/IMG_3679-1440x1440.jpg",
    "images/hotel/itself/Toronto_-_ON_-_Royal_York_Hotel.jpg"
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