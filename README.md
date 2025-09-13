# HTN2025_
Hack the North Project

## Project Overview
A course section monitoring and hold management system built with React/TypeScript frontend and FastAPI backend.

## Architecture

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

## Features
- Real-time course section monitoring
- 2-minute hold system for available seats
- Watchlist management
- Server-sent events for live updates
- Development-friendly authentication
