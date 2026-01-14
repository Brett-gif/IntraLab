create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text not null
);

create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  project_id uuid references projects(id) on delete cascade,
  author_id uuid references profiles(id),
  author_mode text check (author_mode in ('wet','dry')) not null,
  project_description text not null,
  messy_text text not null,
  attachments jsonb default '[]'::jsonb,
  title text,
  structured_json jsonb,
  translation_for_wet text,
  translation_for_dry text,
  confidence double precision,
  followups jsonb default '[]'::jsonb,
  status text check (status in ('processing','ready','error')) default 'processing',
  error_message text
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table projects enable row level security;
alter table updates enable row level security;

create policy "Profiles are readable by owner" on profiles
  for select using (auth.uid() = id);

create policy "Profiles are insertable by owner" on profiles
  for insert with check (auth.uid() = id);

create policy "Profiles are updatable by owner" on profiles
  for update using (auth.uid() = id);

create policy "Projects are readable by owner" on projects
  for select using (auth.uid() = owner_id);

create policy "Projects are insertable by owner" on projects
  for insert with check (auth.uid() = owner_id);

create policy "Projects are updatable by owner" on projects
  for update using (auth.uid() = owner_id);

create policy "Projects are deletable by owner" on projects
  for delete using (auth.uid() = owner_id);

create policy "Updates are readable by project owner" on updates
  for select using (
    auth.uid() = (select owner_id from projects where projects.id = updates.project_id)
  );

create policy "Updates are insertable by project owner" on updates
  for insert with check (
    auth.uid() = (select owner_id from projects where projects.id = updates.project_id)
  );

create policy "Updates are updatable by project owner" on updates
  for update using (
    auth.uid() = (select owner_id from projects where projects.id = updates.project_id)
  );
