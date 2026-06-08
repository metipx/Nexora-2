/*
# Nexora Full Game Schema

## Overview
Complete schema for Nexora competitive knowledge platform.

## Tables Created/Updated

### players
Core player identity table keyed by wallet_address.
Columns: wallet_address, username, level, total_xp, current_xp, rank_score, rank_tier,
streak_days, streak_shield, last_activity_date, accuracy_rate, total_correct, total_answered,
boss_wins, premium_until, ritual_balance, spin_last_date, created_at, updated_at

### category_mastery
Per-category progress tracking for each player.

### challenge_sessions
Records of completed quiz sessions.

### challenge_questions
Individual question records within sessions.

### achievements
Unlocked achievement records per player.
achievement_id values: first_login, first_correct, first_spin, streak_3, streak_7, level_5,
level_10, level_20, correct_10, correct_50, categories_3, first_purchase, xp_boost_used,
streak_shield_used, boss_participated, rank_gold, top10_weekly

### daily_challenge_completions
Tracks daily challenge completion per wallet per day.

### shop_items
Master catalogue of all available shop items.
Columns: id, slug, name, description, category, price_ritual, rarity, duration_hours,
effect_type, effect_value, image_hint, is_active, created_at

### inventory_items
Player-owned item instances.
Columns: id, wallet_address, item_slug, quantity, purchased_at, activated_at, expires_at,
is_active, transaction_hash, created_at

### spin_results
Tracks daily spin outcomes.
Columns: id, wallet_address, reward_type, reward_value, spun_at

### leaderboard_snapshots
Weekly snapshot for leaderboard history (future use).

## Security
All tables use RLS with anon+authenticated USING(true) policies for single-tenant wallet-identity app.
*/

