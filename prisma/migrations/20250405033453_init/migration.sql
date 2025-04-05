-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT NOT NULL DEFAULT 'default.jpg',
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "cleared" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hotel" (
    "hotelId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL DEFAULT 'default.jpg',
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "starRating" INTEGER NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("hotelId")
);

-- CreateTable
CREATE TABLE "HotelManager" (
    "managerId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,

    CONSTRAINT "HotelManager_pkey" PRIMARY KEY ("managerId")
);

-- CreateTable
CREATE TABLE "HotelImage" (
    "imageId" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,

    CONSTRAINT "HotelImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "HotelRoomType" (
    "roomId" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "numberAvailable" INTEGER NOT NULL,

    CONSTRAINT "HotelRoomType_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "RoomImage" (
    "imageId" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "RoomImage_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" SERIAL NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomAmenity" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,

    CONSTRAINT "RoomAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelBooking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "referenceId" TEXT NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "bookingMade" TIMESTAMP(3) NOT NULL,
    "bookingCanceled" BOOLEAN NOT NULL DEFAULT false,
    "canceledDate" TIMESTAMP(3),

    CONSTRAINT "HotelBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlightBooking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "bookingMade" TIMESTAMP(3) NOT NULL,
    "bookingCanceled" BOOLEAN NOT NULL DEFAULT false,
    "canceledDate" TIMESTAMP(3),

    CONSTRAINT "FlightBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "itineraryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "forwardFlightBookingRef" TEXT NOT NULL DEFAULT '',
    "returnFlightBookingRef" TEXT NOT NULL DEFAULT '',
    "hotelBookingRef" TEXT NOT NULL DEFAULT '',
    "itineraryRef" TEXT NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("itineraryId")
);

-- CreateTable
CREATE TABLE "invoice" (
    "invoiceId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "passportNum" TEXT NOT NULL DEFAULT '',
    "billingFirstName" TEXT NOT NULL,
    "billingLastName" TEXT NOT NULL,
    "billingStreet" TEXT NOT NULL,
    "billingCity" TEXT NOT NULL,
    "billingProvince" TEXT NOT NULL,
    "billingCountry" TEXT NOT NULL DEFAULT 'Canada',
    "billingPhoneNum" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "itineraryRef" TEXT NOT NULL,
    "hotelCost" DOUBLE PRECISION NOT NULL,
    "departureFlightCost" DOUBLE PRECISION NOT NULL,
    "returnFlightCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LastGeneratedId" (
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "LastGeneratedId_pkey" PRIMARY KEY ("type")
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
CREATE UNIQUE INDEX "invoice_itineraryRef_key" ON "invoice"("itineraryRef");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_code_key" ON "Airport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Airport_city_country_name_key" ON "Airport"("city", "country", "name");

-- CreateIndex
CREATE UNIQUE INDEX "City_city_country_key" ON "City"("city", "country");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelManager" ADD CONSTRAINT "HotelManager_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelManager" ADD CONSTRAINT "HotelManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelImage" ADD CONSTRAINT "HotelImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelRoomType" ADD CONSTRAINT "HotelRoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomImage" ADD CONSTRAINT "RoomImage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenity" ADD CONSTRAINT "Amenity_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAmenity" ADD CONSTRAINT "RoomAmenity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelBooking" ADD CONSTRAINT "HotelBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightBooking" ADD CONSTRAINT "FlightBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_itineraryRef_fkey" FOREIGN KEY ("itineraryRef") REFERENCES "Itinerary"("itineraryRef") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
