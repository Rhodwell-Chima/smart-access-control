# Smart Access Control Frontend

A React + Vite admin dashboard for managing access control operations, users, roles, access points, and audit logs.

This frontend integrates with the Django REST Framework backend for the Smart Access Control system and uses a modern admin-console layout with protected routes and a secure login flow.

## Features implemented

- Dashboard overview with summary cards and recent access activity
- User management with search, activation/deactivation, and delete workflows
- Role and access point management with assignment mapping
- Log viewer with pagination and date-based filtering
- Status badges for access events and admin actions
- Modern dark admin UI consistent across all pages
- Protected routes that require authentication
- Admin-only login flow with approved credentials
- Session-based login state with visible admin indicator and logout

## Tech stack

- React 19
- Vite
- Bootstrap 5
- React Router
- Axios
- Custom CSS admin design system

## Current authentication setup

The app currently uses a restricted admin login flow.

Approved credentials:

- Email: Regaclipbeats@gmail.com
- Password: 12345678

Only this account can access the protected application pages. All non-login routes are protected and redirect unauthenticated users back to the sign-in screen.

## Route protection

The app guards these routes:

- /dashboard
- /logs
- /users
- /users/new
- /users/:userId/edit
- /roles
- /home
- /add
- /update
- /delete

Unauthenticated users are redirected to /.

## API integration

The frontend is designed around the backend API contract for:

- health checks
- metrics summary
- users
- roles
- access points
- logs
- admin actions

The API layer is centralized in src/utils/api.js and normalizes backend responses to support the UI reliably.

## Project structure

- src/App.jsx — dashboard overview
- src/main.jsx — router and protected route configuration
- src/routes — page-level views for logs, users, roles, and sign-in
- src/components — shared UI components
- src/utils/api.js — API wrapper and request handling
- src/utils/auth.js — session validation and persistence
- src/App.css — global dashboard/admin styling
- src/signin.css — login screen styling

## Running locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Notes

- This project currently uses a hardcoded admin credential for local development and controlled access.
- The backend auth contract can later be swapped in without changing the UI flow.
- The login and app shell were intentionally designed to match the same modern admin UX language used throughout the interface.

## Status

The frontend is in a functional admin dashboard state with route protection, live API-backed sections, polished layout, and a working local auth gate for the approved admin account.
