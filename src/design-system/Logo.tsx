/**
 * Nexora Logo System
 *
 * The Nexora sigil is an angular endless-knot mark — an interlocking
 * geometric pattern symbolizing interconnected knowledge and infinite
 * challenge. It is a transparent PNG rendered light/silver, which means:
 *
 *   - On dark backgrounds: glows naturally as a silver luminous mark
 *   - Tinting is applied via CSS filter chains (no SVG recoloring needed)
 *   - Transparency is always preserved — never add a background to the mark
 *
 * Usage rules:
 *   - NEVER place the mark on a light background without a dark overlay
 *   - NEVER add a background color behind the mark itself
 *   - NEVER crop or distort the mark's diamond aspect ratio
 *   - ALWAYS maintain at least 16px clearance around the mark in header
 *   - The wordmark "NEXORA" appears to the RIGHT of the mark, never below in nav
 *   - Below the mark is allowed only in loading / splash / centered contexts
 */

import type { CSSProperties } from 'react';

// Path assumes the PNG is served from /public
// Place the file at: public/nexora-sigil.png
const SIGIL_SRC = '/ritual-sigil-DrwXRH6f.png';

// ── CSS filter chains for each tint variant ───────────────────────────────
// Starting point: the sigil is near-white/silver on transparent.
// We invert it to black, then re-tint to the desired brand color.
const TINT_FILTERS = {
  // Natural silver — works on all dark backgrounds (default, no filter)
  default:  'none',

  // Pure white — maximum contrast, nav bars, loading spinner ring
  white:    'brightness(0) invert(1)',

  // Ink/slate — body text tone, muted contexts
  ink:      'brightness(0) invert(1) opacity(0.7) sepia(0.1)',

  // Accent (#A04668) — premium badge, achievement unlocks
  accent:   'brightness(0) saturate(100%) invert(32%) sepia(40%) saturate(600%) hue-rotate(288deg) brightness(130%)',

  // Ember (#D66853) — reward reveal, CTA emphasis
  ember:    'brightness(0) saturate(100%) invert(52%) sepia(70%) saturate(600%) hue-rotate(340deg) brightness(120%)',

  // Gold (#FFD700) — top-rank awards, leaderboard #1
  gold:     'brightness(0) saturate(100%) invert(88%) sepia(80%) saturate(800%) hue-rotate(8deg) brightness(105%)',

  // Diamond (#B9F2FF) — diamond tier badge, premium unlocks
  diamond:  'brightness(0) saturate(100%) invert(90%) sepia(30%) saturate(500%) hue-rotate(185deg) brightness(115%)',

  // Ghost — ultra-faint, used in watermark before opacity reduction
  ghost:    'brightness(0) invert(1) opacity(0.15)',
} as const;

export type LogoTint = keyof typeof TINT_FILTERS;

// ── Drop-shadow glows paired with each tint ───────────────────────────────
const TINT_GLOWS: Partial<Record<LogoTint, string>> = {
  accent:  'drop-shadow(0 0 12px rgba(160,70,104,0.7)) drop-shadow(0 0 24px rgba(160,70,104,0.35))',
  ember:   'drop-shadow(0 0 12px rgba(214,104,83,0.7)) drop-shadow(0 0 24px rgba(214,104,83,0.35))',
  gold:    'drop-shadow(0 0 12px rgba(255,215,0,0.7))  drop-shadow(0 0 24px rgba(255,215,0,0.35))',
  diamond: 'drop-shadow(0 0 12px rgba(185,242,255,0.7)) drop-shadow(0 0 24px rgba(185,242,255,0.3))',
  white:   'drop-shadow(0 0 8px rgba(201,218,234,0.5))',
};

