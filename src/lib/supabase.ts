import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ════════════════════════════════════════════════════════════════════════
// DATABASE TYPES
// ════════════════════════════════════════════════════════════════════════

// ── Core Player ──────────────────────────────────────────────────────────

export interface Player {
  wallet_address:     string;
  username:           string;
  level:              number;
  total_xp:           number;
  current_xp:         number;
  rank_score:         number;
  rank_tier:          string;
  streak_days:        number;
  streak_shield:      boolean;
  last_activity_date: string | null;
  accuracy_rate:      number;
  total_correct:      number;
  total_answered:     number;
  boss_wins:          number;
  premium_until:      string | null;
  ritual_balance:     number;
  spin_last_date:     string | null;
  created_at:         string;
  updated_at:         string;
}

// ── Categories ─────────────────────────────────────────────────────────────

export interface Category {
  id:           string;
  label:        string;
  description:  string;
  icon:         string;
  color:        string;
  unlock_level: number;
  sort_order:   number;
  is_active:    boolean;
  created_at:   string;
  updated_at:   string;
}

export interface CategoryMastery {
  id:             string;
  wallet_address: string;
  category_id:    string;
  mastery_level:  number;
  mastery_xp:     number;
  total_correct:  number;
  total_answered: number;
  created_at:     string;
  updated_at:     string;
}

// ── Challenges ────────────────────────────────────────────────────────────

export interface ChallengeSession {
  id:               string;
  wallet_address:   string;
  category_id:      string;
  difficulty:       string;
  score:            number;
  correct_count:    number;
  total_questions:  number;
  duration_seconds: number;
  is_daily:         boolean;
  is_boss:          boolean;
  completed_at:     string;
}

export interface ChallengeQuestion {
  id:             string;
  session_id:     string;
  wallet_address: string;
  category_id:    string;
  difficulty:     string;
  question_text:  string;
  correct_answer: string;
  player_answer:  string | null;
  is_correct:     boolean | null;
  time_taken_ms:  number | null;
  xp_awarded:     number;
  answered_at:    string;
}

// ── Achievements ──────────────────────────────────────────────────────────

export interface Achievement {
  id:             string;
  wallet_address: string;
  achievement_id: string;
  unlocked_at:    string;
}

// ── Daily Challenge ─────────────────────────────────────────────────────

export interface DailyCompletion {
  id:             string;
  wallet_address: string;
  challenge_date: string;
  completed_at:   string;
  xp_awarded:     number;
}

// ── Shop & Inventory ─────────────────────────────────────────────────────

export interface ShopItem {
  id:             string;
  slug:           string;
  name:           string;
  description:    string;
  category:       string;
  price_ritual:   number;
  rarity:         string;
  duration_hours: number | null;
  effect_type:    string;
  effect_value:    number;
  is_active:      boolean;
  created_at:     string;
}

export interface InventoryItem {
  id:               string;
  wallet_address:   string;
  item_slug:        string;
  quantity:         number;
  purchased_at:     string;
  activated_at:     string | null;
  expires_at:       string | null;
  is_active:        boolean;
  transaction_hash: string | null;
  created_at:       string;
}

// ── Spin ──────────────────────────────────────────────────────────────────

export interface SpinResult {
  id:             string;
  wallet_address: string;
  reward_type:    string;
  reward_value:   string;
  spun_at:        string;
}

// ── Transactions ─────────────────────────────────────────────────────────

export interface RitualTransaction {
  id:               string;
  wallet_address:   string;
  transaction_type: string;
  amount:           number;
  balance_before:   number;
  balance_after:    number;
  item_slug:        string | null;
  item_name:        string | null;
  tx_hash:          string | null;
  network:          string;
  status:           string;
  failure_reason:   string | null;
  metadata:         Record<string, unknown>;
  created_at:       string;
  confirmed_at:     string | null;
}

// ── Weekly Reports ──────────────────────────────────────────────────────

