# Todo Canvas

A premium, interactive todo management system with a node-based canvas interface. Organize your tasks visually with projects, connections, and a state-of-the-art dark theme.

![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Stack](https://img.shields.io/badge/Frontend-Next.js-000000?style=flat-square)
![Stack](https://img.shields.io/badge/Canvas-React--Flow-8b5cf6?style=flat-square)
![Stack](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square)

## Key Features

- **Interactive Canvas**: Drag and drop tasks, connect them with edges, and zoom/pan to navigate.
- **Project Management**: Separate your life into distinct projects, each with its own canvas.
- **Undo/Redo**: Full history support (Ctrl+Z / Ctrl+Y) for todos, links, and movement.
- **Rich Aesthetics**: Vibrant dark mode with glassmorphism and smooth animations.
- **Modular Architecture**: Cleanly abstracted codebase with dedicated routers, services, and components.

## Project Structure

```bash
TO-DO/
├── backend/            # FastAPI Modular Backend
│   ├── routers/        # Feature-based API routes
│   ├── crud.py         # Database logic abstraction
│   ├── models.py       # SQLAlchemy models
│   ├── schemas.py      # Pydantic schemas
│   └── database.py     # Session management
├── frontend/           # Next.js + React Flow Frontend
│   ├── src/components/ # Modular UI components
│   ├── src/services/   # API communication (api.ts)
│   ├── src/hooks/      # Shared logic (useHistory.ts)
│   ├── src/types/      # Centralized TypeScript interfaces
│   └── src/app/        # App Router pages
└── docker-compose.yml  # One-click PostgreSQL setup
```

## Quick Start

### 1. Database (Docker)
Ensure you have Docker installed and running.

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start organizing!

## Canvas Controls

| Control | Action |
|---------|--------|
| **Scroll Wheel** | Zoom in/out |
| **Right-Click Drag** | Pan canvas |
| **Ctrl + Z** | Undo |
| **Ctrl + Y** | Redo |
| **Delete Key** | Remove selected items |
| **Shift + Drag** | Connect nodes |

## API Overview

| Area | Endpoint | Methods |
|------|----------|---------|
| **Projects** | `/projects` | GET, POST, DELETE |
| **Todos** | `/todos` | GET, POST, PUT, DELETE |
| **Links** | `/links` | GET, POST, DELETE |

## License
MIT
