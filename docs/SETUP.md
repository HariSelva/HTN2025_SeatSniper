# HTN2025 Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- AWS CLI configured (for DynamoDB and Kinesis)

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment variables:
   ```bash
   cp env.example .env
   ```

5. Start the development server:
   ```bash
   python main.py
   ```

The backend API will be available at `http://localhost:8000`.

## Development Workflow

1. Start both frontend and backend servers
2. Open `http://localhost:3000` in your browser
3. Use the development login to get started
4. Browse courses and manage your watchlist

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.
