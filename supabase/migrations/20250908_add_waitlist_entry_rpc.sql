-- Create the add_waitlist_entry RPC function
-- This function handles inserting new waitlist entries and returns whether it was inserted or already exists

CREATE OR REPLACE FUNCTION public.add_waitlist_entry(
  p_email TEXT,
  p_consent BOOLEAN DEFAULT FALSE,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_variant TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted BOOLEAN := FALSE;
  waitlist_position INTEGER;
BEGIN
  -- Validate required parameters
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  IF p_consent IS NOT TRUE THEN
    RAISE EXCEPTION 'Consent is required';
  END IF;

  -- Try to insert the new entry
  INSERT INTO public.waitlist_signups (
    email,
    consent,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    variant,
    created_at
  ) VALUES (
    p_email,
    p_consent,
    p_utm_source,
    p_utm_medium,
    p_utm_campaign,
    p_utm_term,
    p_utm_content,
    p_referrer,
    p_variant,
    NOW()
  );

  -- If we get here, the insert was successful
  inserted := TRUE;

  -- Get waitlist position
  SELECT COUNT(*) INTO waitlist_position FROM public.waitlist_signups;

  -- Queue confirmation email
  INSERT INTO public.email_queue (
    recipient_email,
    template_name,
    template_data,
    status,
    created_at
  ) VALUES (
    p_email,
    'waitlist-confirmation',
    jsonb_build_object(
      'userEmail', p_email,
      'waitlistPosition', waitlist_position,
      'selectedIdeas', '',
      'supportEmail', 'suporte@storyspark.com.br',
      'utm_source', p_utm_source,
      'utm_medium', p_utm_medium,
      'utm_campaign', p_utm_campaign,
      'variant', p_variant
    ),
    'pending',
    NOW()
  );

  -- Log the successful insertion
  RAISE NOTICE 'New waitlist entry added for email: %', p_email;

  RETURN inserted;

EXCEPTION
  WHEN unique_violation THEN
    -- Email already exists, return false
    RAISE NOTICE 'Email already exists in waitlist: %', p_email;
    RETURN FALSE;
  WHEN OTHERS THEN
    -- Re-raise any other errors
    RAISE EXCEPTION 'Error adding waitlist entry: %', SQLERRM;
END;
$$;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.add_waitlist_entry(
  TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;
