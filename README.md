# IIT Palakkad IAR Cell Alumni Portal

This repository contains the web portal for the **International Relations and Alumni (IAR) Cell at IIT Palakkad**. It supports alumni registration and profiles, the alumni directory, events, and administration features.

## Official repository

The official IAR Cell repository is [IARCELL/ALUMNI_WEBSITE](https://github.com/IARCELL/ALUMNI_WEBSITE). Contributions should be made through a fork and pull request so the IAR Cell maintainers can review them.

## Technology

- Frontend: React, Vite, and Firebase Authentication
- Backend: Node.js, Express, Firebase Admin SDK, and Firestore

## Prerequisites

- Git
- Node.js 20 or newer and npm
- Access to the project Firebase configuration for features that need Firebase

Check your versions with:

```bash
node --version
npm --version
git --version
```

## Fork and clone

1. Sign in to GitHub and open the [official repository](https://github.com/IARCELL/ALUMNI_WEBSITE).
2. Select **Fork** to create your own copy under your GitHub account.
3. Clone your fork, replacing `<your-github-username>` with your account name:

```bash
git clone https://github.com/<your-github-username>/ALUMNI_WEBSITE.git
cd ALUMNI_WEBSITE
```

4. Add the official repository as `upstream`, then create a branch for your work:

```bash
git remote add upstream https://github.com/IARCELL/ALUMNI_WEBSITE.git
git switch -c feature/describe-your-change
```

To bring your fork up to date later:

```bash
git fetch upstream
git switch main
git merge upstream/main
git push origin main
```

If the default branch is not named `main`, substitute the branch shown on GitHub.

## Install dependencies

Install each part of the application from its own directory. There is no root-level start script.

```bash
cd Frontend
npm install
cd ../Backend
npm install
```

## Configure local development

### Backend Firebase credentials

The backend uses the Firebase Admin SDK. Local development requires a Firebase service-account JSON file for the authorized project:

1. Obtain a service-account key through the project administrator. Do not create or use a key for a project you are not authorized to access.
2. Save it as `Backend/firebase_authentication.json`.
3. Keep this file private. It is ignored by Git and must never be committed, uploaded to a public issue, or included in a pull request.

Create `Backend/.env` if you need to set a port or local mode:

```dotenv
NODE_ENV=development
PORT=5175
```

The backend defaults to port `5175`. In production, it expects the service-account JSON in the `FIREBASE_CONFIG` environment variable instead of a local key file.

### Frontend backend URL

The frontend uses the deployed backend URL as a fallback. For local development, create `Frontend/.env.local` and point it at your local backend:

```dotenv
VITE_BASE_URL=http://localhost:5175
```

If you use Google sign-in locally, configure an authorized Google OAuth client and add its client ID:

```dotenv
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Add `http://localhost:5173` to the OAuth client's authorized JavaScript origins. Frontend environment variables are included in the browser build, so never put service-account credentials, private keys, or other secrets in a `VITE_` variable.

The Firebase web app configuration is currently defined in `Frontend/src/firebase/firebaseConfig.js`. Firebase web config is client-side configuration; access control must be enforced by Firebase rules and backend authorization, not by hiding these values.

## Run the application

Start the backend and frontend in separate terminals.

**Terminal 1 — backend:**

```bash
cd Backend
npm run dev
```

The API should start at `http://localhost:5175`.

**Terminal 2 — frontend:**

```bash
cd Frontend
npm run dev
```

Vite prints the local frontend address, normally `http://localhost:5173`. Open that address in your browser. Keep both terminals running while using the local app.

## Useful commands

Run from `Frontend`:

```bash
npm run build   # create a production build in Frontend/dist
npm run preview # serve the production build locally
npm run lint    # run ESLint
```

Run from `Backend`:

```bash
npm run dev     # start the Express API
```

## Security and access control notes

- Do not commit `.env` files or Firebase service-account keys.
- Registration must be backed by institute-approved Campus ID records; user-entered IDs alone do not prove affiliation.
- Admin dashboard and alumni directory access must be authorized by the backend and Firestore rules. A frontend route guard by itself is not an access-control boundary.
- Changes to Firebase rules or administrator access should be reviewed by the IAR Cell project maintainers before deployment.

## Contributing

Make changes on a topic branch in your fork, install and run the relevant part of the app, and commit only the files needed for your change. Push the branch to your fork and open a pull request against `IARCELL/ALUMNI_WEBSITE`, explaining what changed and how it was checked. Never include private user data, credentials, or production secrets in a contribution.
