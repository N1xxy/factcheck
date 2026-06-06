create table parties (
  id uuid primary key default gen_random_uuid(),
  party_slug text unique not null,
  party_name text not null,
  short_name text not null,
  color_hex text
);

create table spheres (
  id uuid primary key default gen_random_uuid(),
  sphere_slug text unique not null,
  sphere_name text not null,
  description text
);

create table common_policies (
  id uuid primary key default gen_random_uuid(),
  policy_slug text unique not null,
  sphere_slug text not null references spheres(sphere_slug),
  title text not null,
  opinion_statement text not null
);

create table party_positions (
  id uuid primary key default gen_random_uuid(),
  party_slug text not null references parties(party_slug),
  policy_slug text not null references common_policies(policy_slug),
  support_level int not null check (support_level between 1 and 5),
  reasoning text,
  source_url text,
  source_title text,
  unique (party_slug, policy_slug)
);

create table policy_checks (
  id uuid primary key default gen_random_uuid(),
  check_slug text unique not null,
  party_slug text not null references parties(party_slug),
  sphere_slug text not null references spheres(sphere_slug),
  policy_slug text references common_policies(policy_slug),
  title text not null,
  comparison_signal text not null check (
    comparison_signal in ('matches', 'mismatch', 'insufficient_data')
  )
);

create table claims (
  id uuid primary key default gen_random_uuid(),
  check_slug text not null references policy_checks(check_slug),
  claim_text text not null,
  source_url text,
  source_title text,
  source_date date
);

create table actions (
  id uuid primary key default gen_random_uuid(),
  check_slug text not null references policy_checks(check_slug),
  action_text text not null,
  source_url text,
  source_title text,
  source_date date
);

alter table parties enable row level security;
alter table spheres enable row level security;
alter table common_policies enable row level security;
alter table party_positions enable row level security;
alter table policy_checks enable row level security;
alter table claims enable row level security;
alter table actions enable row level security;

create policy "Public read parties"
on parties for select to anon using (true);

create policy "Public read spheres"
on spheres for select to anon using (true);

create policy "Public read common policies"
on common_policies for select to anon using (true);

create policy "Public read party positions"
on party_positions for select to anon using (true);

create policy "Public read policy checks"
on policy_checks for select to anon using (true);

create policy "Public read claims"
on claims for select to anon using (true);

create policy "Public read actions"
on actions for select to anon using (true);
