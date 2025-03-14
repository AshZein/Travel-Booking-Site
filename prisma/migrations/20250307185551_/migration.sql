/*
  Warnings:

  - Added the required column `itineraryRef` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Itinerary" (
    "itineraryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "forwardFlightBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    "returnFlightBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    "hotelBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    "itineraryRef" TEXT NOT NULL,
    CONSTRAINT "Itinerary_forwardFlightBookingRef_fkey" FOREIGN KEY ("forwardFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_returnFlightBookingRef_fkey" FOREIGN KEY ("returnFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_hotelBookingRef_fkey" FOREIGN KEY ("hotelBookingRef") REFERENCES "HotelBooking" ("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Itinerary" ("forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "returnFlightBookingRef", "userId") SELECT "forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "returnFlightBookingRef", "userId" FROM "Itinerary";
DROP TABLE "Itinerary";
ALTER TABLE "new_Itinerary" RENAME TO "Itinerary";
CREATE UNIQUE INDEX "Itinerary_itineraryRef_key" ON "Itinerary"("itineraryRef");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