export interface WeeklyReport {
  id:                  string;
  wallet_address:      string;
  week_start_date:     string;
  week_end_date:       string;
  xp_earned:           number;
  questions_answered:  number;
  correct_answers:     number;
  accuracy_rate:       number;
  sessions_completed:  number;
  boss_challenges:     number;
  rank_change:         number;
  achievements_unlocked: string[];
  summary:             Record<string, unknown>;
  created_at:          string;
}

// ── Oracle & Mentor ──────────────────────────────────────────────────────

export interface OracleInteraction {
  id:             string;
  wallet_address: string;
  category_id:    string | null;
  difficulty:     string | null;
  prompt_summary: string;
  response:       string;
  confidence:     number;
  model_used:     string;
  tokens_used:    number;
  latency_ms:     number | null;
  user_feedback:  string | null;
  created_at:     string;
}

export interface MentorInteraction {
  id:               string;
  wallet_address:   string;
  session_id:       string | null;
  question_id:      string | null;
  interaction_type: string;
  prompt_summary:   string;
  result_summary:   string;
  advice_given:     string | null;
  confidence:       number;
  was_helpful:      boolean | null;
  created_at:       string;
}

// ── Premium ──────────────────────────────────────────────────────────────

export interface PremiumMembership {
  id:               string;
  wallet_address:   string;
  tier:             string;
  started_at:       string;
  expires_at:       string;
  is_active:        boolean;
  purchase_tx_hash: string | null;
  price_paid:       number;
  auto_renew:       boolean;
  created_at:       string;
  updated_at:       string;
}

// ── Boss Challenge ──────────────────────────────────────────────────────

export interface BossChallengeEntry {
  id:              string;
  wallet_address:  string;
  category_id:     string;
  season_id:       string;
  week_number:     number;
  attempt_number:  number;
  score:           number;
  correct_count:   number;
  total_questions: number;
  time_seconds:    number;
  is_completed:    boolean;
  rewards_earned: Record<string, unknown>;
  started_at:      string;
  completed_at:    string | null;
  created_at:      string;
}

// ── Challenge Rewards ───────────────────────────────────────────────────

export interface ChallengeReward {
  id:              string;
  wallet_address:  string;
  session_id:      string | null;
  reward_type:     string;
  reward_amount:   number;
  reward_metadata: Record<string, unknown>;
  is_claimed:      boolean;
  claimed_at:      string | null;
  expires_at:      string | null;
  created_at:      string;
}

// ── Activity Logs ───────────────────────────────────────────────────────

export interface ActivityLog {
  id:             string;
  wallet_address: string;
  action_type:    string;
  entity_type:    string | null;
  entity_id:      string | null;
  metadata:       Record<string, unknown>;
  ip_address:     string | null;
  user_agent:     string | null;
  created_at:     string;
}

// ── User Preferences ────────────────────────────────────────────────────

export interface UserPreferences {
  wallet_address:        string;
  theme:                string;
  language:              string;
  sound_effects:         boolean;
  auto_advance:          boolean;
  show_explanations:     boolean;
  confirm_quit:          boolean;
  public_profile:        boolean;
  show_on_leaderboard:   boolean;
  email_notifications:   boolean;
  push_notifications:    boolean;
  reduced_motion:        boolean;
  compact_mode:          boolean;
  daily_reminder:        boolean;
  boss_alerts:           boolean;
  achievement_alerts:    boolean;
  custom_settings:       Record<string, unknown>;
  created_at:            string;
  updated_at:            string;
}

// ── Wallet Sessions ─────────────────────────────────────────────────────

export interface WalletSession {
  id:             string;
  wallet_address: string;
  session_token:  string;
  signed_message: string | null;
  nonce:          string | null;
  expires_at:     string;
  is_active:      boolean;
  ip_address:     string | null;
  user_agent:     string | null;
  device_info:    Record<string, unknown>;
  created_at:     string;
  last_activity:  string;
}

// ── Leaderboard Snapshots ───────────────────────────────────────────────

