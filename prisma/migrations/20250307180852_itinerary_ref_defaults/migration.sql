-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Itinerary" (
    "itineraryId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "forwardFlightBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    "returnFlightBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    "hotelBookingRef" TEXT NOT NULL DEFAULT 'No Booking',
    CONSTRAINT "Itinerary_forwardFlightBookingRef_fkey" FOREIGN KEY ("forwardFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_returnFlightBookingRef_fkey" FOREIGN KEY ("returnFlightBookingRef") REFERENCES "FlightBooking" ("bookingReference") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Itinerary_hotelBookingRef_fkey" FOREIGN KEY ("hotelBookingRef") REFERENCES "HotelBooking" ("referenceId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Itinerary" ("forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "returnFlightBookingRef") SELECT "forwardFlightBookingRef", "hotelBookingRef", "itineraryId", "returnFlightBookingRef" FROM "Itinerary";
DROP TABLE "Itinerary";
ALTER TABLE "new_Itinerary" RENAME TO "Itinerary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
