# GLT Client Portal (MERN)

A MERN rewrite of the GLT client portal prototype: campaign overview, hub network (map/list/photo views),
verification reports, booking & payments, and a concerns/ticketing flow — backed by MongoDB via Express,
served to a React (Vite) frontend.

Login/OTP is intentionally left out for now. The app opens straight into the dashboard; auth can be added
back in later (e.g. a `/login` route gating the `Layout` in `client/src/App.jsx`).

## Stack

- **Backend**: Node + Express + Mongoose (`server/`)
- **Frontend**: React + Vite + react-router (`client/`)
- **DB**: MongoDB (local `mongod` or Atlas)

## Prerequisites

- Node.js 18+ and npm (not installed in this environment — install from nodejs.org)
- MongoDB running locally on `mongodb://127.0.0.1:27017`, or a `MONGODB_URI` pointing at Atlas

## Setup

```bash
# from the repo root
npm install          # installs "concurrently", used by the root dev script
npm run install:all  # installs server + client dependencies

# copy env file and adjust if needed
copy server\.env.example server\.env

# seed the 50 demo hubs into MongoDB
npm run seed
```

## Run

```bash
# from the repo root — starts API on :5050 and Vite dev server on :5173 (proxies /api to :5050)
npm run dev
```

Then open http://localhost:5173.

Or run each side separately:

```bash
npm run server   # API on :5050
npm run client   # Vite on :5173
```

## API

- `GET  /api/campaign` — campaign metadata + computed stats (verified/pending/flagged/footfall/open tickets)
- `GET  /api/hubs?status=&category=&q=` — list hubs, optionally filtered
- `GET  /api/hubs/:hubId` — single hub
- `GET  /api/reports` — the 3 milestone reports with computed row counts
- `GET  /api/reports/:index` — one report with its hub rows
- `GET  /api/tickets` — concern tickets, newest first
- `POST /api/tickets` — open a ticket `{ hubId, hubName, type, note }`
- `DELETE /api/tickets` — clear all tickets

## Notes

- Hub "photos" are deterministic placeholder SVG art (`client/src/components/ShelfArt.jsx`), seeded per hub —
  swap this out once real field photo uploads exist.
- Campaign/report milestone data is static demo config in `server/data/campaign.js`; hub data is seeded from
  `server/data/hubsSeed.js` into MongoDB and served from there.
- This environment doesn't have Node.js installed, so the app hasn't been run/tested end-to-end here — verify
  it with the setup steps above once Node and MongoDB are available.
