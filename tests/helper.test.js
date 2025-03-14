import { prisma } from "@/utils/db";
import { numberRoomAvailable } from "@/utils/hotel";
import { count } from "console";
import { emitWarning } from "process";
import {sendNotification} from "@/utils/notification";

describe('Hotel Utils', () => {
  beforeEach(async () => {
    // Clear the database tables before each test
    await prisma.HotelBooking.deleteMany();
    await prisma.HotelRoomType.deleteMany({});
    await prisma.HotelManager.deleteMany();
    await prisma.Hotel.deleteMany({});
    await prisma.User.deleteMany({});
  });

  afterAll(async () => {
    await prisma.HotelBooking.deleteMany();
    await prisma.HotelRoomType.deleteMany({});
    await prisma.HotelManager.deleteMany();
    await prisma.Hotel.deleteMany({});
    await prisma.Notifications.deleteMany();
    await prisma.User.deleteMany({});
    // Disconnect Prisma client after all tests
    await prisma.$disconnect();
  });

  it('should return the number of available rooms for 1 room type', async () => {
    
    const hotelId = 1;
    const roomTypeId = 1;
    const checkInDate = new Date('2023-01-01');
    const checkOutDate = new Date('2023-01-10');

    const user = await prisma.User.create({
      data:{
        password: "password",
        firstName: "John",
        lastName: "Doe",
        email: "test@test.comdsads",
        phoneNumber: "222-222-2222"
      }
    });

    const userId = user.userId;

    // Insert mock data into the database
    await prisma.Hotel.create({
      data: {
        hotelId: hotelId,
        name: 'Test Hotel',
        address: 'Test Address',
        city: 'Test City',
        latitude: 0,
        longitude: 0,
        starRating: 5
      }
    });

    await prisma.HotelRoomType.create({
      data: {
        roomId: roomTypeId,
        hotelId: hotelId,
        roomType: 'Single',
        price: 100,
        numberAvailable: 10
      }
    });

    await prisma.HotelBooking.createMany({
      data: [
        { userId: userId, referenceId: "fasfasdssf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-02'), checkOut: new Date('2023-01-05'), bookingMade: new Date() },
        { userId: userId, referenceId: "fasfsddf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-03'), checkOut: new Date('2023-01-06'), bookingMade: new Date() },
        { userId: userId, referenceId: "fasfsf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-04'), checkOut: new Date('2023-01-07'), bookingMade: new Date() }
      ]
    });

    const availableRooms = await numberRoomAvailable(hotelId, checkInDate, checkOutDate);

    expect(availableRooms.rooms[1]).toBe(7); // 10 total rooms - 3 booked rooms
  });

  it('should return the number of available rooms for 2 room types', async () => {
    const hotelId = 1;
    const roomTypeId = 1;
    const roomTypeId2 = 2;
    const checkInDate = new Date('2023-01-01');
    const checkOutDate = new Date('2023-01-10');

    const user = await prisma.User.create({
      data:{
        password: "password",
        firstName: "John",
        lastName: "Doe",
        email: "test@test.comdsads",
        phoneNumber: "222-222-2222"
      }
    });
    
    const userId = user.userId;

    // Insert mock data into the database
    await prisma.hotel.create({
      data: {
        hotelId: hotelId,
        name: 'Test Hotel',
        address: 'Test Address',
        city: 'Test City',
        latitude: 0,
        longitude: 0,
        starRating: 5
      }
    });

    await prisma.HotelRoomType.create({
      data: {
        roomId: roomTypeId,
        hotelId: hotelId,
        roomType: 'Single',
        price: 100,
        numberAvailable: 10
      }
    });

    await prisma.HotelRoomType.create({
      data: {
        roomId: roomTypeId2,
        hotelId: hotelId,
        roomType: 'Twin',
        price: 100,
        numberAvailable: 10
      }
    });

    await prisma.HotelBooking.createMany({
      data: [
        { userId: userId, referenceId: "fasfasdssf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-02'), checkOut: new Date('2023-01-05'), bookingMade: new Date() },
        { userId: userId, referenceId: "fasfsddf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-03'), checkOut: new Date('2023-01-06'), bookingMade: new Date() },
        { userId: userId, referenceId: "fasfsf", roomId: roomTypeId, price:100, hotelId: hotelId, checkIn: new Date('2023-01-04'), checkOut: new Date('2023-01-07'), bookingMade: new Date() }
      ]
    });

    const availableRooms = await numberRoomAvailable(hotelId, checkInDate, checkOutDate);

    expect(availableRooms.rooms[1]).toBe(7); // 10 total rooms - 3 booked rooms
    expect(availableRooms.rooms[2]).toBe(10); // 10 total rooms - 0 booked rooms
  });

});

describe('Notification Utils', () => {
  beforeEach(async () => {
    // Clear the database tables before each test
    await prisma.Notifications.deleteMany();
    await prisma.User.deleteMany({});
  });

  afterAll(async () => {
    await prisma.HotelBooking.deleteMany();
    await prisma.HotelRoomType.deleteMany({});
    await prisma.HotelManager.deleteMany();
    await prisma.Hotel.deleteMany({});
    await prisma.Notifications.deleteMany();
    await prisma.User.deleteMany({});
    // Disconnect Prisma client after all tests
    await prisma.$disconnect();
  });

  it('Should send a notification', async () => {
    const message = "Test message";
    const type = "HOTEL_MANAGER";

    const user = await prisma.User.create({
      data:{
        password: "password",
        firstName: "John",
        lastName: "Doe",
        email: "test@test.comdsads",
        phoneNumber: "222-222-2222"
      }
    });
   
    await sendNotification(user.userId, message, type);
  });
});
