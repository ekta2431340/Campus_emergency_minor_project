# Campus Emergency System

The frontend is a Vite/React app deployed to GitHub Pages. Supabase provides email/password authentication, the shared PostgreSQL database, row-level security, and live report updates. GitHub Pages serves static files only; it does not run the database or a server.

## Configure Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [`supabase/migrations/20261027000000_initial_schema.sql`](./supabase/migrations/20261027000000_initial_schema.sql).
3. In **Authentication → URL Configuration**, set the Site URL to your Pages site (for this repository, `https://ekta2431340.github.io/Campus_emergency_minor_project/`) and add that URL to the redirect URL allow-list.
4. In **Authentication → Providers → Email**, enable email/password sign-in. Email confirmation can be enabled; if enabled, students must confirm their email before signing in.
5. Add these GitHub Actions repository secrets under **Settings → Secrets and variables → Actions**:
   - `VITE_SUPABASE_URL`: the project URL from **Project Settings → API**.
   - `VITE_SUPABASE_ANON_KEY`: the project's publishable/anon key. This key is intended for browser use; database access is restricted by the migration's row-level security policies.

Do not use or expose the `service_role` key in the frontend, GitHub Pages build, or repository.

## Create accounts

- Students select **Student Login → Create an account**. Their profile is created with the `student` role and cannot promote itself.
- Create the administrator's account through the student sign-up form, then promote that account from the Supabase SQL Editor. Replace the email with the administrator's verified email:

  ```sql
  update public.profiles as p
  set role = 'admin'
  from auth.users as u
  where p.id = u.id
    and u.email = 'admin@example.com';
  ```

- The user must sign out and back in after promotion. Admin access is enforced by database policies, not only by the dashboard UI.

## Deploy

Push to `main` or run **Deploy to GitHub Pages** from the Actions tab. The workflow installs the lockfile dependencies, checks the production build, and publishes the app. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source.

For local development, copy `.env.example` to `.env.local`, fill in the Supabase URL and anon key, then run:

```sh
npm ci
npm run dev
```

`npm run lint` runs the TypeScript check; `npm run build` creates the production bundle.

The checked-in `campus_emergency.db` and demo data are not used by the live application. Reports and user profiles are stored in Supabase and shared between signed-in users according to the database access policies.
