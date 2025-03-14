-- CreateTable
CREATE TABLE "RoomAmenity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roomId" INTEGER NOT NULL,
    "amenity" TEXT NOT NULL,
    CONSTRAINT "RoomAmenity_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoomType" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE
);
