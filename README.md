# Mohit Ramesh — Portfolio

A Watch Dogs-inspired portfolio site with a boot sequence, click-to-enter gate,
and interactive main portfolio screen.

Built with [TanStack Start](https://tanstack.com/start), React, Tailwind CSS v4,
GSAP, Vite, and Nitro.

## Project status

The project is deployable. The production build for both supported deployment
targets has been verified:

- Vercel
- Render or another Node.js host

The Skills, Experience, Projects, and Contact sections currently use the
`ComingSoon` placeholder component. They are wired into the navigation but do
not yet contain final content.

## Requirements

- Node.js 22 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

To bind to a specific host, use the equals form so Vite receives the host
value correctly:

```bash
npm run dev -- --host=127.0.0.1
```

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build for the selected deployment target |
| `npm run build:dev` | Create a development-mode production build |
| `npm run preview` | Preview the generated build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the project with Prettier |

Before deploying, run:

```bash
npm run lint
npm run build
```

## Deployment

The `DEPLOY_TARGET` environment variable selects the Nitro preset in
`vite.config.ts`. Only `vercel` and `render` are accepted; the build fails
instead of producing an unsupported deployment bundle when the variable is
missing or invalid.

### Vercel

Set this environment variable in the Vercel project:

```text
DEPLOY_TARGET=vercel
```

Use `npm run build` as the build command. Nitro generates the Vercel output in
`.vercel/output`, which Vercel deploys automatically.

### Render or another Node.js host

Set:

```text
DEPLOY_TARGET=render
```

Configure the service with:

```text
Build command: npm run build
Start command: node .output/server/index.mjs
```

The service must use Node.js 22 or newer. Render's free tier may sleep after
inactivity, so the first request after a quiet period can be slower.

## Repository structure

```text
src/
  components/
    loading-screen/       Boot sequence
    entry-screen/         Click-to-enter gate
    main-screen/          Hero, navigation, About, and section content
    ui/                   Reusable UI primitives
  hooks/                  Shared React hooks
  lib/                    Utilities and SSR error handling
  routes/
    __root.tsx            HTML shell, metadata, 404, and error UI
    index.tsx             Loading -> entry -> main screen flow
  router.tsx              TanStack Router setup
  server.ts               SSR entry with friendly error responses
  start.ts                TanStack Start middleware and CSRF protection
  styles.css              Tailwind v4 styles and design tokens

vite.config.ts            Vite, TanStack Start, Tailwind, and Nitro setup
package.json              Scripts and dependencies
tsconfig.json             TypeScript compiler configuration
```

## Troubleshooting

### Production build says `DEPLOY_TARGET` is missing

Set the target before building. In PowerShell:

```powershell
$env:DEPLOY_TARGET = "vercel" # or "render"
npm run build
```

In Command Prompt:

```bat
set DEPLOY_TARGET=vercel
npm run build
```

Vercel and Render should define this variable in their project/service
environment settings, so their hosted builds do not need an extra command.

### The terminal closes immediately

Run the command from an existing PowerShell or Command Prompt window so the
error remains visible:

```bash
npm run dev
```

The expected output includes:

```text
Local: http://localhost:5173/
```

If port 5173 is already in use, stop the old process or choose another port:

```bash
npm run dev -- --port=5174
```

Do not add a bare `--host 127.0.0.1` argument in this project; use
`--host=127.0.0.1` instead.

### The build fails after dependency changes

Reinstall from the lockfile and retry:

```bash
Remove-Item -Recurse -Force node_modules
npm ci
npm run lint
npm run build
```

## Validation notes

The checked-in configuration currently passes `npm run lint` with no errors.
There are six non-blocking Fast Refresh warnings in shared UI primitive files.
The Vercel and Render Nitro production builds complete successfully.