// ── Component props ───────────────────────────────────────────────────────
interface LogoMarkProps {
  /** Pixel size of the square sigil mark */
  size?: number;
  tint?: LogoTint;
  /** Whether to add the glowing drop-shadow for the tint */
  glow?: boolean;
  /** Additional CSS classes */
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

interface LogoWordmarkProps extends LogoMarkProps {
  /** Show or hide the "NEXORA" wordmark next to the mark */
  showText?: boolean;
  /** Text placement relative to the mark */
  textPlacement?: 'right' | 'below';
  /** Extra text classes */
  textClassName?: string;
}

// ── NexoraMark — sigil icon only ──────────────────────────────────────────
export function NexoraMark({
  size = 32,
  tint = 'default',
  glow = false,
  className = '',
  style,
  alt = 'Nexora',
}: LogoMarkProps) {
  const baseFilter = TINT_FILTERS[tint];
  const glowFilter = glow && tint !== 'default' ? TINT_GLOWS[tint] : undefined;
  const filter     = [baseFilter, glowFilter].filter(Boolean).join(' ') || undefined;

  return (
    <img
      src={SIGIL_SRC}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      className={`block flex-shrink-0 select-none ${className}`}
      style={{
        width:  size,
        height: size,
        objectFit: 'contain',
        filter,
        ...style,
      }}
    />
  );
}

// ── NexoraWordmark — sigil + "NEXORA" text ────────────────────────────────
export function NexoraWordmark({
  size = 32,
  tint = 'default',
  glow = false,
  showText = true,
  textPlacement = 'right',
  className = '',
  textClassName = '',
  style,
}: LogoWordmarkProps) {
  const isBelow  = textPlacement === 'below';
  const fontSize = Math.round(size * 0.55);
  const subSize  = Math.round(size * 0.22);

  const textColor = tint === 'accent'  ? '#C06884'
                  : tint === 'ember'   ? '#E4907E'
                  : tint === 'gold'    ? '#FFD700'
                  : tint === 'diamond' ? '#B9F2FF'
                  : '#E2EBF4';

  return (
    <div
      className={`inline-flex ${isBelow ? 'flex-col items-center' : 'flex-row items-center'} gap-${isBelow ? '2' : '3'} ${className}`}
      style={style}
    >
      <NexoraMark size={size} tint={tint} glow={glow} />

      {showText && (
        <div className={`select-none no-select ${isBelow ? 'text-center' : ''} ${textClassName}`}>
          <div
            className="font-title font-extrabold tracking-tight leading-none"
            style={{ fontSize, color: textColor, letterSpacing: '-0.04em' }}
          >
            NEXORA
          </div>
          {isBelow && (
            <div
              className="font-title font-semibold tracking-widest uppercase mt-1 opacity-40"
              style={{ fontSize: subSize, color: textColor }}
            >
              Challenge Your Mind
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── NexoraWatermark — hero background motif ───────────────────────────────
/**
 * Watermark usage rules:
 *
 * 1. Always `position: absolute` inside a `position: relative` container
 * 2. The container must have `overflow: hidden`
 * 3. Use pointer-events: none — the watermark is never interactive
 * 4. The recommended placement is center or slightly top-right of the hero
 * 5. Size: 500–900px (use larger values on wider viewports)
 * 6. Opacity: 0.04–0.07 (the mark is light, dark BG keeps it subtle)
 * 7. A slight blur (1–2px) softens the edges without destroying geometry
 * 8. mix-blend-mode: screen allows natural blending with the dark void
 * 9. Never more than one watermark per page section
 * 10. Do not animate the watermark — it is a static, ambient element
 */
interface WatermarkProps {
  size?: number;
  opacity?: number;
  blur?: number;
  /** CSS top/left/right/bottom for positioning */
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  /** Rotation in degrees — 0 keeps the diamond orientation intact */
  rotate?: number;
  className?: string;
}

export function NexoraWatermark({
  size    = 680,
  opacity = 0.055,
  blur    = 1,
  top,
  left,
  right,
  bottom,
  rotate  = 0,
  className = '',
}: WatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        top,
        left,
        right,
        bottom,
        width:         size,
        height:        size,
        opacity,
        filter:        blur > 0 ? `blur(${blur}px)` : undefined,
        transform:     rotate !== 0 ? `rotate(${rotate}deg)` : undefined,
        mixBlendMode:  'screen',
        zIndex:        0,
      }}
    >
      <img
        src={SIGIL_SRC}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{
          width:     '100%',
          height:    '100%',
          objectFit: 'contain',
          // Keep the sigil's natural silver tone — on screen blend mode it glows softly
          filter:    'brightness(1.2) saturate(0.6)',
        }}
      />
    </div>
  );
}

// ── NexoraLoadingMark — animated splash screen brand mark ─────────────────
export function NexoraLoadingMark({ size = 80 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer pulse ring */}
      <div
        className="absolute inset-0 rounded-full animate-ping-once"
        style={{
          background:    'radial-gradient(circle, rgba(160,70,104,0.2) 0%, transparent 70%)',
          animationDuration: '2s',
          animationIterationCount: 'infinite',
        }}
      />
      {/* Glow halo */}
      <div
        className="absolute animate-pulse-glow rounded-full"
        style={{
          width:      size * 1.2,
          height:     size * 1.2,
          background: 'radial-gradient(circle, rgba(160,70,104,0.15) 0%, transparent 70%)',
          top:        -(size * 0.1),
          left:       -(size * 0.1),
        }}
      />
      <NexoraMark
        size={size}
        tint="accent"
        glow
        className="animate-float relative z-10"
      />
    </div>
  );
}

// ── NexoraFaviconMark — smallest use (16–32px) ────────────────────────────
export function NexoraFaviconMark({ size = 24 }: { size?: number }) {
  return (
    <NexoraMark
      size={size}
      tint="white"
      alt="Nexora"
    />
  );
}

// ── NexoraAchievementMark — achievement / badge context ───────────────────
export function NexoraAchievementMark({
  size     = 40,
  tier     = 'accent',
  animate  = false,
}: {
  size?:   number;
  tier?:   'accent' | 'ember' | 'gold' | 'diamond';
  animate?: boolean;
}) {
  return (
    <NexoraMark
      size={size}
      tint={tier}
      glow
      className={animate ? 'animate-pulse-glow' : ''}
    />
  );
}

// ── Usage rule constants (for documentation / runtime checks) ─────────────
export const LOGO_USAGE_RULES = {
  header: {
    size:      32,
    tint:      'default' as LogoTint,
    glow:      false,
    placement: 'right',
    clearance: 16,
    notes:     'Wordmark with text to the right. Never below in horizontal nav.',
  },
  sidebar: {
    size:      28,
    tint:      'default' as LogoTint,
    glow:      false,
    placement: 'right',
    notes:     'Compact wordmark. Collapse to mark-only on narrow sidebars.',
  },
  mobile: {
    size:      24,
    tint:      'default' as LogoTint,
    glow:      false,
    placement: 'mark-only',
    notes:     'Mark only at mobile breakpoint. No wordmark.',
  },
  favicon: {
    size:      16,
    tint:      'white' as LogoTint,
    glow:      false,
    notes:     'Pure white tint. Square canvas with 2px padding.',
  },
  loading: {
    size:      80,
    tint:      'accent' as LogoTint,
    glow:      true,
    animate:   true,
    notes:     'Floating animation + pulse glow ring. Centered on void background.',
  },
  achievement: {
    size:      40,
    tint:      'accent' as LogoTint,
    glow:      true,
    notes:     'Accent tint with glow. Used inside achievement card / modal header.',
  },
  reward: {
    size:      48,
    tint:      'ember' as LogoTint,
    glow:      true,
    notes:     'Ember tint with glow. Reward reveal, XP milestone popups.',
  },
  premium: {
    size:      36,
    tint:      'gold' as LogoTint,
    glow:      true,
    animate:   true,
    notes:     'Gold tint, pulsing glow. Premium features, Nexora Elite rank.',
  },
  watermark: {
    size:      680,
    opacity:   0.055,
    blur:      1,
    position:  'absolute, centered in hero section',
    blendMode: 'screen',
    notes:     'Never interactive. Never animated. One per section maximum.',
  },
} as const;
