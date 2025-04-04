-- CreateTable
CREATE TABLE "invoice" (
    "invoiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "hotelCost" REAL NOT NULL,
    "departureFlightCost" REAL NOT NULL,
    "returnFlightCost" REAL NOT NULL,
    CONSTRAINT "invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invoice_itineraryRef_fkey" FOREIGN KEY ("itineraryRef") REFERENCES "Itinerary" ("itineraryRef") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_itineraryRef_key" ON "invoice"("itineraryRef");
