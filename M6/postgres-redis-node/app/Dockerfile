FROM node:24-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

USER appuser

EXPOSE 3000

CMD ["node", "index.js"]
