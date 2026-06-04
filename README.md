# Quiniela FIFA World Cup 2026

A full-stack web application for managing a World Cup 2026 prediction pool (quiniela).

## Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Data:** JSON file database (`server/data/database.json`)

## Features

- World Cup themed UI with vertical navigation
- Teams, daily schedule, fair play standings, head-to-head comparison
- User predictions and leaderboard
- English / Spanish language support

## Getting Started

### Prerequisites

- Node.js 18+

### Install dependencies

```bash
npm run install:all
```

### Run development servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

### Build for production

```bash
npm run build
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Express API + database.json
└── package.json     # Root scripts
```

## License

MIT
