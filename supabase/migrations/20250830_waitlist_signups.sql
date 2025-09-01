-- Waitlist signups migration
-- Migration: 20250830_waitlist_signups

-- Enable pgcrypto for gen_random_uuid if not already
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  consent BOOLEAN NOT NULL DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  variant TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;

-- Drop existing policy if exists
DROP POLICY IF EXISTS waitlist_insert_any ON public.waitlist_signups;

-- Create new policy for anonymous and authenticated inserts
CREATE POLICY waitlist_insert_any ON public.waitlist_signups
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON public.waitlist_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_utm ON public.waitlist_signups(utm_source, utm_medium, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON public.waitlist_signups(email);

-- Create suggestions table for feedback
CREATE TABLE IF NOT EXISTS public.suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  author_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for suggestions
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Grant permissions for suggestions
GRANT INSERT ON public.suggestions TO anon, authenticated;

-- Create policy for suggestions
DROP POLICY IF EXISTS suggestions_insert_any ON public.suggestions;
CREATE POLICY suggestions_insert_any ON public.suggestions
  FOR INSERT TO anon, authenticated
  WITH CHECK (TRUE);
