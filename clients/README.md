# Clients — Namlo Rides

Scaffolded Vite + React + TypeScript project with Tailwind CSS.

Setup

```bash
cd clients
npm install
npm run dev
```

Build

```bash
npm run build
npm run preview
```

Notes

- Edit `tailwind.config.cjs` content paths if you add custom folders.

Project details

- Login using the hardcoded testing credentials:
- Rider: `intern@namlotechrider.com` / `namlo2026`
- Driver: `intern@namlotechdriver.com` / `namlo2026`
- After login you will land on the role-specific dashboard. Role cannot be switched from the header to keep sessions distinct.
- Real-time sync: Uses a browser `BroadcastChannel` for real-time message broadcasting between tabs (no custom backend). Optional cloud realtime SDK can be integrated later.
- Persistence: When a ride reaches a terminal state it is saved to a mock REST endpoint if `VITE_HISTORY_ENDPOINT` is set, otherwise saved to `localStorage`.
- Map: Uses OpenStreetMap (via `react-leaflet`) and defaults to Kathmandu center.

Environment

- Optional: set `VITE_HISTORY_ENDPOINT` in `.env` to a mock API endpoint (MockAPI, Beeceptor, etc.) to persist ride history remotely.

UI

- The UI uses yellow and light-gray as the primary theme colors and is responsive for mobile and desktop.
