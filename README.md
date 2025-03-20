# PROA Weather Station Map Application

This project consists of two main components:

1. Backend API (NestJS)
2. Frontend React Application

## Backend API

The backend API is built using NestJS and provides endpoints for:

- Weather station data (with optional state filtering)
- Latest measurements for each weather station

The application uses SQLite as its database, which is automatically created and seeded with data from CSV files when the application starts for the first time.

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run start:dev
   ```

The server will automatically:

- Create a SQLite database file (`weather_stations.sqlite`)
- Import data from CSV files in the `data` directory
- Start the API server on `http://localhost:3000`

## Server

### Development Mode

```bash
cd server
npm install
npm run start:dev
```

### Production Mode

```bash
cd server
npm install
npm run start:prod
```

## Frontend Application

The frontend is built using React and provides:

- Interactive map display using Mapbox
- Weather station markers
- Popup information for each station
- State-based filtering
- Latest measurements display

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:

   ```bash
   cp env-example .env
   ```

4. Add your Mapbox access token to the `.env` file:

   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_access_token_here
   ```

   You can get an access token from [Mapbox Console](https://console.mapbox.com/)

5. Start the development server:

   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Data Structure

The application uses the following CSV files in the `server/data` directory:

- `weather_stations.csv`: Contains weather station information
- `variables.csv`: Contains variable definitions
- `data_{id}.csv`: Contains measurement data for each station

The data is automatically imported into the SQLite database when the server starts for the first time.
