# Development stage
FROM node:24-alpine AS development
WORKDIR /app

# Create a non-root user and group with specific UID/GID
RUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser

COPY package*.json ./
RUN npm install
COPY . .

# Change ownership of application files to the non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["npm", "run", "dev"]



# Production stage
FROM node:24-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 appgroup && adduser -D -u 1001 -G appgroup appuser

COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["node", "dist/server.js"]
