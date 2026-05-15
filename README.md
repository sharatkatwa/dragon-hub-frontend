# DragonHub Frontend

DragonHub is a React + Vite frontend for a developer community platform. It lets users discover developers, browse projects and blogs, create their own posts, manage their profile, and interact with content through likes.

The app is built with React, React Router, Redux Toolkit, Axios, React Hook Form, Tailwind CSS, and a reusable frosted-glass design system.

## Features

- Authentication UI for login and registration
- Protected routes for profile, new project, new blog, and edit pages
- Discover page powered by backend data
- Public projects page with search and filters
- Public blogs page with search and filters
- Markdown rendering for blog details
- Developer listing and public developer profile pages
- Personal profile page with editable profile details
- User project and blog management from the profile page
- Reusable cards, form inputs, skeletons, empty states, toast system, and navigation components
- Responsive navbar with mobile drawer
- Vercel SPA routing support through `vercel.json`

## Tech Stack

- React 19
- Vite
- React Router
- Redux Toolkit
- React Redux
- Axios
- React Hook Form
- Tailwind CSS
- Lucide React
- React Markdown
- Remark GFM

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the client root:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint:

```bash
npm run lint
```

## Backend URL

For local development, use your local backend:

```env
VITE_API_URL=http://localhost:3000/api
```

For production on Vercel, set this environment variable in the Vercel dashboard:

```env
VITE_API_URL=https://dragon-hub-backend.onrender.com/api
```

The Axios instance lives in:

```txt
src/app/api/axios.js
```

It uses `withCredentials: true`, so the backend must allow credentials in CORS and must use production-safe cookie settings when deployed.

## Important Backend Requirements

Your backend should allow the frontend origin:

```js
origin: "https://your-frontend.vercel.app",
credentials: true
```

For auth cookies in production, use:

```js
sameSite: "none",
secure: true
```

Without these settings, login may work locally but fail after deployment.

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Discover page |
| `/login` | Login page |
| `/register` | Register page |
| `/profile` | Current user's profile dashboard |
| `/projects` | Public projects listing |
| `/projects/new` | Create project form |
| `/projects/:projectId` | Project details |
| `/projects/:projectId/edit` | Edit project form |
| `/blogs` | Public blogs listing |
| `/blogs/new` | Create blog form |
| `/blogs/:slug` | Blog details with markdown content |
| `/blogs/:slug/edit` | Edit blog form |
| `/users` | Developers listing |
| `/users/:userId` | Public developer portfolio |

## Project Structure

```txt
src/
  app/
    api/              Axios instance and interceptors
    components/       Reusable UI components
    features/         Redux slices, thunks, and feature hooks
    layouts/          App layout components
    pages/            Route pages
    routes/           React Router setup
    store/            Redux store
    styles/           Design tokens and global utilities
    utils/            Shared helper functions
```

## State Management Pattern

Each main feature follows the same structure:

```txt
features/
  auth/
    authSlice.js
    authThunks.js
    useAuth.js

  projects/
    projectSlice.js
    projectThunks.js
    useProjects.js

  blogs/
    blogSlice.js
    blogThunks.js
    useBlogs.js
```

Use the custom hooks in components instead of dispatching thunks directly whenever possible. For example:

```js
const { loadProjects, addProject, removeProject } = useProjects();
```

## Toast Usage

The custom toast system can be called from anywhere:

```js
import { toast } from "./src/app/components/toast/toast";

toast.success("Project created successfully.");
toast.error("Something went wrong.");
toast.warning("Please check the form.");
toast.info("Loading latest data.");
```

`Toaster` is mounted once in `main.jsx`.

## Deployment on Vercel

This project includes `vercel.json` so React Router pages work on refresh:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Use these Vercel settings:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_URL=https://dragon-hub-backend.onrender.com/api` |

## Notes

- The app expects the backend API to return projects, blogs, users, auth status, and refresh-token responses.
- Blog details support markdown content through `react-markdown` and `remark-gfm`.
- Protected pages depend on the auth bootstrap flow in `AuthBootstrap.jsx`.
- A large bundle warning may appear during build. The app still builds successfully; later this can be improved with route-level code splitting.
