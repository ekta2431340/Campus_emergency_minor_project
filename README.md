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

GitHub Pages hosts the frontend; **Supabase stores the shared database**. To enable it for this repository:

1. In your Supabase project, open **SQL Editor**, paste the contents of [`supabase/migrations/20261027000000_initial_schema.sql`](./supabase/migrations/20261027000000_initial_schema.sql), and run it. This creates the tables and registration trigger.
2. In GitHub, open this repository's **Settings → Secrets and variables → Actions → New repository secret**. Add:
   - `VITE_SUPABASE_URL`: the Project URL from Supabase **Project Settings → API**.
   - `VITE_SUPABASE_ANON_KEY`: the public anon/publishable key from Supabase **Project Settings → API**. Do not use the `service_role` key.
3. In GitHub **Actions**, run **Deploy to GitHub Pages** (or push a commit to `main`). The workflow builds the app with Supabase enabled and publishes it.
4. Open the deployed site and register a student account. With email confirmation enabled, confirm the email before signing in.

### Where to see saved data

In Supabase, open **Table Editor**:

- `auth.users` (under **Authentication → Users**) holds the authentication account and email. Passwords are handled by Supabase Auth and are not stored as readable passwords in the app tables.
- `public.profiles` holds the account's app profile: user id, username, full name, role, and optional student details.
- `public.emergency_reports` holds submitted emergency reports.

On registration, Supabase Auth creates the auth user. The migration's database trigger automatically inserts the corresponding `public.profiles` row using the submitted signup details. The profile's id references the auth user id. A new user does not create an emergency report; a separate report is added to `public.emergency_reports` only when they submit one. Row-level security policies restrict access to these tables.

To confirm setup, register a test account and check **Authentication → Users** and **Table Editor → profiles**. Then submit a test report and check **Table Editor → emergency_reports**. If the deployed app still behaves like the demo, verify both Actions secrets are saved and rerun the deployment.

Students can then create accounts in the app. Promote an administrator account from the Supabase SQL Editor, replacing the example email:

```sql
update public.profiles as p
set role = 'admin'
from auth.users as u
where p.id = u.id
  and u.email = 'admin@example.com';
```

## Run locally with Flask and SQLite

The local full-stack setup uses the existing `campus_emergency.db` file with a Flask API. New registrations are stored in the `users` table with hashed passwords. Reports are stored in `emergency_reports`. The database is on this computer at the project root; it is not the GitHub Pages database.

1. Copy `.env.example` to `.env.local` if `.env.local` does not already exist. This selects the local Flask API mode.
2. Set `FLASK_ADMIN_REGISTRATION_CODE` in `.env.local` to a long, unique secret invite code. Share it only with trusted administrators.
3. Install Python dependencies once: `py -3 -m pip install -r requirements.txt`.
4. In a VS Code terminal, start the Flask API: `py -3 app.py`.
5. In a second terminal, start the React app: `npm.cmd run dev`.
6. Open `http://localhost:3000/`. Choose **Administrator → New administrator? Register with an invite code** to register before signing in. New student accounts require a phone number in international format (for example, `+919876543210`). No email or SMS OTP is used.
7. Open `http://localhost:3000/database.html` in another tab to view registered users and report counts. It refreshes every two seconds and never displays passwords.
8. Run `py -3 check_db.py` to see table names, columns, and counts without exposing stored values. To inspect records directly, open `campus_emergency.db` using a SQLite viewer in VS Code; never display the `users.password` column.

Admin registration is available before sign-in using the invite code configured in `FLASK_ADMIN_REGISTRATION_CODE`; the Flask API validates the code and stores passwords as hashes. Signed-in administrators can also use **Register New Admin** on the dashboard.

The frontend talks to Flask through Vite's `/api` proxy. `.env.local` selects this local mode and is ignored by Git. Flask refuses to start if the existing database file or expected tables are missing; it will not silently create an empty database. It adds the columns needed for report status updates. New passwords are hashed before storage; legacy plaintext passwords are upgraded after the password check.

Run `npm.cmd run lint` and `npm.cmd run build` to validate the frontend.

## Hosting note

GitHub Pages is static hosting and cannot run Flask or access a SQLite file on your computer. The existing GitHub Pages deployment remains a browser demo unless you configure a separately hosted backend/database; the optional Supabase instructions above are one such hosted option. Do not upload a personal SQLite database containing user records to a public repository.