-- ── Players ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS players (
  wallet_address      text PRIMARY KEY,
  username            text NOT NULL DEFAULT 'Challenger',
  level               integer NOT NULL DEFAULT 1,
  total_xp            integer NOT NULL DEFAULT 0,
  current_xp          integer NOT NULL DEFAULT 0,
  rank_score          integer NOT NULL DEFAULT 0,
  rank_tier           text NOT NULL DEFAULT 'bronze',
  streak_days         integer NOT NULL DEFAULT 0,
  streak_shield       boolean NOT NULL DEFAULT false,
  last_activity_date  text,
  accuracy_rate       float NOT NULL DEFAULT 0,
  total_correct       integer NOT NULL DEFAULT 0,
  total_answered      integer NOT NULL DEFAULT 0,
  boss_wins           integer NOT NULL DEFAULT 0,
  premium_until       timestamptz,
  ritual_balance      float NOT NULL DEFAULT 0,
  spin_last_date      text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
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

-- ── Category mastery ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS category_mastery (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  category_id     text NOT NULL,
  mastery_level   integer NOT NULL DEFAULT 0,
  mastery_xp      integer NOT NULL DEFAULT 0,
  total_correct   integer NOT NULL DEFAULT 0,
  total_answered  integer NOT NULL DEFAULT 0,
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

-- ── Challenge sessions ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS challenge_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  category_id      text NOT NULL,
  difficulty       text NOT NULL DEFAULT 'medium',
  score            integer NOT NULL DEFAULT 0,
  correct_count    integer NOT NULL DEFAULT 0,
  total_questions  integer NOT NULL DEFAULT 5,
  duration_seconds integer NOT NULL DEFAULT 0,
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

-- ── Challenge questions ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS challenge_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES challenge_sessions(id) ON DELETE CASCADE,
  wallet_address  text NOT NULL,
  category_id     text NOT NULL,
  difficulty      text NOT NULL,
  question_text   text NOT NULL,
  correct_answer  text NOT NULL,
  player_answer   text,
  is_correct      boolean,
  time_taken_ms   integer,
  xp_awarded      integer NOT NULL DEFAULT 0,
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

-- ── Achievements ──────────────────────────────────────────────────────────

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

-- ── Daily challenge completions ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS daily_challenge_completions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  challenge_date  text NOT NULL,
  completed_at    timestamptz NOT NULL DEFAULT now(),
  xp_awarded      integer NOT NULL DEFAULT 0,
  UNIQUE(wallet_address, challenge_date)
);

ALTER TABLE daily_challenge_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_daily_challenge_completions" ON daily_challenge_completions;
CREATE POLICY "anon_select_daily_challenge_completions" ON daily_challenge_completions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_daily_challenge_completions" ON daily_challenge_completions;
CREATE POLICY "anon_insert_daily_challenge_completions" ON daily_challenge_completions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_daily_challenge_completions" ON daily_challenge_completions;
CREATE POLICY "anon_update_daily_challenge_completions" ON daily_challenge_completions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_daily_challenge_completions" ON daily_challenge_completions;
CREATE POLICY "anon_delete_daily_challenge_completions" ON daily_challenge_completions FOR DELETE TO anon, authenticated USING (true);

-- ── Shop items (master catalogue) ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  description     text NOT NULL,
  category        text NOT NULL DEFAULT 'boost',
  price_ritual    float NOT NULL,
  rarity          text NOT NULL DEFAULT 'common',
  duration_hours  integer,
  effect_type     text NOT NULL DEFAULT 'none',
  effect_value    float NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_shop_items" ON shop_items;
CREATE POLICY "anon_select_shop_items" ON shop_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_shop_items" ON shop_items;
CREATE POLICY "anon_insert_shop_items" ON shop_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_shop_items" ON shop_items;
CREATE POLICY "anon_update_shop_items" ON shop_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Inventory ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inventory_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  item_slug        text NOT NULL,
  quantity         integer NOT NULL DEFAULT 1,
  purchased_at     timestamptz NOT NULL DEFAULT now(),
  activated_at     timestamptz,
  expires_at       timestamptz,
  is_active        boolean NOT NULL DEFAULT false,
  transaction_hash text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_inventory_items" ON inventory_items;
CREATE POLICY "anon_select_inventory_items" ON inventory_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_inventory_items" ON inventory_items;
CREATE POLICY "anon_insert_inventory_items" ON inventory_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_inventory_items" ON inventory_items;
CREATE POLICY "anon_update_inventory_items" ON inventory_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_inventory_items" ON inventory_items;
CREATE POLICY "anon_delete_inventory_items" ON inventory_items FOR DELETE TO anon, authenticated USING (true);

-- ── Spin results ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS spin_results (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  reward_type   text NOT NULL,
  reward_value  text NOT NULL,
  spun_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE spin_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_spin_results" ON spin_results;
CREATE POLICY "anon_select_spin_results" ON spin_results FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_spin_results" ON spin_results;
CREATE POLICY "anon_insert_spin_results" ON spin_results FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_players_rank_score ON players(rank_score DESC);
CREATE INDEX IF NOT EXISTS idx_players_total_xp ON players(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_sessions_wallet ON challenge_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_challenge_sessions_completed ON challenge_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_wallet ON achievements(wallet_address);
CREATE INDEX IF NOT EXISTS idx_inventory_wallet ON inventory_items(wallet_address);
CREATE INDEX IF NOT EXISTS idx_spin_results_wallet ON spin_results(wallet_address);

-- ── Seed shop items ───────────────────────────────────────────────────────

INSERT INTO shop_items (slug, name, description, category, price_ritual, rarity, duration_hours, effect_type, effect_value) VALUES
  ('xp_boost_1h',       'XP Boost 1h',           'Double your XP gains for 1 hour.',                              'boost',    0.01,  'common',    1,    'xp_multiplier', 2.0),
  ('xp_boost_6h',       'XP Boost 6h',            'Double your XP gains for 6 hours.',                             'boost',    0.05,  'uncommon',  6,    'xp_multiplier', 2.0),
  ('xp_boost_24h',      'XP Boost 24h',           'Double your XP gains for a full day.',                          'boost',    0.1,   'rare',      24,   'xp_multiplier', 2.0),
  ('streak_shield_1',   'Streak Shield I',        'Protect your streak from one missed day.',                      'protection', 0.02, 'common',   NULL, 'streak_shield', 1.0),
  ('streak_shield_3',   'Streak Shield III',      'Protect your streak for up to 3 missed days.',                  'protection', 0.05, 'uncommon', NULL, 'streak_shield', 3.0),
  ('streak_shield_7',   'Streak Shield VII',      'Protect your streak for an entire week.',                       'protection', 0.1,  'rare',     NULL, 'streak_shield', 7.0),
  ('hint_token',        'Hint Token',             'Reveal a clue for one difficult question.',                     'utility',  0.005, 'common',   NULL, 'hint',          1.0),
  ('retry_ticket',      'Retry Ticket',           'Re-attempt a challenge you already completed today.',           'utility',  0.002, 'common',   NULL, 'retry',         1.0),
  ('boss_ticket',       'Boss Ticket',            'Gain entry to any Weekly Boss Challenge regardless of tier.',   'access',   0.2,   'epic',     NULL, 'boss_access',   1.0),
  ('double_reward_1h',  'Double Reward 1h',       'Earn double rewards from all challenge types for 1 hour.',      'boost',    0.02,  'uncommon',  1,   'reward_multiplier', 2.0),
  ('double_reward_24h', 'Double Reward 24h',      'Earn double rewards from all challenge types for 24 hours.',    'boost',    0.05,  'rare',      24,  'reward_multiplier', 2.0),
  ('premium_pass',      'Premium Challenge Pass', 'Access 7 days of exclusive Premium League challenges.',         'access',   0.15,  'epic',     168,  'premium_access', 1.0),
  ('mystic_box',        'Mystic Box',             'A mystery crate containing a random rare item or XP reward.',   'crate',    0.2,   'rare',     NULL, 'mystery',        0.0),
  ('legendary_crate',   'Legendary Crate',        'Contains guaranteed epic or legendary loot — items, XP, or titles.', 'crate', 0.2, 'legendary', NULL, 'mystery',    0.0)
ON CONFLICT (slug) DO NOTHING;
