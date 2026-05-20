-- ============================================
-- Islamediaku — Ruang User Dashboard Tables
-- Migration 003: Daily targets, notes, travel, feature state
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- ── 1. User Daily Targets ──
CREATE TABLE IF NOT EXISTS user_daily_targets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_date DATE NOT NULL,
  targets JSONB DEFAULT '[]',
  completed JSONB DEFAULT '[]',
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_date)
);

ALTER TABLE user_daily_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "targets_select" ON user_daily_targets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "targets_insert" ON user_daily_targets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "targets_update" ON user_daily_targets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "targets_delete" ON user_daily_targets FOR DELETE USING (auth.uid() = user_id);


-- ── 2. User Daily Notes ──
CREATE TABLE IF NOT EXISTS user_daily_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_date DATE NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, note_date)
);

ALTER TABLE user_daily_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select" ON user_daily_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notes_insert" ON user_daily_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update" ON user_daily_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete" ON user_daily_notes FOR DELETE USING (auth.uid() = user_id);


-- ── 3. User Feature State ──
-- Generic table to store per-feature state (mushaf, dzikir, sholat, etc.)
CREATE TABLE IF NOT EXISTS user_feature_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  state_data JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, feature)
);

ALTER TABLE user_feature_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_state_select" ON user_feature_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "feature_state_insert" ON user_feature_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feature_state_update" ON user_feature_state FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "feature_state_delete" ON user_feature_state FOR DELETE USING (auth.uid() = user_id);


-- ── 4. Add feature column to user_activity if not exists ──
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_activity' AND column_name = 'feature'
  ) THEN
    ALTER TABLE user_activity ADD COLUMN feature TEXT DEFAULT 'general';
  END IF;
END $$;


-- ── 5. Avatars storage bucket ──
-- NOTE: Run this separately in Supabase Dashboard → Storage → New Bucket
-- Bucket name: avatars
-- Public: true
--
-- Then add these storage policies via SQL:

-- Allow users to upload to their own folder
-- INSERT policy:
-- CREATE POLICY "avatar_upload" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
--
-- UPDATE policy:
-- CREATE POLICY "avatar_update" ON storage.objects FOR UPDATE
--   USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
--
-- DELETE policy:
-- CREATE POLICY "avatar_delete" ON storage.objects FOR DELETE
--   USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
--
-- Public read:
-- CREATE POLICY "avatar_public_read" ON storage.objects FOR SELECT
--   USING (bucket_id = 'avatars');
