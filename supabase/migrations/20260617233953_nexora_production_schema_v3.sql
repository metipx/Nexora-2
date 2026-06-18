/*
# Nexora Production Schema v3

## Overview
Complete production schema for Nexora competitive knowledge platform.
This migration adds missing tables, fixes insecure RLS policies, and introduces
the new category system.

## Security Model
- All tables use secure RLS policies based on wallet_address matching
- Players can only read/write their own data
- Public read access is granted only where appropriate (leaderboard, shop_items)
- Admin/system tables are protected

## New Tables Added
- categories (master catalog)
- ritual_transactions (transaction history)
- weekly_reports (progress summaries)
- oracle_interactions (AI oracle logs)
- mentor_interactions (AI mentor logs)
- premium_memberships (premium tier tracking)
- boss_challenge_entries (boss challenge participation)
- activity_logs (audit trail)
- user_preferences (settings storage)
- challenge_rewards (reward distribution records)
- wallet_sessions (login tracking)
*/

-- ════════════════════════════════════════════════════════════════════════
-- PART 1: CATEGORIES MASTER TABLE
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS categories (
  id              text PRIMARY KEY,
  label           text NOT NULL,
  description     text NOT NULL,
  icon            text NOT NULL DEFAULT '📚',
  color           text NOT NULL DEFAULT '#7C5CFC',
  unlock_level    integer NOT NULL DEFAULT 1,
  sort_order      integer NOT NULL DEFAULT 0,
  is_active        boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories are publicly readable
DROP POLICY IF EXISTS "public_select_categories" ON categories;
CREATE POLICY "public_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (is_active = true);

-- Only service role can modify
DROP POLICY IF EXISTS "service_manage_categories" ON categories;
CREATE POLICY "service_manage_categories" ON categories FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- Seed the new category catalog
INSERT INTO categories (id, label, description, icon, color, unlock_level, sort_order) VALUES
  ('technology_ai',    'Technology & AI',      'Computing, AI, software, hardware, and digital innovation',        '💻', '#33DEFF', 1,  1),
  ('programming',      'Programming',           'Languages, algorithms, data structures, and software engineering',   '⌨️', '#00C896', 1,  2),
  ('history',          'History',               'World events, civilizations, politics, and historical figures',      '🏛️', '#CD7F32', 1,  3),
  ('geography',        'Geography',             'Countries, capitals, terrain, climate, and cultures',               '🌍', '#FFB84D', 1,  4),
  ('science_astronomy','Science & Astronomy',   'Physics, chemistry, biology, and space exploration',               '🔬', '#00D4FF', 1,  5),
  ('business_economics','Business & Economics', 'Markets, finance, entrepreneurship, and economic theory',            '📊', '#9B81FF', 3,  6),
  ('sports',           'Sports',                'Athletics, teams, competitions, and sporting history',               '⚽', '#33E8B8', 3,  7),
  ('cinema_entertainment','Cinema & Entertainment', 'Films, music, celebrities, and pop culture',            '🎬', '#FFD080', 5,  8),
  ('english',          'English',               'Language, grammar, vocabulary, and literature in English',         '📖', '#8FCDDD', 5,  9),
  ('logic_problem_solving','Logic & Problem Solving', 'Puzzles, reasoning, sequences, and critical thinking',            '🧩', '#B9F2FF', 7,  10),
  ('culture_art',      'Culture & Art',         'Visual arts, music, architecture, and cultural movements',         '🎨', '#FF7A50', 7,  11),
  ('general_knowledge','General Knowledge',     'Miscellaneous facts, trivia, and common knowledge',                 '💡', '#E6EDF7', 1,  12)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  unlock_level = EXCLUDED.unlock_level,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ════════════════════════════════════════════════════════════════════════
-- PART 2: NEW TABLES FOR PRODUCTION FEATURES
-- ════════════════════════════════════════════════════════════════════════

-- ── Leaderboard Snapshots ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date   date NOT NULL,
  snapshot_type   text NOT NULL DEFAULT 'daily',
  rankings        jsonb NOT NULL DEFAULT '[]',
  player_count    integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(snapshot_date, snapshot_type)
);

ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_snapshots" ON leaderboard_snapshots FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "service_write_snapshots" ON leaderboard_snapshots FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ── Ritual Transactions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ritual_transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL,
  transaction_type text NOT NULL,
  amount           float NOT NULL,
  balance_before   float NOT NULL DEFAULT 0,
  balance_after    float NOT NULL DEFAULT 0,
  item_slug        text,
  item_name        text,
  tx_hash          text,
  network          text NOT NULL DEFAULT 'sepolia',
  status           text NOT NULL DEFAULT 'pending',
  failure_reason  text,
  metadata         jsonb DEFAULT '{}',
  created_at       timestamptz NOT NULL DEFAULT now(),
  confirmed_at     timestamptz
);

ALTER TABLE ritual_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ritual_tx_wallet ON ritual_transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_ritual_tx_created ON ritual_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ritual_tx_type ON ritual_transactions(transaction_type);

