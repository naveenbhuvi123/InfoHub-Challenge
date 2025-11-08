# InfoHub

Small full-stack demo: backend (Express) provides Weather, Currency and Quote endpoints and a Vite + React frontend consumes them.

## Contents

- `server/` — Express backend
- `client/` — Vite + React frontend

## Prerequisites

- Node.js (>= 18) and npm installed
- Windows PowerShell (commands below use PowerShell syntax)

## Environment variables

Create `server/.env` with the following values (example):

```
PORT=3001
WEATHER_API_KEY=your_openweathermap_api_key
EXCHANGE_API_KEY=your_exchangerate_api_key
```

Note: keep API keys secret. Do NOT commit `.env` to version control.

## Setup

Install dependencies for both server and client:

```powershell
# from project root
cd .\server
npm install
# in a separate terminal
cd ..\client
npm install
```

## Running locally (PowerShell)

Start the backend:

```powershell
cd .\server
# start directly
node server.js
# or (dev):
# npx nodemon server.js
```

Start the frontend (in another terminal):

```powershell
cd .\client
npm run dev
```

Vite normally serves the client at http://localhost:5173 (it will show the exact URL in the terminal). The client is configured to proxy `/api` requests to the backend (see `client/vite.config.js`).

## Default ports and proxy

- Backend: `PORT` (default 3001)
- Frontend (Vite): random dev port (commonly 5173)

Make sure `client/vite.config.js` proxy `target` matches the backend port, e.g. `http://localhost:3001`.

## API endpoints (for quick manual testing)

- GET /api/weather?city=Hyderabad
- GET /api/currency?amount=1
- GET /api/quote

Example (PowerShell using curl):

```powershell
curl "http://localhost:3001/api/weather?city=Hyderabad"
curl "http://localhost:3001/api/currency?amount=1"
curl "http://localhost:3001/api/quote"
```

## Troubleshooting

1. Port already in use error: `Error: listen EADDRINUSE`

Find process using a port and stop it:

```powershell
# find processes listening on port 3001
netstat -a -n -o | findstr ":3001"
# `PID` is in the last column; then kill it
taskkill /PID <pid> /F
```

2. Client requests to `/api` failing:

- Confirm `vite.config.js` has proxy pointing to the correct backend port.
- Confirm backend is running and shows the startup message `Server is running on http://localhost:<PORT>`.
- Open browser devtools Console / Network tab to see request/response errors.

3. Missing API key errors:

The server returns a 500 with a message like `Weather API key not found`. Ensure keys are in `server/.env` and the server was restarted after editing `.env`.

## Security notes

- Do not return API keys from the server to the client. The root route will indicate only whether keys are configured.
- Keep `.env` out of source control (add to `.gitignore`).

## Next steps / improvements

- Add unit tests for server endpoints.
- Add error handling/reporting for specific API failures.
- Add CORS restrictions if deploying to production.
