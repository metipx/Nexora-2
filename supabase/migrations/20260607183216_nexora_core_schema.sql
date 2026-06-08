/*
# Nexora Core Schema

## Summary
Creates the full player progression and gameplay persistence layer for Nexora.
No auth — players are identified by a wallet address string (no Supabase auth.users dependency).
All tables use wallet_address as the player identity key.

## New Tables

### players
Stores the canonical player profile tied to a wallet address.
- wallet_address (text, PK) — Ethereum-style address, lower-cased
- username (text) — display name
- level (int) — current player level (1–50)
- total_xp (int) — cumulative XP earned all time
- current_xp (int) — XP within the current level (progress bar value)
- rank_score (int) — composite rank score (XP + accuracy + streak + special)
- rank_tier (text) — bronze/silver/gold/platinum/diamond/nexora
- streak_days (int) — consecutive days with at least one challenge
- streak_shield (boolean) — whether the streak shield is active
- last_activity_date (date) — last calendar day the player was active (for streak logic)
- accuracy_rate (numeric 0–1) — all-time correct / total answered
- total_correct (int) — total correct answers ever
- total_answered (int) — total answers ever
- boss_wins (int) — number of boss challenges won
- created_at, updated_at

### category_mastery
Per-player, per-category mastery tracking.
- id (uuid PK)
- wallet_address (text FK → players)
- category_id (text) — matches CATEGORIES constant
- mastery_level (int) — 1–10 mastery in this category
- mastery_xp (int) — XP within current mastery level
- total_correct (int) — correct answers in this category
- total_answered (int) — total answers in this category
- created_at, updated_at

### challenge_sessions
Records each completed challenge session.
- id (uuid PK)
- wallet_address (text FK → players)
- category_id (text)
- difficulty (text) — easy/medium/hard/very_hard
- score (int) — XP earned this session
- correct_count (int)
- total_questions (int)
- duration_seconds (int)
- is_daily (boolean) — was this the daily challenge?
- is_boss (boolean) — was this a boss challenge?
- completed_at (timestamptz)

### challenge_questions
Records individual question/answer pairs (for history + AI calibration).
- id (uuid PK)
- session_id (uuid FK → challenge_sessions)
- wallet_address (text FK → players)
- category_id (text)
- difficulty (text)
- question_text (text)
- correct_answer (text)
- player_answer (text)
- is_correct (boolean)
- time_taken_ms (int)
- xp_awarded (int)
- answered_at (timestamptz)

### achievements
Records unlocked achievements per player.
- id (uuid PK)
- wallet_address (text FK → players)
- achievement_id (text) — slug like "first_win", "streak_7" etc.
- unlocked_at (timestamptz)

### daily_challenge_completions
Tracks which daily challenge the player has completed (prevents repeat today).
- id (uuid PK)
- wallet_address (text)
- challenge_date (date) — the calendar day of the daily challenge
- completed_at (timestamptz)
- xp_awarded (int)
- UNIQUE(wallet_address, challenge_date)

## Security
- RLS enabled on all tables
- anon + authenticated can read/write (single-tenant, wallet-based identity not Supabase auth)
- No auth.uid() checks — wallet_address is the identity

## Notes
- All policies use USING(true) / WITH CHECK(true) because identity is enforced at app layer via wallet
- wallet_address is always lower-cased before insert
*/

-- ── players ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS players (
  wallet_address   text PRIMARY KEY,
  username         text NOT NULL DEFAULT 'Challenger',
  level            int  NOT NULL DEFAULT 1,
  total_xp         int  NOT NULL DEFAULT 0,
  current_xp       int  NOT NULL DEFAULT 0,
  rank_score       int  NOT NULL DEFAULT 0,
  rank_tier        text NOT NULL DEFAULT 'bronze',
  streak_days      int  NOT NULL DEFAULT 0,
  streak_shield    boolean NOT NULL DEFAULT false,
  last_activity_date date,
  accuracy_rate    numeric(5,4) NOT NULL DEFAULT 0,
  total_correct    int  NOT NULL DEFAULT 0,
  total_answered   int  NOT NULL DEFAULT 0,
  boss_wins        int  NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_players" ON players;
CREATE POLICY "anon_select_players" ON players FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_players" ON players;
CREATE POLICY "anon_insert_players" ON players FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_players" ON players;
CREATE POLICY "anon_update_players" ON players FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_players" ON players;
CREATE POLICY "anon_delete_players" ON players FOR DELETE TO anon, authenticated USING (true);

-- ── category_mastery ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS category_mastery (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  category_id     text NOT NULL,
  mastery_level   int  NOT NULL DEFAULT 1,
  mastery_xp      int  NOT NULL DEFAULT 0,
  total_correct   int  NOT NULL DEFAULT 0,
  total_answered  int  NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, category_id)
);

