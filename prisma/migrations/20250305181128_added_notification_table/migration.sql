-- CreateTable
CREATE TABLE "Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "Read" BOOLEAN NOT NULL,
    "Type" TEXT NOT NULL,
    CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
