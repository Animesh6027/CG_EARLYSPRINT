# FounderLink Angular Frontend

A starter Angular frontend for the FounderLink microservices workspace.

## Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. If you are connecting to the remote backend, make sure `frontend/src/environments/environment.ts` and `frontend/src/environments/environment.prod.ts` set `apiBaseUrl` to `https://backend.founderlink.online`.

3. Run the frontend:

```bash
npm start
```

The app uses direct backend requests to the configured `apiBaseUrl` for `/auth`, `/users`, `/startup`, `/investments`, `/teams`, `/messages`, `/notifications`, `/payments`, and `/wallets`.

## What is included

- `src/app/app.component.ts`: simple login screen and startup list viewer
- `src/app/services/api.service.ts`: wrapper for gateway API calls
- `proxy.conf.json`: local proxy to the gateway

## Notes

- This is a starter scaffold. You can extend it with routing, state management, and feature pages.
- The login form calls `/auth/login` and then loads `/startup`.
