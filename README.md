# Identity Shift

A very simple personal gamified life operating system centered on
identity-based behavior change, built for one user first: Tim.

The central question of the app: **"Who am I becoming, and what evidence
did I produce today that proves it?"**

This is being built in phases per the product brief. See inline comments
in `src/types/models.ts`, `src/data/seed.ts`, and `src/lib/` for how the
brief's concepts map to code.

## Status

**Phase 1 — data model + Today screen.** See commit history / PR
description for the phase-by-phase build log.

## Stack

- Vite + React + TypeScript
- No backend yet — state persists to `localStorage` via `src/lib/storage.ts`,
  written as a small repository so it can be swapped for a real backend
  later without touching components.

## Run it

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm run lint      # oxlint
```
