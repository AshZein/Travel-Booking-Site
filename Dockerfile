# Use an Alpine-based Node.js image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install necessary dependencies for Alpine
RUN apk add --no-cache \
    bash \
    curl \
    openssl \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code, including the public folder
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Use a lightweight Alpine-based Node.js image for production
FROM node:18-alpine AS runner

# Set the working directory
WORKDIR /app

# Install necessary runtime dependencies
RUN apk add --no-cache \
    bash \
    curl \
    openssl \
    libc6-compat

# Copy the built app and dependencies from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]