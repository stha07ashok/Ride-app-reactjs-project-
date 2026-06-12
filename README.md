# Namlo Rides

Namlo Rides is a real-time ride-sharing simulation platform built to demonstrate the interactive workflows between a Rider and a Driver. It is built entirely on the frontend using React, with real-time data synchronization powered by Firebase Realtime Database and persistent history via MockAPI.

---

## 🚀 Features & Capabilities

- **Secure Authentication:** Protected route workflows behind a clean login screen.
- **Dual-Role Simulation:** Separate, distinct dashboard views for Riders and Drivers. An evaluator can log in with test credentials and use two browser windows side-by-side to observe real-time interactions.
- **Real-Time Synchronization:** Ride requests, status updates, and cancellations are synced instantly between the Rider and Driver views using Firebase Realtime Database.
- **Interactive Maps:** Integrated with Leaflet/React-Leaflet and OpenStreetMap, defaulting gracefully to Kathmandu. Users can click the map to set pickup and dropoff coordinates, or use the geocoding service.
- **Persistent Ride History:** Completed and cancelled rides are securely logged to a cloud REST endpoint (MockAPI) to maintain a permanent ledger of all simulated trips.
- **100% Serverless Frontend:** The entire application logic, from routing to real-time syncing, operates directly between the React setup and the cloud APIs, with no custom backend required.

---

## 🏗️ Architecture & Technologies

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (responsive, mobile-first design)
- **Routing:** React Router v6
- **Maps:** `react-leaflet`, `leaflet`, OpenStreetMap Nominatim API for geocoding
- **Real-Time DB:** Firebase Realtime Database (`firebase` SDK)
- **REST API:** Standard `fetch` API communicating with MockAPI endpoints

### How the Ride Lifecycle Works
1. **Request:** The Rider selects a Pickup and Dropoff location and requests a ride. A record is pushed to Firebase with status `requested`.
2. **Accept:** The Driver dashboard observes `requested` rides. The driver can accept a ride, which updates the Firebase record status to `accepted` and assigns the driver's ID.
3. **Complete/Cancel:** Either party can terminate the ride. The Driver can `complete` the ride, or the Rider can `cancel` it. 
4. **History Persistence:** Upon reaching a terminal state (`completed` or `cancelled`), the ride is removed from the active view and securely POSTed to the MockAPI endpoint for long-term historical storage.

---

## 📁 Project Structure

The codebase is organized into a modular, highly scalable structure within the `src/` directory:

```text
src/
├── components/          # Reusable UI building blocks
│   ├── Header.tsx       # Main application navigation
│   ├── MapView.tsx      # Leaflet map integration wrapper
│   ├── MobileSidebar.tsx# Off-canvas menu for mobile navigation
│   ├── ProfilePanel.tsx # User profile popover
│   └── TripControls.tsx # Form controls for requesting/accepting rides
├── context/
│   └── AuthContext.tsx  # Global state for user sessions and login logic
├── hooks/
│   └── useTrip.ts       # Custom hook managing Firebase real-time listeners
├── pages/               # Full-screen route components
│   ├── Driver.tsx       # The Driver dashboard view
│   ├── Rider.tsx        # The Rider dashboard view
│   ├── History.tsx      # Table view for fetching MockAPI historical data
│   ├── Login.tsx        # Authentication page
│   └── Landing.tsx      # Public landing/marketing page
├── router/
│   └── routes.tsx       # React Router configuration and PrivateRoute wrapper
├── services/            # External API integrations
│   ├── firebase.ts      # Firebase initialization
│   ├── geocode.ts       # OpenStreetMap Nominatim geocoding helpers
│   └── history.ts       # MockAPI fetch/post logic
├── types/
│   └── types.ts         # Global TypeScript interfaces (Ride, User, Position)
├── App.tsx              # Root component and layout wrapper
└── main.tsx             # React DOM entry point
```

---

## ⚙️ Environment Setup

Before running the application, you must configure your environment variables. Duplicate `.env.example` to `.env` in the `clients` directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

VITE_MOCK_API_URL=https://your_endpoint.mockapi.io/ride/api/rides

VITE_TEST_EMAIL_RIDER=intern@namlotechrider.com
VITE_TEST_EMAIL_DRIVER=intern@namlotechdriver.com
VITE_TEST_PASSWORD=namlo2026
```

---

## 💻 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Testing the Simulation:**
   - Open `https://ride-app-reactjs-project.vercel.app/` in two separate browser windows side-by-side.
   - Log into Window A with the Rider credentials (`intern@namlotechrider.com`).
   - Log into Window B with the Driver credentials (`intern@namlotechdriver.com`).
   - Watch the interactions sync in real-time!
