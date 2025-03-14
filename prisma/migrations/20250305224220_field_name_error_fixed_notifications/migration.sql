/*
  Warnings:

  - You are about to drop the column `Read` on the `Notifications` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `type` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notifications" ("date", "id", "message", "userId") SELECT "date", "id", "message", "userId" FROM "Notifications";
DROP TABLE "Notifications";
ALTER TABLE "new_Notifications" RENAME TO "Notifications";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