export interface LeaderboardSnapshot {
  id:            string;
  snapshot_date: string;
  snapshot_type: string;
  rankings:      Array<{
    wallet_address: string;
    username:       string;
    rank_tier:      string;
    rank_score:     number;
    position:       number;
  }>;
  player_count:  number;
  created_at:    string;
}

// ════════════════════════════════════════════════════════════════════════
// PLAYER HELPERS
// ════════════════════════════════════════════════════════════════════════

function normalizeWallet(address: string): string {
  return address.toLowerCase();
}

export async function getOrCreatePlayer(walletAddress: string): Promise<Player> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('wallet_address', addr)
    .maybeSingle();

  if (error) throw error;
  if (data) return data as Player;

  const { data: created, error: createErr } = await supabase
    .from('players')
    .insert({ wallet_address: addr })
    .select('*')
    .single();

  if (createErr) throw createErr;

  // Grant first_login achievement
  await supabase.from('achievements').upsert(
    [{ wallet_address: addr, achievement_id: 'first_login' }],
    { onConflict: 'wallet_address,achievement_id' }
  );

  // Create default preferences
  await supabase.from('user_preferences').upsert(
    [{ wallet_address: addr }],
    { onConflict: 'wallet_address' }
  );

  // Log activity
  await logActivity(addr, 'player_created', 'player', addr);

  return created as Player;
}

export async function updatePlayer(walletAddress: string, updates: Partial<Player>): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  const { error } = await supabase
    .from('players')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('wallet_address', addr);
  if (error) throw error;
}

export async function getPlayerByWallet(walletAddress: string): Promise<Player | null> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('wallet_address', addr)
    .maybeSingle();
  if (error) throw error;
  return data as Player | null;
}

// ════════════════════════════════════════════════════════════════════════
// CATEGORY HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryMastery(walletAddress: string): Promise<CategoryMastery[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('category_mastery')
    .select('*')
    .eq('wallet_address', addr);
  if (error) throw error;
  return (data ?? []) as CategoryMastery[];
}

export async function upsertCategoryMastery(
  walletAddress: string,
  categoryId: string,
  updates: Partial<CategoryMastery>
): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  const { error } = await supabase
    .from('category_mastery')
    .upsert(
      { wallet_address: addr, category_id: categoryId, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'wallet_address,category_id' }
    );
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════════
// CHALLENGE HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function createSession(
  walletAddress: string,
  categoryId: string,
  options: {
    difficulty?: string;
    totalQuestions?: number;
    isDaily?: boolean;
    isBoss?: boolean;
  } = {}
): Promise<ChallengeSession> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('challenge_sessions')
    .insert({
      wallet_address: addr,
      category_id: categoryId,
      difficulty: options.difficulty ?? 'medium',
      total_questions: options.totalQuestions ?? 5,
      is_daily: options.isDaily ?? false,
      is_boss: options.isBoss ?? false,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as ChallengeSession;
}

export async function updateSession(sessionId: string, updates: Partial<ChallengeSession>): Promise<void> {
  const { error } = await supabase
    .from('challenge_sessions')
    .update(updates)
    .eq('id', sessionId);
  if (error) throw error;
}

export async function saveQuestionAnswer(
  sessionId: string,
  walletAddress: string,
  categoryId: string,
  question: {
    text: string;
    correctAnswer: string;
    playerAnswer: string;
    isCorrect: boolean;
    difficulty: string;
    timeTakenMs: number;
    xpAwarded: number;
  }
): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  const { error } = await supabase
    .from('challenge_questions')
    .insert({
      session_id: sessionId,
      wallet_address: addr,
      category_id: categoryId,
      question_text: question.text,
      correct_answer: question.correctAnswer,
      player_answer: question.playerAnswer,
      is_correct: question.isCorrect,
      difficulty: question.difficulty,
      time_taken_ms: question.timeTakenMs,
      xp_awarded: question.xpAwarded,
    });
  if (error) throw error;
}

