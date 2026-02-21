-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Lessons Table
create table if not exists public.lessons (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  thumbnail_url text,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chapters Table
create table if not exists public.chapters (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  title text not null,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Content Items Table
DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('video', 'html_sim', 'quiz', 'audio', 'reel');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

create table if not exists public.content_items (
  id uuid default uuid_generate_v4() primary key,
  chapter_id uuid references public.chapters(id) on delete cascade not null,
  type content_type not null,
  data jsonb not null default '{}'::jsonb,
  "order" integer default 0,
  is_locked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.lessons enable row level security;
alter table public.chapters enable row level security;
alter table public.content_items enable row level security;

-- DROP old policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Public read access" ON public.lessons;
DROP POLICY IF EXISTS "Public read access" ON public.chapters;
DROP POLICY IF EXISTS "Public read access" ON public.content_items;
DROP POLICY IF EXISTS "Authenticated write access" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated write access" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated write access" ON public.content_items;
DROP POLICY IF EXISTS "Authenticated delete access" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated delete access" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated delete access" ON public.content_items;

-- READ: Everyone can read
create policy "Public read access" on public.lessons for select using (true);
create policy "Public read access" on public.chapters for select using (true);
create policy "Public read access" on public.content_items for select using (true);

-- WRITE: Authenticated users can insert
create policy "Authenticated write access" on public.lessons for insert with check (auth.role() = 'authenticated');
create policy "Authenticated write access" on public.chapters for insert with check (auth.role() = 'authenticated');
create policy "Authenticated write access" on public.content_items for insert with check (auth.role() = 'authenticated');

-- DELETE: Authenticated users can delete
create policy "Authenticated delete access" on public.lessons for delete using (auth.role() = 'authenticated');
create policy "Authenticated delete access" on public.chapters for delete using (auth.role() = 'authenticated');
create policy "Authenticated delete access" on public.content_items for delete using (auth.role() = 'authenticated');

-- UPDATE: Authenticated users can update
DROP POLICY IF EXISTS "Authenticated update access" ON public.lessons;
DROP POLICY IF EXISTS "Authenticated update access" ON public.chapters;
DROP POLICY IF EXISTS "Authenticated update access" ON public.content_items;
create policy "Authenticated update access" on public.lessons for update using (auth.role() = 'authenticated');
create policy "Authenticated update access" on public.chapters for update using (auth.role() = 'authenticated');
-- Profiles Table (Sync from Auth.Users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  xp integer default 0,
  gems integer default 0,
  streak_count integer default 0,
  last_active_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- User Progress Table
create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items(id) on delete cascade not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, content_item_id)
);

alter table public.user_progress enable row level security;
create policy "Users can check own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for insert with check (auth.uid() = user_id);

alter table public.profiles enable row level security;

-- Drop old policies to replace
drop policy if exists "Public read profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public read access" on public.lessons;
drop policy if exists "Public read access" on public.chapters;
drop policy if exists "Public read access" on public.content_items;

-- Profile Policies
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Gatekept Content Policies (Approved Users ONLY)
create policy "Approved users can read lessons" 
on public.lessons for select 
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() 
    and profiles.status = 'approved'
  )
);

create policy "Approved users can read chapters" 
on public.chapters for select 
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() 
    and profiles.status = 'approved'
  )
);

create policy "Approved users can read content" 
on public.content_items for select 
using (
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() 
    and profiles.status = 'approved'
  )
);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, status)
  values (new.id, new.email, 'pending');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run on every new signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index if not exists profiles_status_idx on public.profiles(status);
create index if not exists lessons_order_idx on public.lessons("order");
create index if not exists chapters_lesson_id_idx on public.chapters(lesson_id);
create index if not exists content_items_chapter_id_idx on public.content_items(chapter_id);

-- Updated at Trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();
-- Elite LMS Extension Schema

-- 1. Quizzes Architecture
create table if not exists public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  content_item_id uuid references public.content_items(id) on delete cascade not null,
  passing_score integer default 80,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  "order" integer default 0,
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.question_options (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  option_text text not null,
  is_correct boolean default false,
  "order" integer default 0
);

create table if not exists public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer default 0,
  passed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Discussions System (Q&A)
create table if not exists public.discussions (
  id uuid default uuid_generate_v4() primary key,
  content_item_id uuid references public.content_items(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text,
  body text not null,
  is_resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.discussion_replies (
  id uuid default uuid_generate_v4() primary key,
  discussion_id uuid references public.discussions(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  body text not null,
  is_official_answer boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Bookmarks
create table if not exists public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  content_item_id uuid references public.content_items(id) on delete cascade not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enhance User Progress
alter table public.user_progress 
  add column if not exists score integer,
  add column if not exists time_spent integer default 0,
  add column if not exists status text default 'completed' check (status in ('started', 'completed'));

-- 5. Enable RLS on New Tables
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.question_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_replies enable row level security;
alter table public.bookmarks enable row level security;

-- 6. RLS Policies
-- Quizzes are readable by approved users
create policy "Approved users can read quizzes" on public.quizzes for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);
create policy "Approved users can read quiz_questions" on public.quiz_questions for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);
create policy "Approved users can read question_options" on public.question_options for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);

-- Attempts are readable and insertable by the owner
create policy "Users can check own attempts" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own attempts" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- Discussions are readable by approved users, insertable by the owner
create policy "Approved users can read discussions" on public.discussions for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);
create policy "Approved users can read replies" on public.discussion_replies for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.status = 'approved')
);
create policy "Users can insert discussions" on public.discussions for insert with check (auth.uid() = user_id);
create policy "Users can update own discussions" on public.discussions for update using (auth.uid() = user_id);
create policy "Users can insert replies" on public.discussion_replies for insert with check (auth.uid() = user_id);
create policy "Users can update own replies" on public.discussion_replies for update using (auth.uid() = user_id);

-- Bookmarks are private
create policy "Users can check own bookmarks" on public.bookmarks for select using (auth.uid() = user_id);
create policy "Users can insert own bookmarks" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "Users can update own bookmarks" on public.bookmarks for update using (auth.uid() = user_id);
create policy "Users can delete own bookmarks" on public.bookmarks for delete using (auth.uid() = user_id);

-- Admin Global Override
create policy "Admins can do everything on quizzes" on public.quizzes using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on quiz_questions" on public.quiz_questions using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on question_options" on public.question_options using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on discussions" on public.discussions using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can do everything on discussion_replies" on public.discussion_replies using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
create policy "Admins can see all attempts" on public.quiz_attempts for select using (
  exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);
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