ALTER TABLE category_mastery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_category_mastery" ON category_mastery;
CREATE POLICY "anon_select_category_mastery" ON category_mastery FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_category_mastery" ON category_mastery;
CREATE POLICY "anon_insert_category_mastery" ON category_mastery FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_category_mastery" ON category_mastery;
CREATE POLICY "anon_update_category_mastery" ON category_mastery FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_category_mastery" ON category_mastery;
CREATE POLICY "anon_delete_category_mastery" ON category_mastery FOR DELETE TO anon, authenticated USING (true);

-- ── challenge_sessions ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS challenge_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  category_id      text NOT NULL,
  difficulty       text NOT NULL DEFAULT 'medium',
  score            int  NOT NULL DEFAULT 0,
  correct_count    int  NOT NULL DEFAULT 0,
  total_questions  int  NOT NULL DEFAULT 5,
  duration_seconds int  NOT NULL DEFAULT 0,
  is_daily         boolean NOT NULL DEFAULT false,
  is_boss          boolean NOT NULL DEFAULT false,
  completed_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE challenge_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_challenge_sessions" ON challenge_sessions;
CREATE POLICY "anon_select_challenge_sessions" ON challenge_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_challenge_sessions" ON challenge_sessions;
CREATE POLICY "anon_insert_challenge_sessions" ON challenge_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_challenge_sessions" ON challenge_sessions;
CREATE POLICY "anon_update_challenge_sessions" ON challenge_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_challenge_sessions" ON challenge_sessions;
CREATE POLICY "anon_delete_challenge_sessions" ON challenge_sessions FOR DELETE TO anon, authenticated USING (true);

-- ── challenge_questions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS challenge_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid REFERENCES challenge_sessions(id) ON DELETE CASCADE,
  wallet_address  text NOT NULL,
  category_id     text NOT NULL,
  difficulty      text NOT NULL,
  question_text   text NOT NULL,
  correct_answer  text NOT NULL,
  player_answer   text,
  is_correct      boolean,
  time_taken_ms   int,
  xp_awarded      int  NOT NULL DEFAULT 0,
  answered_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE challenge_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_challenge_questions" ON challenge_questions;
CREATE POLICY "anon_select_challenge_questions" ON challenge_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_challenge_questions" ON challenge_questions;
CREATE POLICY "anon_insert_challenge_questions" ON challenge_questions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_challenge_questions" ON challenge_questions;
CREATE POLICY "anon_update_challenge_questions" ON challenge_questions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_challenge_questions" ON challenge_questions;
CREATE POLICY "anon_delete_challenge_questions" ON challenge_questions FOR DELETE TO anon, authenticated USING (true);

-- ── achievements ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS achievements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  achievement_id  text NOT NULL,
  unlocked_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, achievement_id)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_achievements" ON achievements;
CREATE POLICY "anon_select_achievements" ON achievements FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_achievements" ON achievements;
CREATE POLICY "anon_insert_achievements" ON achievements FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_achievements" ON achievements;
CREATE POLICY "anon_update_achievements" ON achievements FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_achievements" ON achievements;
CREATE POLICY "anon_delete_achievements" ON achievements FOR DELETE TO anon, authenticated USING (true);

-- ── daily_challenge_completions ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL,
  challenge_date  date NOT NULL,
  completed_at    timestamptz NOT NULL DEFAULT now(),
  xp_awarded      int  NOT NULL DEFAULT 0,
  UNIQUE(wallet_address, challenge_date)
);

ALTER TABLE daily_challenge_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_daily_completions" ON daily_challenge_completions;
CREATE POLICY "anon_select_daily_completions" ON daily_challenge_completions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_daily_completions" ON daily_challenge_completions;
CREATE POLICY "anon_insert_daily_completions" ON daily_challenge_completions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_daily_completions" ON daily_challenge_completions;
CREATE POLICY "anon_update_daily_completions" ON daily_challenge_completions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_daily_completions" ON daily_challenge_completions;
CREATE POLICY "anon_delete_daily_completions" ON daily_challenge_completions FOR DELETE TO anon, authenticated USING (true);

-- ── indexes ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_challenge_sessions_wallet ON challenge_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_challenge_sessions_completed ON challenge_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_questions_session ON challenge_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_challenge_questions_wallet ON challenge_questions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_category_mastery_wallet ON category_mastery(wallet_address);
CREATE INDEX IF NOT EXISTS idx_achievements_wallet ON achievements(wallet_address);
CREATE INDEX IF NOT EXISTS idx_daily_completions_wallet_date ON daily_challenge_completions(wallet_address, challenge_date);
CREATE INDEX IF NOT EXISTS idx_players_rank_score ON players(rank_score DESC);
