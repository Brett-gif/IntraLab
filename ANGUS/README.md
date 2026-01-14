# LabBridge

LabBridge is a hackathon MVP that translates messy wet-lab and dry-lab updates into dual-audience handoffs and keeps a shared project timeline.

## Setup

1) Create a Supabase project
2) Run the SQL schema
   - Open the Supabase SQL editor
   - Paste `supabase/schema.sql`
3) Configure environment variables (required)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GOOGLE_API_KEY=...
```

4) Install dependencies

```
npm install
```

5) Run locally

```
npm run dev
```

## Routes

- `/` Landing page
- `/login` Magic link sign-in
- `/app` Dashboard
- `/app/projects/[projectId]` Project timeline
- `/app/projects/[projectId]/new` New update
- `/app/updates/[updateId]` Update detail

## Gemini Output Validation

Gemini responses are parsed and validated with Zod to match the strict schema in `lib/schemas.ts`. Invalid responses mark updates as `error` and preserve the raw update.

## API

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/[projectId]`
- `POST /api/updates`
- `GET /api/projects/[projectId]/updates`
- `GET /api/updates/[updateId]`

## Seed (optional)

```
SUPABASE_SERVICE_ROLE_KEY=...
npm run seed
```

This is optional and not required for deploys.

## Deploy on Vercel

1) Push the repo to GitHub.
2) Import the repo into Vercel.
3) Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_API_KEY`
4) Deploy. The app uses server-side Gemini calls and works on Vercel Node runtime.

## Deploy

Deploy on Vercel with the environment variables above.