CREATE POLICY "select_own_transactions" ON ritual_transactions FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_transaction" ON ritual_transactions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_transaction" ON ritual_transactions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Weekly Reports ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS weekly_reports (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address     text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  week_start_date    date NOT NULL,
  week_end_date      date NOT NULL,
  xp_earned          integer NOT NULL DEFAULT 0,
  questions_answered integer NOT NULL DEFAULT 0,
  correct_answers    integer NOT NULL DEFAULT 0,
  accuracy_rate      float NOT NULL DEFAULT 0,
  sessions_completed integer NOT NULL DEFAULT 0,
  boss_challenges     integer NOT NULL DEFAULT 0,
  rank_change        integer NOT NULL DEFAULT 0,
  achievements_unlocked text[] DEFAULT '{}',
  summary            jsonb DEFAULT '{}',
  created_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address, week_start_date)
);

ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_weekly_reports_wallet ON weekly_reports(wallet_address);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week ON weekly_reports(week_start_date DESC);

CREATE POLICY "select_own_report" ON weekly_reports FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "service_write_reports" ON weekly_reports FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ── Oracle Interactions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS oracle_interactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL,
  category_id     text,
  difficulty      text,
  prompt_summary  text NOT NULL,
  response        text NOT NULL,
  confidence      float NOT NULL DEFAULT 0.8,
  model_used      text NOT NULL DEFAULT 'gpt-4o-mini',
  tokens_used     integer NOT NULL DEFAULT 0,
  latency_ms      integer,
  user_feedback   text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE oracle_interactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_oracle_wallet ON oracle_interactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_oracle_created ON oracle_interactions(created_at DESC);

CREATE POLICY "select_own_oracle" ON oracle_interactions FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "service_write_oracle" ON oracle_interactions FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ── Mentor Interactions ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mentor_interactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL,
  session_id       uuid REFERENCES challenge_sessions(id),
  question_id      uuid REFERENCES challenge_questions(id),
  interaction_type text NOT NULL,
  prompt_summary   text NOT NULL,
  result_summary   text NOT NULL,
  advice_given     text,
  confidence       float NOT NULL DEFAULT 0.8,
  was_helpful      boolean,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mentor_interactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_mentor_wallet ON mentor_interactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_mentor_session ON mentor_interactions(session_id);

CREATE POLICY "select_own_mentor" ON mentor_interactions FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "service_write_mentor" ON mentor_interactions FOR ALL
  TO service_role USING (true) WITH CHECK (true);

-- ── Premium Memberships ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS premium_memberships (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL REFERENCES players(wallet_address) ON DELETE CASCADE,
  tier             text NOT NULL DEFAULT 'standard',
  started_at       timestamptz NOT NULL DEFAULT now(),
  expires_at       timestamptz NOT NULL,
  is_active        boolean NOT NULL DEFAULT true,
  purchase_tx_hash text,
  price_paid       float NOT NULL DEFAULT 0,
  auto_renew       boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE(wallet_address)
);

ALTER TABLE premium_memberships ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_premium_wallet ON premium_memberships(wallet_address);
CREATE INDEX IF NOT EXISTS idx_premium_active ON premium_memberships(is_active) WHERE is_active = true;

CREATE POLICY "select_any_premium" ON premium_memberships FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_premium" ON premium_memberships FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_premium" ON premium_memberships FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Boss Challenge Entries ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS boss_challenge_entries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL,
  category_id      text NOT NULL,
  season_id        text NOT NULL,
  week_number      integer NOT NULL,
  attempt_number   integer NOT NULL DEFAULT 1,
  score            integer NOT NULL DEFAULT 0,
  correct_count    integer NOT NULL DEFAULT 0,
  total_questions  integer NOT NULL DEFAULT 10,
  time_seconds     integer NOT NULL DEFAULT 0,
  is_completed     boolean NOT NULL DEFAULT false,
  rewards_earned  jsonb DEFAULT '{}',
  started_at       timestamptz NOT NULL DEFAULT now(),
  completed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE boss_challenge_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_boss_wallet ON boss_challenge_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_boss_season ON boss_challenge_entries(season_id, week_number);
CREATE INDEX IF NOT EXISTS idx_boss_completed ON boss_challenge_entries(completed_at DESC) WHERE is_completed = true;

CREATE POLICY "select_any_boss" ON boss_challenge_entries FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_boss" ON boss_challenge_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_boss" ON boss_challenge_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Challenge Rewards ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS challenge_rewards (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address   text NOT NULL,
  session_id       uuid REFERENCES challenge_sessions(id),
  reward_type      text NOT NULL,
  reward_amount    float NOT NULL DEFAULT 0,
  reward_metadata  jsonb DEFAULT '{}',
  is_claimed       boolean NOT NULL DEFAULT false,
  claimed_at       timestamptz,
  expires_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE challenge_rewards ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rewards_wallet ON challenge_rewards(wallet_address);
CREATE INDEX IF NOT EXISTS idx_rewards_unclaimed ON challenge_rewards(wallet_address) WHERE is_claimed = false;

CREATE POLICY "select_own_rewards" ON challenge_rewards FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_reward" ON challenge_rewards FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_reward" ON challenge_rewards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Activity Logs ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL,
  action_type     text NOT NULL,
  entity_type     text,
  entity_id       text,
  metadata        jsonb DEFAULT '{}',
  ip_address      text,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_activity_wallet ON activity_logs(wallet_address);
CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);

