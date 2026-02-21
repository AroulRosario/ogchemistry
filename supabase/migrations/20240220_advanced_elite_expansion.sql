-- Advanced Elite LMS Extension Schema

-- 1. Certificates
create table if not exists public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null,
  certificate_url text,
  unique(user_id, lesson_id)
);

-- 2. Achievements & Gamification
create table if not exists public.achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon_url text,
  xp_reward integer default 0,
  criteria_type text not null, -- e.g., 'quiz_perfect_score', 'streak_7_days', 'complete_lesson'
  criteria_value integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references public.achievements(id) on delete cascade not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- 3. Notifications
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  message text not null,
  is_read boolean default false,
  type text not null, -- e.g., 'system', 'achievement', 'discussion_reply', 'assignment_graded'
  related_entity_id uuid, -- Can be achievement_id, discussion_id, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Assignments
create table if not exists public.assignments (
  id uuid default uuid_generate_v4() primary key,
  content_item_id uuid references public.content_items(id) on delete cascade not null,
  title text not null,
  description text not null,
  due_date timestamp with time zone,
  passing_score integer default 60,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.assignment_submissions (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  content text, -- or URL to file
  status text default 'submitted' check (status in ('submitted', 'graded', 'returned')),
  score integer,
  feedback text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  graded_at timestamp with time zone
);

-- 5. Enable RLS
alter table public.certificates enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.notifications enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;

-- 6. RLS Policies
-- Certificates
create policy "Users can check own certificates" on public.certificates for select using (auth.uid() = user_id);

-- Achievements
create policy "Public read achievements" on public.achievements for select using (true);
create policy "Users can check own user_achievements" on public.user_achievements for select using (auth.uid() = user_id);

-- Notifications
create policy "Users can check own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);

-- Assignments
create policy "Approved users can read assignments" on public.assignments for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);
create policy "Users can check own submissions" on public.assignment_submissions for select using (auth.uid() = user_id);
create policy "Users can insert own submissions" on public.assignment_submissions for insert with check (auth.uid() = user_id);

-- Admin Global Override
create policy "Admins can do everything on certificates" on public.certificates using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on achievements" on public.achievements using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on user_achievements" on public.user_achievements using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on notifications" on public.notifications using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on assignments" on public.assignments using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on assignment_submissions" on public.assignment_submissions using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
