# Campus Emergency System

The React app deploys to GitHub Pages. GitHub Pages is static hosting and does not provide a backend server or shared database.

## GitHub-only demo

The app builds and runs on GitHub Pages without external credentials. In this mode:

- Demo users and emergency reports are stored in the current browser's local storage.
- Student reports and admin updates work in that browser, but are not shared with other devices or users.
- Demo login is not real authentication and must not be used for real emergency response or sensitive data.
- Account registration is unavailable in demo mode.

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Student | `musskan.verma@campus.edu` | `bca2026` |
| Student | `aman.gupta@campus.edu` | `bca2026` |
| Student | `ananya.dixit@campus.edu` | `bca2026` |
| Student | `ayush.srivastava@campus.edu` | `bca2026` |
| Administrator | `emergency.admin@campus.edu` | `admin123` |

These credentials are public demo credentials, not secure accounts.

## Deploy to GitHub Pages

Push to `main` or run **Deploy to GitHub Pages** in the Actions tab. The workflow installs the locked dependencies, type-checks and builds the project, then publishes the built files to the `gh-pages` branch. In repository **Settings → Pages**, set **Build and deployment → Source** to **Deploy from a branch**, then select `gh-pages` and `/(root)`.

The workflow uses demo mode if both Supabase secrets are absent. If you provide one Supabase secret, you must provide both:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Optional shared database

To use real accounts and shared PostgreSQL reports, create a Supabase project and run [`supabase/migrations/20261027000000_initial_schema.sql`](./supabase/migrations/20261027000000_initial_schema.sql) in its SQL Editor. Add both values above as GitHub Actions repository secrets. The migration applies row-level security; never expose a Supabase `service_role` key in the frontend.

Students can then create accounts in the app. Promote an administrator account from the Supabase SQL Editor, replacing the example email:

```sql
update public.profiles as p
set role = 'admin'
from auth.users as u
where p.id = u.id
  and u.email = 'admin@example.com';
```

## Local development

Copy `.env.example` to `.env.local`. Leave both values empty to use demo mode, or enter both Supabase values for a shared database. Run `npm ci`, `npm run dev`, `npm run lint`, and `npm run build`.
