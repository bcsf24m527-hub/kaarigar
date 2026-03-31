-- ============================================================
-- Kaarigar - Supabase Full Setup Script
-- Run this ONCE in Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: Ensure profiles table has all required columns
-- ============================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'service_taker',
  ADD COLUMN IF NOT EXISTS service_type TEXT,
  ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- ============================================================
-- STEP 2: Enable Row Level Security on profiles
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: RLS Policies for profiles
-- (Drop old ones first to avoid conflicts)
-- ============================================================

-- Allow anyone (including unauthenticated) to read profiles
-- (needed so service takers can browse providers on BookService page)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================
-- STEP 4: Trigger function to auto-create profile on signup
-- Runs as DB owner (SECURITY DEFINER) so it bypasses RLS
-- This fires even when email confirmation is pending
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, service_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'service_taker'),
    NULLIF(NEW.raw_user_meta_data->>'service_type', '')
  )
  ON CONFLICT (id) DO UPDATE
    SET
      email        = EXCLUDED.email,
      full_name    = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
      role         = COALESCE(NULLIF(EXCLUDED.role, ''), profiles.role),
      service_type = COALESCE(EXCLUDED.service_type, profiles.service_type);

  RETURN NEW;
END;
$$;

-- ============================================================
-- STEP 5: Attach the trigger to auth.users
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
