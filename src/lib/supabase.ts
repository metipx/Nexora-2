import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// ── Database types ────────────────────────────────────────────────────────

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

export interface Achievement {
  id:             string;
  wallet_address: string;
  achievement_id: string;
  unlocked_at:    string;
}

export interface DailyCompletion {
  id:             string;
  wallet_address: string;
  challenge_date: string;
  completed_at:   string;
  xp_awarded:     number;
}

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
  effect_value:   number;
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

export interface SpinResult {
  id:             string;
  wallet_address: string;
  reward_type:    string;
  reward_value:   string;
  spun_at:        string;
}

// ── DB helpers ────────────────────────────────────────────────────────────

export async function getOrCreatePlayer(walletAddress: string): Promise<Player> {
  const addr = walletAddress.toLowerCase();
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

  return created as Player;
}

export async function updatePlayer(walletAddress: string, updates: Partial<Player>): Promise<void> {
  const { error } = await supabase
    .from('players')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('wallet_address', walletAddress.toLowerCase());
  if (error) throw error;
}

export async function getCategoryMastery(walletAddress: string): Promise<CategoryMastery[]> {
  const { data, error } = await supabase
    .from('category_mastery')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase());
  if (error) throw error;
  return (data ?? []) as CategoryMastery[];
}

export async function getRecentSessions(walletAddress: string, limit = 10): Promise<ChallengeSession[]> {
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('completed_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ChallengeSession[];
}

export async function getLeaderboard(limit = 25): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('rank_score', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Player[];
}

export async function getWeeklyLeaderboard(limit = 25): Promise<{ wallet_address: string; username: string; rank_tier: string; weekly_xp: number; weekly_correct: number }[]> {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data, error } = await supabase
    .from('challenge_sessions')
    .select('wallet_address, score, correct_count')
    .gte('completed_at', weekAgo);
  if (error) throw error;

  const map: Record<string, { weekly_xp: number; weekly_correct: number }> = {};
  for (const s of data ?? []) {
    if (!map[s.wallet_address]) map[s.wallet_address] = { weekly_xp: 0, weekly_correct: 0 };
    map[s.wallet_address].weekly_xp      += s.score ?? 0;
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

export async function getPlayerAchievements(walletAddress: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('unlocked_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Achievement[];
}

export async function checkDailyCompleted(walletAddress: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('daily_challenge_completions')
    .select('id')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('challenge_date', today)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

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
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('purchased_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as InventoryItem[];
}

export async function purchaseItem(walletAddress: string, itemSlug: string, txHash?: string): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      wallet_address:   walletAddress.toLowerCase(),
      item_slug:        itemSlug,
      quantity:         1,
      transaction_hash: txHash ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as InventoryItem;
}

export async function activateItem(itemId: string, expiresAt?: string): Promise<void> {
  const { error } = await supabase
    .from('inventory_items')
    .update({ is_active: true, activated_at: new Date().toISOString(), expires_at: expiresAt ?? null })
    .eq('id', itemId);
  if (error) throw error;
}

export async function getSpinHistory(walletAddress: string): Promise<SpinResult[]> {
  const { data, error } = await supabase
    .from('spin_results')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('spun_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as SpinResult[];
}

export async function recordSpin(walletAddress: string, rewardType: string, rewardValue: string): Promise<void> {
  await supabase.from('spin_results').insert({ wallet_address: walletAddress.toLowerCase(), reward_type: rewardType, reward_value: rewardValue });
  await supabase.from('players').update({ spin_last_date: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString() }).eq('wallet_address', walletAddress.toLowerCase());
}

// ── Rank calculation ──────────────────────────────────────────────────────

export function calculateRankScore(p: Pick<Player, 'total_xp' | 'accuracy_rate' | 'total_correct' | 'streak_days' | 'boss_wins'>): number {
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
  if (score >= 6000)  return 'platinum';
  if (score >= 3000)  return 'gold';
  if (score >= 1000)  return 'silver';
  return 'bronze';
}

// ── XP helpers ────────────────────────────────────────────────────────────

export const XP_BY_DIFFICULTY: Record<string, number> = {
  easy:      50,
  medium:    100,
  hard:      175,
  very_hard: 275,
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
  const start = level <= XP_THRESHOLDS.length ? XP_THRESHOLDS[level - 1] : Math.floor(1000 * Math.pow(level - 1, 1.6));
  return totalXp - start;
}

export function xpForNextLevel(totalXp: number): number {
  const level = levelForXp(totalXp);
  const start = level <= XP_THRESHOLDS.length ? XP_THRESHOLDS[level - 1] : Math.floor(1000 * Math.pow(level - 1, 1.6));
  const end   = (level + 1) <= XP_THRESHOLDS.length ? XP_THRESHOLDS[level] : Math.floor(1000 * Math.pow(level, 1.6));
  return end - start;
}
