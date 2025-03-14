import { prisma } from "@/utils/db";

//  find the number of rooms available for each room type in a hotel
// hotelId: id in hotel table
// checkin: date of checkin in, a Date object
// checkout: date of checkout, a Date object
// returns object with the following properties:
// hotelId: id of the hotel
// checkin: date of checkin
// checkout: date of checkout
// rooms: object with room type id as key and number of rooms available as value
// example return value:
// {
//     hotelId: 1,
//     checkin: '2022-01-01',
//     checkout: '2022-01-03',
//     rooms: {
//         1: 5,
//         2: 3
//     }
// }
export async function numberRoomAvailable(hotelId, checkIn, checkOut, keepZero=true){
    // retrieve all room types for the hotel
    const roomTypes = await prisma.HotelRoomType.findMany({
        where :{
            hotelId
        }
    });

    // retrieve all bookings for the hotel between checkin and checkout
    const bookings = await prisma.HotelBooking.groupBy({
        by: ['roomId'],
        where: {
            hotelId,
            bookingCanceled: false,
            AND: [
                {
                    checkIn: {
                        lte: checkOut
                    }
                },
                {
                    checkOut: {
                        gte: checkIn
                    }
                }
            ]
        },
        _count: {
            roomId: true,
            
        }
    });

    const roomsAvailable = {};
    roomsAvailable.hotelId = hotelId;
    roomsAvailable.checkin = checkIn;
    roomsAvailable.checkout = checkOut;
    roomsAvailable.rooms = {};

    // initialize number of rooms available for each room type
    roomTypes.forEach(roomType => {
        roomsAvailable.rooms[roomType.roomId] = roomType.numberAvailable;
    });

    // subtract number of rooms taken from number of rooms available
    bookings.forEach(booking => {
        const roomType = roomTypes.find(roomType => roomType.roomId === booking.roomId).roomId;
        if(roomsAvailable.rooms[roomType] !== undefined){
            roomsAvailable.rooms[roomType] -= booking._count.roomId;
        }
    });

    if (!keepZero){
        for (const roomType in roomsAvailable.rooms){
            if (roomsAvailable.rooms[roomType] <= 0){
                delete roomsAvailable.rooms[roomType];
            }
        }
    }

    return roomsAvailable;
}

export async function generateHotelRef(){
    let lastId = await prisma.LastGeneratedId.findUnique({
        where: {
            type: 'hotel'
        }
      });
      // if no lastId, create one
      if (!lastId){
        lastId = await prisma.LastGeneratedId.create({
            data: {
                type: 'hotel',
                value: 1
            }
        });
      }

    const idString = lastId.value.toString().padStart(5, '0');

    await prisma.LastGeneratedId.update({
        where: {
            type: 'hotel'
        },
        data: {
            value: lastId.value + 1
        }
      });

    return `HOTEL-${idString}`;
}