export async function getRecentSessions(walletAddress: string, limit = 10): Promise<ChallengeSession[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('*')
    .eq('wallet_address', addr)
    .order('completed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ChallengeSession[];
}

export async function getSessionStats(walletAddress: string, days = 7): Promise<{
  totalSessions: number;
  totalXp: number;
  totalCorrect: number;
  totalQuestions: number;
}> {
  const addr = normalizeWallet(walletAddress);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('score, correct_count, total_questions')
    .eq('wallet_address', addr)
    .gte('completed_at', since);
  if (error) throw error;

  return (data ?? []).reduce(
    (acc, s) => ({
      totalSessions: acc.totalSessions + 1,
      totalXp: acc.totalXp + (s.score ?? 0),
      totalCorrect: acc.totalCorrect + (s.correct_count ?? 0),
      totalQuestions: acc.totalQuestions + (s.total_questions ?? 0),
    }),
    { totalSessions: 0, totalXp: 0, totalCorrect: 0, totalQuestions: 0 }
  );
}

// ════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getPlayerAchievements(walletAddress: string): Promise<Achievement[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('wallet_address', addr)
    .order('unlocked_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Achievement[];
}

export async function unlockAchievement(walletAddress: string, achievementId: string): Promise<boolean> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('achievements')
    .upsert(
      { wallet_address: addr, achievement_id: achievementId },
      { onConflict: 'wallet_address,achievement_id' }
    )
    .select('*')
    .single();
  if (error) {
    if (error.code === '23505') return false; // Already exists
    throw error;
  }
  return !!data;
}

// ════════════════════════════════════════════════════════════════════════
// DAILY CHALLENGE HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function checkDailyCompleted(walletAddress: string): Promise<boolean> {
  const addr = normalizeWallet(walletAddress);
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('daily_challenge_completions')
    .select('id')
    .eq('wallet_address', addr)
    .eq('challenge_date', today)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function recordDailyCompletion(walletAddress: string, xpAwarded: number): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from('daily_challenge_completions')
    .upsert(
      { wallet_address: addr, challenge_date: today, xp_awarded: xpAwarded },
      { onConflict: 'wallet_address,challenge_date' }
    );
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════════
// SHOP & INVENTORY HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getShopItems(): Promise<ShopItem[]> {
  const { data, error } = await supabase
    .from('shop_items')
    .select('*')
    .eq('is_active', true)
    .order('price_ritual', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ShopItem[];
}

export async function getInventory(walletAddress: string): Promise<InventoryItem[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('wallet_address', addr)
    .order('purchased_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InventoryItem[];
}

export async function purchaseItem(
  walletAddress: string,
  itemSlug: string,
  txHash?: string
): Promise<InventoryItem> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      wallet_address: addr,
      item_slug: itemSlug,
      quantity: 1,
      transaction_hash: txHash ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;

  // Log transaction
  await createTransaction(addr, 'purchase', 0, {
    item_slug: itemSlug,
    tx_hash: txHash,
  });

  return data as InventoryItem;
}

export async function activateItem(itemId: string, expiresAt?: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .update({
      is_active: true,
      activated_at: new Date().toISOString(),
      expires_at: expiresAt ?? null,
    })
    .eq('id', itemId);
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════════
// SPIN HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getSpinHistory(walletAddress: string, limit = 20): Promise<SpinResult[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('spin_results')
    .select('*')
    .eq('wallet_address', addr)
    .order('spun_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as SpinResult[];
}

export async function recordSpin(walletAddress: string, rewardType: string, rewardValue: string): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  await supabase.from('spin_results').insert({
    wallet_address: addr,
    reward_type: rewardType,
    reward_value: rewardValue,
  });
  await supabase
    .from('players')
    .update({
      spin_last_date: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    })
    .eq('wallet_address', addr);
}

export async function canSpinToday(walletAddress: string): Promise<boolean> {
  const addr = normalizeWallet(walletAddress);
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('spin_results')
    .select('id')
    .eq('wallet_address', addr)
    .gte('spun_at', `${today}T00:00:00`)
    .lte('spun_at', `${today}T23:59:59`)
    .maybeSingle();
  if (error) throw error;
  return !data;
}

