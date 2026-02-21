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
