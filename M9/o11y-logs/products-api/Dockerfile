FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

COPY . .

EXPOSE 3000

# Run the application in development mode using ts-node
CMD ["npm", "run", "dev"]