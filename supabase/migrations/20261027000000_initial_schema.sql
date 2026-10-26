create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9_.-]{3,32}$'),
  full_name text not null check (length(trim(full_name)) > 0),
  role text not null default 'student' check (role in ('student', 'admin')),
  roll_no text,
  department text,
  phone text,
  email text
);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_metadata jsonb := new.raw_user_meta_data;
  generated_username text;
begin
  generated_username := lower(coalesce(
    nullif(user_metadata ->> 'username', ''),
    split_part(new.email, '@', 1)
  ));

  insert into public.profiles (id, username, full_name, roll_no, department, email)
  values (
    new.id,
    generated_username,
    coalesce(nullif(trim(user_metadata ->> 'full_name'), ''), generated_username),
    nullif(trim(user_metadata ->> 'roll_no'), ''),
    nullif(trim(user_metadata ->> 'department'), ''),
    new.email
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.emergency_reports (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  student_username text not null,
  student_name text not null,
  roll_no text,
  category text not null check (category in ('Medical Emergency', 'Fire', 'Security Issue', 'Accident', 'Other')),
  location text not null check (length(trim(location)) > 0),
  description text not null check (length(trim(description)) > 0),
  priority text not null check (priority in ('High', 'Medium', 'Low')),
  status text not null default 'Submitted' check (status in ('Submitted', 'In Progress', 'Resolved')),
  matched_keywords text[] not null default '{}',
  classification_reason text not null,
  admin_notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_report_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_emergency_report_updated_at on public.emergency_reports;
create trigger set_emergency_report_updated_at
  before update on public.emergency_reports
  for each row execute function public.set_report_updated_at();

alter table public.profiles enable row level security;
alter table public.emergency_reports enable row level security;

revoke all on public.profiles from anon, authenticated;
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
revoke all on public.emergency_reports from anon, authenticated;
grant select, insert, update on public.emergency_reports to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Students can read their own reports" on public.emergency_reports;
create policy "Students can read their own reports"
  on public.emergency_reports for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Admins can read all reports" on public.emergency_reports;
create policy "Admins can read all reports"
  on public.emergency_reports for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Students can submit their own reports" on public.emergency_reports;
create policy "Students can submit their own reports"
  on public.emergency_reports for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and not (select public.is_admin())
    and status = 'Submitted'
    and admin_notes is null
    and student_username = (
      select username from public.profiles where id = (select auth.uid())
    )
    and student_name = (
      select full_name from public.profiles where id = (select auth.uid())
    )
    and roll_no is not distinct from (
      select roll_no from public.profiles where id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update reports" on public.emergency_reports;
create policy "Admins can update reports"
  on public.emergency_reports for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'emergency_reports'
    )
  then
    alter publication supabase_realtime add table public.emergency_reports;
  end if;
end;
$$;