// ════════════════════════════════════════════════════════════════════════
// TRANSACTION HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function createTransaction(
  walletAddress: string,
  transactionType: string,
  amount: number,
  metadata: {
    itemSlug?: string;
    itemName?: string;
    txHash?: string;
    balanceBefore?: number;
    balanceAfter?: number;
  } = {}
): Promise<RitualTransaction> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('ritual_transactions')
    .insert({
      wallet_address: addr,
      transaction_type: transactionType,
      amount,
      item_slug: metadata.itemSlug ?? null,
      item_name: metadata.itemName ?? null,
      tx_hash: metadata.txHash ?? null,
      balance_before: metadata.balanceBefore ?? 0,
      balance_after: metadata.balanceAfter ?? 0,
      status: 'completed',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as RitualTransaction;
}

export async function getTransactionHistory(
  walletAddress: string,
  limit = 50
): Promise<RitualTransaction[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('ritual_transactions')
    .select('*')
    .eq('wallet_address', addr)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as RitualTransaction[];
}

// ════════════════════════════════════════════════════════════════════════
// LEADERBOARD HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getLeaderboard(limit = 25): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('rank_score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function getWeeklyLeaderboard(limit = 25): Promise<{
  wallet_address: string;
  username: string;
  rank_tier: string;
  weekly_xp: number;
  weekly_correct: number;
}[]> {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('wallet_address, score, correct_count')
    .gte('completed_at', weekAgo);
  if (error) throw error;

  const map: Record<string, { weekly_xp: number; weekly_correct: number }> = {};
  for (const s of data ?? []) {
    if (!map[s.wallet_address]) map[s.wallet_address] = { weekly_xp: 0, weekly_correct: 0 };
    map[s.wallet_address].weekly_xp += s.score ?? 0;
    map[s.wallet_address].weekly_correct += s.correct_count ?? 0;
  }

  const wallets = Object.keys(map);
  if (wallets.length === 0) return [];

  const { data: players } = await supabase
    .from('players')
    .select('wallet_address, username, rank_tier')
    .in('wallet_address', wallets);

  return (players ?? [])
    .map(p => ({ ...p, ...map[p.wallet_address] }))
    .sort((a, b) => b.weekly_xp - a.weekly_xp)
    .slice(0, limit);
}

export async function getBossLeaderboard(limit = 25): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('boss_wins', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Player[];
}

// ════════════════════════════════════════════════════════════════════════
// WEEKLY REPORT HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getWeeklyReports(walletAddress: string, limit = 12): Promise<WeeklyReport[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('wallet_address', addr)
    .order('week_start_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as WeeklyReport[];
}

export async function createWeeklyReport(report: Omit<WeeklyReport, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('weekly_reports')
    .upsert(report, { onConflict: 'wallet_address,week_start_date' });
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════════
// PREMIUM HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getPremiumMembership(walletAddress: string): Promise<PremiumMembership | null> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('premium_memberships')
    .select('*')
    .eq('wallet_address', addr)
    .maybeSingle();
  if (error) throw error;
  return data as PremiumMembership | null;
}

export async function isPremiumActive(walletAddress: string): Promise<boolean> {
  const membership = await getPremiumMembership(walletAddress);
  if (!membership) return false;
  return membership.is_active && new Date(membership.expires_at) > new Date();
}

// ════════════════════════════════════════════════════════════════════════
// BOSS CHALLENGE HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function createBossEntry(
  walletAddress: string,
  categoryId: string,
  seasonId: string,
  weekNumber: number
): Promise<BossChallengeEntry> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('boss_challenge_entries')
    .insert({
      wallet_address: addr,
      category_id: categoryId,
      season_id: seasonId,
      week_number: weekNumber,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as BossChallengeEntry;
}

export async function updateBossEntry(
  entryId: string,
  updates: Partial<BossChallengeEntry>
): Promise<void> {
  const { error } = await supabase
    .from('boss_challenge_entries')
    .update(updates)
    .eq('id', entryId);
  if (error) throw error;
}

export async function getBossEntries(
  walletAddress: string,
  limit = 10
): Promise<BossChallengeEntry[]> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('boss_challenge_entries')
    .select('*')
    .eq('wallet_address', addr)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as BossChallengeEntry[];
}

