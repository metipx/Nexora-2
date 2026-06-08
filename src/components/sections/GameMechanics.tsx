import { Zap, Flame, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const RANK_TIERS_DISPLAY = [
  { label: 'Bronze',       color: '#CD7F32', pct: 17  },
  { label: 'Silver',       color: '#A0A9BA', pct: 33  },
  { label: 'Gold',         color: '#FFB84D', pct: 50  },
  { label: 'Platinum',     color: '#8FCDDD', pct: 67  },
  { label: 'Diamond',      color: '#B9F2FF', pct: 83  },
  { label: 'Nexora Elite', color: '#9B81FF', pct: 100 },
];

export default function GameMechanicsSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0B1020 0%, #0D1223 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.25)', color: '#9B81FF' }}
          >
            <Sparkles size={11} /> Progression System
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            Every Action Feels Alive
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(230,237,247,0.5)' }}>
            XP, ranks, streaks, and achievements create a feedback loop that makes learning genuinely addictive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <XpLevelCard visible={visible} />
          <RankSystemCard visible={visible} />
          <StreakCard visible={visible} />
        </div>
      </div>
    </section>
  );
}

function XpLevelCard({ visible }: { visible: boolean }) {
  const { ref, v } = useRevealLocal();

  return (
    <div
      ref={ref}
      className="p-6 flex flex-col gap-5 rounded-2xl transition-all duration-700"
      style={{
        background:      'linear-gradient(145deg, rgba(124,92,252,0.1) 0%, rgba(28,38,64,0.95) 55%, rgba(20,27,45,0.98) 100%)',
        border:          '1px solid rgba(124,92,252,0.2)',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.4)',
        opacity:         v ? 1 : 0,
        transform:       v ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: '0ms',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)', color: '#9B81FF' }}
        >
          <Zap size={22} />
        </div>
        <span
          className="text-xs font-title font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)', color: '#9B81FF' }}
        >
          Per Answer
        </span>
      </div>
      <div>
        <h3 className="font-title font-bold text-xl mb-2" style={{ color: '#E6EDF7' }}>XP &amp; Levels</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,237,247,0.5)' }}>
          Every correct answer awards XP. XP accumulates into levels. Higher levels unlock
          new categories and rank eligibility.
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="nx-stat-label">Level 12</span>
          <span className="font-title font-semibold text-sm" style={{ color: '#9B81FF' }}>3,400 / 4,200 XP</span>
        </div>
        <div className="nx-xp-bar-track nx-xp-bar-track-lg">
          <div
            className="nx-xp-bar-fill"
            style={{ width: v ? '81%' : '0%', transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.4s' }}
          />
        </div>
        <div className="flex items-center justify-between text-2xs" style={{ color: 'rgba(230,237,247,0.3)' }}>
          <span>+125 XP next correct answer</span>
          <span>Lv 13 in 800 XP</span>
        </div>
      </div>
    </div>
  );
}

function RankSystemCard({ visible }: { visible: boolean }) {
  const { ref, v } = useRevealLocal();

  return (
    <div
      ref={ref}
      className="p-6 flex flex-col gap-5 rounded-2xl transition-all duration-700"
      style={{
        background:      'linear-gradient(145deg, rgba(28,38,64,0.9) 0%, rgba(20,27,45,0.95) 100%)',
        border:          '1px solid rgba(230,237,247,0.07)',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.4)',
        opacity:         v ? 1 : 0,
        transform:       v ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: '120ms',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.25)', color: '#FFB84D' }}
        >
          <Crown size={22} />
        </div>
        <span
          className="text-xs font-title font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.22)', color: '#FFD080' }}
        >
          6 Tiers
        </span>
      </div>
      <div>
        <h3 className="font-title font-bold text-xl mb-2" style={{ color: '#E6EDF7' }}>Rank System</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,237,247,0.5)' }}>
          Rank score combines XP, accuracy, streak, and boss activity. Computed hourly.
        </p>
      </div>
      <div className="space-y-1.5">
        {RANK_TIERS_DISPLAY.map((tier, i) => (
          <div key={tier.label} className="flex items-center gap-3">
            <div className="w-24 text-right">
              <span className="text-2xs font-title font-semibold" style={{ color: tier.color }}>{tier.label}</span>
            </div>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: 'rgba(11,16,32,0.8)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  background:  `linear-gradient(90deg, ${tier.color}66, ${tier.color})`,
                  width:        v ? `${tier.pct}%` : '0%',
                  transition:  `width 0.8s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.08}s`,
                  boxShadow:   i === 5 ? `0 0 6px ${tier.color}80` : 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreakCard({ visible }: { visible: boolean }) {
  const { ref, v } = useRevealLocal();
  const days   = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const active = [true, true, true, true, true, false, false];

  return (
    <div
      ref={ref}
      className="p-6 flex flex-col gap-5 rounded-2xl transition-all duration-700"
      style={{
        background:      'linear-gradient(145deg, rgba(0,200,150,0.08) 0%, rgba(28,38,64,0.95) 55%, rgba(20,27,45,0.98) 100%)',
        border:          '1px solid rgba(0,200,150,0.18)',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.4)',
        opacity:         v ? 1 : 0,
        transform:       v ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: '240ms',
      }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.28)', color: '#33E8B8' }}
        >
          <Flame size={22} />
        </div>
        <span
          className="text-xs font-title font-bold px-3 py-1 rounded-full"
          style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.22)', color: '#33E8B8' }}
        >
          ×2 XP Active
        </span>
      </div>
      <div>
        <h3 className="font-title font-bold text-xl mb-2" style={{ color: '#E6EDF7' }}>Daily Streaks</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,237,247,0.5)' }}>
          Play every day to grow your streak. Active streaks multiply XP earned. Miss a day and it resets.
        </p>
      </div>
      <div
        className="flex items-center gap-4 p-4 rounded-xl"
        style={{ background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.18)' }}
      >
        <div className="text-4xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,184,77,0.7))' }}>🔥</div>
        <div>
          <div className="font-title font-extrabold text-3xl leading-none" style={{ color: '#33E8B8' }}>21</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(230,237,247,0.4)' }}>Day streak — keep going</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <div
              className="w-full aspect-square rounded-lg flex items-center justify-center"
              style={{
                background: active[i] ? 'rgba(0,200,150,0.2)' : 'rgba(11,16,32,0.8)',
                border:     active[i] ? '1px solid rgba(0,200,150,0.45)' : '1px solid rgba(230,237,247,0.07)',
                boxShadow:  active[i] ? '0 0 6px rgba(0,200,150,0.25)' : 'none',
              }}
            >
              {active[i] && <Flame size={10} style={{ color: '#33E8B8' }} />}
            </div>
            <span className="text-2xs" style={{ color: 'rgba(230,237,247,0.25)' }}>{d}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <TrendingUp size={13} style={{ color: '#00C896' }} />
        <span className="text-xs" style={{ color: 'rgba(230,237,247,0.4)' }}>Multiplier increases at 7, 14, 21, 30 days</span>
      </div>
    </div>
  );
}

function useRevealLocal() {
  const { ref, visible: v } = useReveal();
  return { ref, v };
}
