# Use a glibc-based Node.js image
FROM node:18-slim AS builder

# Set the working directory
WORKDIR /app

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:18-slim AS runner

# Set the working directory
WORKDIR /app

# Install OpenSSL in the production image
RUN apt-get update && apt-get install -y openssl

# Copy the built app and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]