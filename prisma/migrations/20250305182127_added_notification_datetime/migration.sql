-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Read" BOOLEAN NOT NULL DEFAULT false,
    "Type" TEXT NOT NULL,
    CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notifications" ("Read", "Type", "date", "id", "message", "userId") SELECT "Read", "Type", "date", "id", "message", "userId" FROM "Notifications";
DROP TABLE "Notifications";
ALTER TABLE "new_Notifications" RENAME TO "Notifications";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
