#!/bin/bash

# assume that we are in the root directory of the project
DB_FILE="./dev/db"

if [ ! -f "$DB_FILE" ]; then
    echo "Database file does not exist. Creating database file..."
    touch "$DB_FILE"
    echo "Database file created at $DB_FILE"

    echo "Running Prisma generate..."
    npx prisma generate
    echo "Prisma generate completed."

    echo "Running Prisma migrate..."
    npx prisma migrate dev --name init
    echo "Prisma migrate completed."

else
    echo "Database file already exists at $DB_FILE"
fi

echo "Installing dependencies..."
npm install

echo "Populating the database with cities and airports..."
node src/utils/runPopulate.js
