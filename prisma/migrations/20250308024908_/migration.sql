/*
  Warnings:

  - A unique constraint covering the columns `[userId,hotelId]` on the table `HotelManager` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HotelManager_userId_hotelId_key" ON "HotelManager"("userId", "hotelId");
