-- ============================================================
-- Kaarigar - Enable Realtime for Bookings
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable the real-time functionality for the bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
