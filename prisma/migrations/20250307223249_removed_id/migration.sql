/*
  Warnings:

  - The primary key for the `LastGeneratedId` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LastGeneratedId` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LastGeneratedId" (
    "type" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL
);
INSERT INTO "new_LastGeneratedId" ("type", "value") SELECT "type", "value" FROM "LastGeneratedId";
DROP TABLE "LastGeneratedId";
ALTER TABLE "new_LastGeneratedId" RENAME TO "LastGeneratedId";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
