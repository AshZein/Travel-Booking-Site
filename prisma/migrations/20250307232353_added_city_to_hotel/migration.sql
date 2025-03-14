/*
  Warnings:

  - Added the required column `country` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
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
INSERT INTO "new_Hotel" ("address", "city", "hotelId", "latitude", "logo", "longitude", "name", "starRating") SELECT "address", "city", "hotelId", "latitude", "logo", "longitude", "name", "starRating" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_name_address_key" ON "Hotel"("name", "address");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
