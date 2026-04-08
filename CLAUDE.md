# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack collections management app where users create custom collection types, define typed fields, and manage items within those collections.

- **Frontend**: `frontend/` — Nuxt 4 (Vue 3, TypeScript, Pinia, Axios, SCSS)
- **Backend**: `backend/` — NestJS 11 (TypeScript, TypeORM, PostgreSQL, JWT auth)

## Commands

### Frontend (`frontend/`)
```bash
npm run dev        # Dev server at http://localhost:3000
npm run build      # Production build
npm run generate   # Static site generation
```

### Backend (`backend/`)
```bash
npm run start:dev  # Dev server with watch mode at port 3001
npm run build      # Compile TypeScript
npm run start:prod # Run compiled build
npm run lint       # ESLint with auto-fix
npm run format     # Prettier format
npm run test       # Jest unit tests
npm run test:watch # Watch mode
npm run test:cov   # Coverage report
npm run test:e2e   # End-to-end tests
```

## Architecture

### Data Model

```
User
└── UserCollection (belongs to a CollectionType)
    ├── CollectionType
    │   └── CollectionTypeFields → Field (name, field_type: string|number|date|select|boolean)
    └── CollectionItems
        └── CollectionItemValues (one per field, stores the actual value)
```

### Backend (NestJS)

Three feature modules in `src/`:
- **`auth/`** — JWT login/register/logout. Uses `JwtAuthGuard` to protect routes. Credentials stored via bcrypt.
- **`collection/`** — Core module. Handles collection types, fields, user collections, items, and item values. Entities have complex relationships via TypeORM.
- **`strings/`** — Utility module for string data.

TypeORM entities are in `<module>/entities/`. DTOs with `class-validator` decorators live in `<module>/dto/`. Schema auto-syncs in development (`synchronize: true` in `app.module.ts`).

Database config is hardcoded in `app.module.ts`: PostgreSQL on `localhost:5432`, database `testdb`, user `postgres`, password `password`.

### Frontend (Nuxt 4)

- **Pages** in `app/pages/` use Pinia stores for all state and API calls
- **Pinia stores** in `app/store/`: `auth.ts`, `collection.ts`, `user.ts`, `modal.ts`
- **Axios** configured in `app/plugins/axios.ts` with request/response interceptors (JWT token injection, auth error handling)
- **Modals** are toggled via `modal.ts` store; modal components live in `app/components/modals/`
- SSR is disabled (`ssr: false` in `nuxt.config.ts`) — this is a pure SPA

Path alias `@/` maps to `app/` directory.

Prettier config (both sides): single quotes, trailing commas, no semicolons (frontend), 80-char line width.
