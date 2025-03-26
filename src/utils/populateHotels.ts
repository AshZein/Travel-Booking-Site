import { prisma } from "@/utils/db";


const hotels100Path = "../../importData/hotels_100.json";
const hotels1000Path = "../../importData/hotels_1000.json";

const hotelImagesPath = "../../importData/hotelImages";
const hotelRoomImagePath = "../../importData/hotelRoomImages";

const hotelsData = require(hotels1000Path);

export async function fillHotel(){
    for (let hotel of hotelsData){
        // create hotel entry
        const hotelData = {
            name: hotel.hotelInfo.name,
            address: hotel.hotelInfo.address,
            city: hotel.hotelInfo.city,
            country: hotel.hotelInfo.country,
            latitude: hotel.hotelInfo.latitude,
            longitude: hotel.hotelInfo.longitude,
            starRating: hotel.hotelInfo.starRating,
        }

        const createdHotel = await prisma.hotel.create({
            data: hotelData
        });
        // create manager entry
        const managerData = {userId: 1, hotelId: createdHotel.hotelId};
    
        const createdManager = await prisma.hotelManager.create({
            data: managerData
        });

        for (let room of hotel.hotelRoomTypes){
            // create room entry
            const roomData = {
                hotelId: createdHotel.hotelId,
                roomType: room.roomType,
                price: room.price,
                numberAvailable: room.roomCapacity,
            };

            const createdRoom = await prisma.hotelRoomType.create({
                data: roomData
            });

            // add room amenities
            for (let amenity of room.amenities){
                const amenityData = {
                    roomId: createdRoom.roomId,
                    amenity: amenity
                }
                await prisma.roomAmenity.create({
                    data: amenityData
                });
            }
        }
    }

}