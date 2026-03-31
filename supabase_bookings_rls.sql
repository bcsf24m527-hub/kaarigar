-- ============================================================
-- Kaarigar - Bookings Table + RLS Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- STEP 1: Create bookings table (if not exists)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider_name TEXT,
  service TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  address TEXT,
  date TEXT,
  time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- STEP 2: Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- STEP 3: RLS Policies
-- Drop old policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Providers can update assigned bookings" ON public.bookings;

-- Service takers can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service providers can view bookings assigned to them
CREATE POLICY "Providers can view assigned bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = provider_id);

-- Authenticated users can create bookings
CREATE POLICY "Users can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Providers can update bookings assigned to them (accept/decline/complete)
CREATE POLICY "Providers can update assigned bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = provider_id);
