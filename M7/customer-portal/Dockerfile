FROM --platform=linux/amd64 node:22-bullseye AS base
WORKDIR /app
COPY package*.json ./
# Install oxc-parser native binding explicitly
RUN npm install --save-dev @oxc-parser/binding-linux-x64-gnu lightningcss-linux-x64-gnu @rollup/rollup-linux-x64-gnu || true
RUN npm install
COPY . .

# --- Development Stage ---
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Build Stage ---
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# --- Production Stage ---
FROM --platform=linux/amd64 node:22-bullseye AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Copy only built output and minimal dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.output ./.output

EXPOSE 3000
USER node
CMD ["node", ".output/server/index.mjs"]
