-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL DEFAULT 'default.jpg',
    "phoneNumber" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotelId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'default.jpg',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "starRating" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "HotelManager" (
    "managerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    CONSTRAINT "HotelManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HotelManager_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotelImage" (
    "imageId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    CONSTRAINT "HotelImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotelRoomType" (
    "roomId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "roomType" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "numberAvailable" INTEGER NOT NULL,
    CONSTRAINT "HotelRoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomImage" (
    "imageId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    CONSTRAINT "RoomImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,
    CONSTRAINT "Amenity_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomAmenity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,
    CONSTRAINT "RoomAmenity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotelBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME NOT NULL,
    "bookingMade" DATETIME NOT NULL,
    "bookingCanceled" BOOLEAN NOT NULL DEFAULT false,
    "canceledDate" DATETIME,
    CONSTRAINT "HotelBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HotelBooking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HotelBooking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlightBooking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "bookingMade" DATETIME NOT NULL,
    "bookingCanceled" BOOLEAN NOT NULL DEFAULT false,
    "canceledDate" DATETIME,
    CONSTRAINT "FlightBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "itineraryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "forwardFlightBookingRef" TEXT,
    "returnFlightBookingRef" TEXT,
    "hotelBookingRef" TEXT,
    "itineraryRef" TEXT NOT NULL,
    CONSTRAINT "Itinerary_forwardFlightBookingRef_fkey" FOREIGN KEY ("forwardFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_returnFlightBookingRef_fkey" FOREIGN KEY ("returnFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_hotelBookingRef_fkey" FOREIGN KEY ("hotelBookingRef") REFERENCES "HotelBooking" ("referenceId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LastGeneratedId" (
    "type" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_name_address_key" ON "Hotel"("name", "address");

-- CreateIndex
CREATE UNIQUE INDEX "HotelManager_userId_hotelId_key" ON "HotelManager"("userId", "hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "HotelRoomType_hotelId_roomType_key" ON "HotelRoomType"("hotelId", "roomType");

-- CreateIndex
CREATE UNIQUE INDEX "HotelBooking_referenceId_key" ON "HotelBooking"("referenceId");

-- CreateIndex
CREATE UNIQUE INDEX "FlightBooking_bookingReference_key" ON "FlightBooking"("bookingReference");

-- CreateIndex
CREATE UNIQUE INDEX "Itinerary_itineraryRef_key" ON "Itinerary"("itineraryRef");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_city_country_name_key" ON "Airport"("city", "country", "name");

-- CreateIndex
CREATE UNIQUE INDEX "City_city_country_key" ON "City"("city", "country");
