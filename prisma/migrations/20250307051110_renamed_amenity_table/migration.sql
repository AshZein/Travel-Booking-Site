/*
  Warnings:

  - You are about to drop the `RoomAmenity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RoomAmenity";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Amenity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotelId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,
    CONSTRAINT "Amenity_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("hotelId") ON DELETE RESTRICT ON UPDATE CASCADE
);
