/*
  Warnings:

  - A unique constraint covering the columns `[bookingReference]` on the table `FlightBooking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Itinerary" (
    "itineraryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "forwardFlightBookingRef" TEXT NOT NULL,
    "returnFlightBookingRef" TEXT NOT NULL,
    "hotelBookingRef" TEXT NOT NULL,
    CONSTRAINT "Itinerary_forwardFlightBookingRef_fkey" FOREIGN KEY ("forwardFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_returnFlightBookingRef_fkey" FOREIGN KEY ("returnFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_hotelBookingRef_fkey" FOREIGN KEY ("hotelBookingRef") REFERENCES "HotelBooking" ("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FlightBooking_bookingReference_key" ON "FlightBooking"("bookingReference");
