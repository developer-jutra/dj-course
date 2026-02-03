# Products API

This is a simple Node.js application that provides a products API.

## Installation

To install the dependencies, run the following command:

```bash
npm install
```

## Available Scripts

### `npm run build`

This command also compiles the TypeScript code into JavaScript. Agents should run this to test compilation.

### `npm run dev`

This command starts the application in "watch mode".

### `npm start`

This command starts the application. It first builds the project and then starts the server.

## Environment Variables

The application requires the following environment variables to be set:

- `NODE_ENV`
- `SERVICE_NAME`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

You can create a `.env` file in the root of the project to store these variables. An example `.env` file is provided below:

```
NODE_ENV=development
SERVICE_NAME=products-api
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=products
```
