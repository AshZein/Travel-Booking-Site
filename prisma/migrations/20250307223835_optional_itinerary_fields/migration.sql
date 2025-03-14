-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Itinerary" (
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
INSERT INTO "new_Itinerary" ("forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "itineraryRef", "returnFlightBookingRef", "userId") SELECT "forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "itineraryRef", "returnFlightBookingRef", "userId" FROM "Itinerary";
DROP TABLE "Itinerary";
ALTER TABLE "new_Itinerary" RENAME TO "Itinerary";
CREATE UNIQUE INDEX "Itinerary_itineraryRef_key" ON "Itinerary"("itineraryRef");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