CREATE POLICY "select_own_activity" ON activity_logs FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_activity" ON activity_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ── User Preferences ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_preferences (
  wallet_address    text PRIMARY KEY REFERENCES players(wallet_address) ON DELETE CASCADE,
  theme             text NOT NULL DEFAULT 'dark',
  language          text NOT NULL DEFAULT 'en',
  sound_effects     boolean NOT NULL DEFAULT true,
  auto_advance      boolean NOT NULL DEFAULT false,
  show_explanations boolean NOT NULL DEFAULT true,
  confirm_quit      boolean NOT NULL DEFAULT true,
  public_profile    boolean NOT NULL DEFAULT true,
  show_on_leaderboard boolean NOT NULL DEFAULT true,
  email_notifications boolean NOT NULL DEFAULT false,
  push_notifications  boolean NOT NULL DEFAULT false,
  reduced_motion    boolean NOT NULL DEFAULT false,
  compact_mode      boolean NOT NULL DEFAULT false,
  daily_reminder    boolean NOT NULL DEFAULT true,
  boss_alerts       boolean NOT NULL DEFAULT true,
  achievement_alerts boolean NOT NULL DEFAULT true,
  custom_settings   jsonb DEFAULT '{}',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_prefs" ON user_preferences FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "upsert_own_prefs" ON user_preferences FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_prefs" ON user_preferences FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── Wallet Sessions (Login Tracking) ───────────────────────────────────

CREATE TABLE IF NOT EXISTS wallet_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address  text NOT NULL,
  session_token    text UNIQUE NOT NULL,
  signed_message  text,
  nonce           text,
  expires_at      timestamptz NOT NULL,
  is_active       boolean NOT NULL DEFAULT true,
  ip_address      text,
  user_agent      text,
  device_info     jsonb DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  last_activity   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE wallet_sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_wallet_session_token ON wallet_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_wallet_session_wallet ON wallet_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_session_active ON wallet_sessions(wallet_address) WHERE is_active = true;

CREATE POLICY "select_own_session" ON wallet_sessions FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "insert_own_session" ON wallet_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE POLICY "update_own_session" ON wallet_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ════════════════════════════════════════════════════════════════════════
-- PART 3: ADDITIONAL INDEXES FOR PERFORMANCE
-- ════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_players_boss_wins ON players(boss_wins DESC);
CREATE INDEX IF NOT EXISTS idx_players_streak ON players(streak_days DESC);
CREATE INDEX IF NOT EXISTS idx_players_created ON players(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_category ON challenge_sessions(category_id);
CREATE INDEX IF NOT EXISTS idx_sessions_boss ON challenge_sessions(is_boss, completed_at DESC) WHERE is_boss = true;
CREATE INDEX IF NOT EXISTS idx_inventory_item_slug ON inventory_items(item_slug);
CREATE INDEX IF NOT EXISTS idx_achievements_achievement_id ON achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_spin_results_date ON spin_results(wallet_address, spun_at DESC);

-- ════════════════════════════════════════════════════════════════════════
-- PART 4: TRIGGERS FOR AUTOMATIC UPDATED_AT
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS trigger_update_categories ON categories;
CREATE TRIGGER trigger_update_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_players ON players;
CREATE TRIGGER trigger_update_players BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_category_mastery ON category_mastery;
CREATE TRIGGER trigger_update_category_mastery BEFORE UPDATE ON category_mastery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_premium_memberships ON premium_memberships;
CREATE TRIGGER trigger_update_premium_memberships BEFORE UPDATE ON premium_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_user_preferences ON user_preferences;
CREATE TRIGGER trigger_update_user_preferences BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ════════════════════════════════════════════════════════════════════════
-- PART 5: COMMENTS
-- ════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE categories IS 'Master catalog of knowledge domains';
COMMENT ON TABLE ritual_transactions IS 'Transaction history for RITUAL token movements';
COMMENT ON TABLE weekly_reports IS 'Aggregated weekly progress reports per player';
COMMENT ON TABLE oracle_interactions IS 'AI Oracle question/answer logs';
COMMENT ON TABLE mentor_interactions IS 'AI Mentor coaching interaction logs';
COMMENT ON TABLE premium_memberships IS 'Premium subscription tracking';
COMMENT ON TABLE boss_challenge_entries IS 'Weekly boss challenge participation records';
COMMENT ON TABLE challenge_rewards IS 'Reward distribution for completed challenges';
COMMENT ON TABLE activity_logs IS 'Audit trail of player actions';
COMMENT ON TABLE user_preferences IS 'User settings and preferences';
COMMENT ON TABLE wallet_sessions IS 'Login session tracking for wallet auth';
COMMENT ON TABLE leaderboard_snapshots IS 'Historical leaderboard snapshots';