// ════════════════════════════════════════════════════════════════════════
// USER PREFERENCES HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function getUserPreferences(walletAddress: string): Promise<UserPreferences | null> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('wallet_address', addr)
    .maybeSingle();
  if (error) throw error;
  return data as UserPreferences | null;
}

export async function updateUserPreferences(
  walletAddress: string,
  updates: Partial<UserPreferences>
): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { wallet_address: addr, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'wallet_address' }
    );
  if (error) throw error;
}

// ════════════════════════════════════════════════════════════════════════
// ACTIVITY LOGGING
// ════════════════════════════════════════════════════════════════════════

export async function logActivity(
  walletAddress: string,
  actionType: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const addr = normalizeWallet(walletAddress);
  await supabase.from('activity_logs').insert({
    wallet_address: addr,
    action_type: actionType,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    metadata: metadata ?? {},
  });
}

// ════════════════════════════════════════════════════════════════════════
// RANK CALCULATION
// ════════════════════════════════════════════════════════════════════════

export function calculateRankScore(
  p: Pick<Player, 'total_xp' | 'accuracy_rate' | 'total_correct' | 'streak_days' | 'boss_wins'>
): number {
  return Math.floor(
    p.total_xp * 1 +
    p.accuracy_rate * p.total_correct * 5 +
    Math.min(p.streak_days, 30) * 50 +
    p.boss_wins * 500
  );
}

export function rankTierForScore(score: number): string {
  if (score >= 20000) return 'nexora';
  if (score >= 10000) return 'diamond';
  if (score >= 6000) return 'platinum';
  if (score >= 3000) return 'gold';
  if (score >= 1000) return 'silver';
  return 'bronze';
}

// ════════════════════════════════════════════════════════════════════════
// XP HELPERS
// ════════════════════════════════════════════════════════════════════════

export const XP_BY_DIFFICULTY: Record<string, number> = {
  easy:       50,
  medium:     100,
  hard:       175,
  very_hard:  275,
};

const XP_THRESHOLDS = [0, 150, 400, 750, 1200, 1800, 2600, 3500, 4600, 6000];

export function levelForXp(totalXp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function xpInCurrentLevel(totalXp: number): number {
  const level = levelForXp(totalXp);
  const start = level <= XP_THRESHOLDS.length
    ? XP_THRESHOLDS[level - 1]
    : Math.floor(1000 * Math.pow(level - 1, 1.6));
  return totalXp - start;
}

export function xpForNextLevel(totalXp: number): number {
  const level = levelForXp(totalXp);
  const start = level <= XP_THRESHOLDS.length
    ? XP_THRESHOLDS[level - 1]
    : Math.floor(1000 * Math.pow(level - 1, 1.6));
  const end = (level + 1) <= XP_THRESHOLDS.length
    ? XP_THRESHOLDS[level]
    : Math.floor(1000 * Math.pow(level, 1.6));
  return end - start;
}

// ════════════════════════════════════════════════════════════════════════
// WALLET SESSION HELPERS
// ════════════════════════════════════════════════════════════════════════

export async function createWalletSession(
  walletAddress: string,
  sessionToken: string,
  expiresAt: Date
): Promise<WalletSession> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('wallet_sessions')
    .insert({
      wallet_address: addr,
      session_token: sessionToken,
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as WalletSession;
}

export async function getActiveSession(walletAddress: string): Promise<WalletSession | null> {
  const addr = normalizeWallet(walletAddress);
  const { data, error } = await supabase
    .from('wallet_sessions')
    .select('*')
    .eq('wallet_address', addr)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as WalletSession | null;
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  await supabase
    .from('wallet_sessions')
    .update({ is_active: false })
    .eq('session_token', sessionToken);
}
