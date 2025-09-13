# HTN2025
Hack the North Project

## Project Overview
A course section monitoring and hold management system built with React/TypeScript frontend and FastAPI backend. This system allows users to monitor course section availability, manage watchlists, and claim temporary holds on available seats.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- AWS CLI configured (for DynamoDB and Kinesis)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HTN2025_
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   python main.py
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
HTN2025_/
├── README.md                    # This file
├── frontend/                    # React + TypeScript frontend
│   ├── package.json            # Dependencies and scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── index.html              # HTML entry point
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── layout/         # AppShell, NavBar
│   │   │   └── ui/             # SectionCard, WatchButton, HoldButton, StreamIndicator
│   │   ├── pages/              # LoginPage, CoursesPage, SectionsPage, WatchlistPage
│   │   ├── hooks/              # useStream hook
│   │   ├── store/              # Zustand store
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # API client
│   └── env.example             # Environment variables template
├── backend/                     # FastAPI backend
│   ├── main.py                 # FastAPI app entry point
│   ├── requirements.txt        # Python dependencies
│   ├── app/
│   │   └── routers/            # API route handlers
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── sections.py     # Course sections endpoints
│   │       ├── watchlist.py    # Watchlist management
│   │       ├── holds.py        # Hold management
│   │       ├── stream.py       # SSE streaming
│   │       └── tasks.py        # Background tasks
│   ├── core/
│   │   ├── deps.py             # Dependencies and settings
│   │   └── config.py           # Data models
│   └── env.example             # Environment variables template
├── shared/                      # Shared utilities
│   ├── types/                  # Common TypeScript types
│   └── utils/                  # Shared utilities
└── docs/                       # Documentation
    ├── SETUP.md               # Detailed setup instructions
    └── API.md                 # API documentation
```

## 🏗️ Architecture

### Frontend (React + TypeScript)

#### App Shell & Navigation
- **AppShell / NavBar** — Main layout component with navigation links, user menu, and realtime status display
- **StreamIndicator** — Visual indicator (green/yellow/red dot) showing SSE connection health

#### Pages
- **LoginPage** — Development login interface to obtain a userId
- **CoursesPage** — Browse and search through available courses; navigate to course details
- **SectionsPage** — List course sections with watch/unwatch functionality, claim holds, and open registrar links
- **WatchlistPage** — Centralized management of all watched sections

#### UI Components
- **SectionCard** — Displays section title, times, available seats/capacity, and action buttons
- **WatchButton** — Toggle watchlist status for a section
- **HoldButton** — Claims a 2-minute hold (enabled only when seats are available)
- **HoldBanner** — Sticky countdown display when holding a section
- **Toast / Notifications** — "Seat open" alerts with quick action to claim

#### State Management & Hooks
- **Store (Zustand/Context)** — Centralized state for user, sections, watchlist, and holds
- **useStream** — SSE client hook for subscribing to real-time events (seat_open, hold_taken, hold_expired)
- **useSections / useWatchlist / useHolds / useAuth** — Data fetching hooks with associated actions

#### API Utilities
- **api.ts** — HTTP client helpers for GET/POST/DELETE requests to backend endpoints
- **types.ts** — TypeScript DTOs for sections, events, and holds

---

### Backend (FastAPI, Local MVP)

#### App Entry & Configuration
- **main.py** — Application entry point, route wiring, CORS setup, and startup tasks (scraper + stream reader)
- **deps.py** — Settings/environment configuration and boto3 clients (DynamoDB + Streams)

#### API Routers (HTTP Endpoints)
- **/api/auth** — Development login endpoint (returns userId, sets cookie/JWT)
- **/api/sections** — Retrieve list of sections for a specific course
- **/api/watchlist** — Add/remove/list watched section IDs
- **/api/holds** — Claim and release 2-minute soft holds
- **/api/stream** — Server-Sent Events endpoint for real-time updates
- **/tasks/scrape** — Optional manual scrape trigger for demonstration purposes

## ✨ Features
- **Real-time monitoring** — Live updates on course section availability
- **2-minute hold system** — Temporary holds on available seats
- **Watchlist management** — Track multiple sections simultaneously
- **Server-sent events** — Real-time notifications for seat availability
- **Development-friendly** — Simple authentication for testing
- **Responsive design** — Works on desktop and mobile devices

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

**Backend:**
```bash
python main.py       # Start development server
```

### Key Technologies

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Zustand for state management
- React Router for navigation
- Axios for API calls

**Backend:**
- FastAPI for API framework
- Pydantic for data validation
- Boto3 for AWS services
- Server-Sent Events for real-time updates

## 📚 Documentation

- [Setup Guide](docs/SETUP.md) — Detailed setup instructions
- [API Documentation](docs/API.md) — Complete API reference
- [Interactive API Docs](http://localhost:8000/docs) — Swagger UI (when backend is running)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Notes

- This is a development MVP with mock data
- Real implementation would integrate with university course systems
- AWS services (DynamoDB, Kinesis) are configured but not required for local development
- All text is in English as per project requirements
