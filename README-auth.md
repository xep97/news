# Supabase DB setup for auth/profile table

Run the following SQL in your Supabase project's SQL editor to create a `profiles` table that links to the built-in `auth.users` table.

```sql
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  subscription_status text,
  created_date timestamptz default now(),
  last_active timestamptz
);

-- Recommended: enable Row Level Security and add policies so authenticated users can insert/update their own profile
alter table profiles enable row level security;

create policy "Allow insert for authenticated users" on profiles
  for insert
  with check (auth.role() = 'authenticated');

create policy "Allow update own profile" on profiles
  for update
  using (auth.uid() = id);

create policy "Allow select for authenticated users" on profiles
  for select
  using (auth.role() = 'authenticated');
```

Notes:
- The `id` column is the user's `auth.users.id` (UUID) — Supabase Auth provides this when creating users.
- The `password` field should NOT be stored in this table; Supabase Auth manages user passwords securely. Your table stores profile metadata like `name`, `subscription_status`, `created_date`, and `last_active`.
- If you use RLS policies, the client (anon key) can insert/select/update only if policies allow; alternatively, perform inserts/updates from a server-side endpoint with a service_role key (not recommended for client code).
