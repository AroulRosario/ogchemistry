-- Insert a test lesson
insert into public.lessons (id, title, description, thumbnail_url, "order")
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Comic Life 101', 'Learn the basics of comic styles.', 'https://placekitten.com/400/300', 1);

-- Insert chapters
insert into public.chapters (id, lesson_id, title, "order")
values
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chapter 1: The Beginning', 1),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chapter 2: Advanced Dots', 2);

-- Insert content items
insert into public.content_items (chapter_id, type, data, "order")
values
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'video', '{"url": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", "title": "Intro Video"}', 1),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'quiz', '{"question": "What is a comic?", "options": ["Fun", "Boring"], "answer": "Fun"}', 2);
