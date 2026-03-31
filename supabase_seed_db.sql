-- ============================================================
-- Kaarigar Database Seeding Script
-- Run this in your Supabase Dashboard > SQL Editor
-- WARNING: This will delete previous bookings and contacts!
-- ============================================================

-- Ensure pgcrypto is enabled for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure contacts table exists
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Delete old seed data to prevent duplicates
DELETE FROM auth.users WHERE email LIKE '%@demo.com';
DELETE FROM public.bookings;
DELETE FROM public.contacts;

-- ============================================================
-- 1. Create Users (Customers & Providers)
-- ============================================================
DO $$ 
DECLARE
  pwd_hash text;
BEGIN
  -- Password for all mock accounts will be: password123
  pwd_hash := crypt('password123', gen_salt('bf'));

  -- Inserting 2 Customers and 2 Providers with hardcoded UUIDs so we can link foreign keys
  INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
  VALUES 
  ('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'customer1@demo.com', pwd_hash, now(), '{"full_name":"John Customer","role":"service_taker"}'::jsonb, now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'customer2@demo.com', pwd_hash, now(), '{"full_name":"Jane Customer","role":"service_taker"}'::jsonb, now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'electrician1@demo.com', pwd_hash, now(), '{"full_name":"Mike Electrician","role":"service_provider","service_type":"Electrician"}'::jsonb, now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'plumber1@demo.com', pwd_hash, now(), '{"full_name":"Pete Plumber","role":"service_provider","service_type":"Plumber"}'::jsonb, now(), now());
END $$;

-- Note: The active database trigger "handle_new_user" will automatically generate 
-- corresponding rows in public.profiles for the above users!

-- ============================================================
-- 2. Create Bookings
-- ============================================================
INSERT INTO public.bookings 
  (user_id, provider_id, provider_name, service, user_name, user_email, user_phone, address, date, "time", notes, status)
VALUES 
  -- Customer 1 books Mike the Electrician, status Pending
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Mike Electrician', 'Electrician', 'John Customer', 'customer1@demo.com', '555-0101', '123 Main St', '2026-04-05', '09:00', 'Need a new ceiling fan installed', 'Pending'),
  
  -- Customer 1 books Pete the Plumber, status Accepted
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Pete Plumber', 'Plumber', 'John Customer', 'customer1@demo.com', '555-0101', '123 Main St', '2026-04-06', '14:30', 'Leaky kitchen sink', 'Accepted'),
  
  -- Customer 2 books Mike the Electrician, status Completed
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Mike Electrician', 'Electrician', 'Jane Customer', 'customer2@demo.com', '555-0202', '456 Oak Dr', '2026-03-25', '11:00', 'Rewired garage lighting', 'Completed'),
  
  -- Customer 2 books Pete the Plumber, status Pending
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Pete Plumber', 'Plumber', 'Jane Customer', 'customer2@demo.com', '555-0202', '456 Oak Dr', '2026-04-10', '08:00', 'Install new toilet', 'Pending');

-- ============================================================
-- 3. Create Contacts
-- ============================================================
INSERT INTO public.contacts (name, email, subject, message)
VALUES 
  ('Alice Walker', 'alice.w@example.com', 'Pricing Inquiry', 'Hello, how much does a standard AC installation cost in the downtown area?'),
  ('Bob Smith', 'bob@example.com', 'Feedback', 'Your platform is great, but could you add Carpentry services soon?'),
  ('Sarah Lee', 'sarah.lee@example.com', 'Support Request', 'I am a provider and I forgot how to update my availability hours.');

