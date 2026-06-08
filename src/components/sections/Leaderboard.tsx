import { Trophy, TrendingUp, ArrowUp, Zap } from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const TOP_PLAYERS = [
  { pos: 1, name: 'cosmicbrain',  tier: 'Nexora Elite', tColor: '#9B81FF', score: '28,450', delta: '+3',  bg: 'rgba(124,92,252,0.15)' },
  { pos: 2, name: 'void_sage',    tier: 'Diamond',      tColor: '#B9F2FF', score: '24,100', delta: '—',   bg: 'rgba(0,212,255,0.1)' },
  { pos: 3, name: 'datastreamer', tier: 'Platinum',     tColor: '#8FCDDD', score: '19,880', delta: '+1',  bg: 'rgba(143,205,221,0.1)' },
  { pos: 4, name: 'neural_ace',   tier: 'Gold',         tColor: '#FFB84D', score: '14,650', delta: '+5',  bg: 'rgba(255,184,77,0.12)' },
  { pos: 5, name: 'quizmaster88', tier: 'Gold',         tColor: '#FFB84D', score: '12,300', delta: '-2',  bg: 'rgba(255,184,77,0.08)' },
];

const POS_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="leaderboard"
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0B1020 0%, #0D1223 100%)' }}
    >
      {/* Ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255,184,77,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.25)', color: '#FFD080' }}
          >
            <Trophy size={11} /> Global Rankings
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            The Rankings
          </h2>
          <p className="text-lg" style={{ color: 'rgba(230,237,247,0.5)' }}>
            Recalculated hourly. Rank score factors in XP, accuracy, streak, and boss performance.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden transition-all duration-700"
          style={{
            background:      'linear-gradient(145deg, rgba(28,38,64,0.9) 0%, rgba(20,27,45,0.95) 100%)',
            border:          '1px solid rgba(230,237,247,0.08)',
            boxShadow:       '0 4px 20px rgba(0,0,0,0.5)',
            opacity:         visible ? 1 : 0,
            transform:       visible ? 'translateY(0)' : 'translateY(32px)',
            transitionDelay: '150ms',
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: 'rgba(11,16,32,0.5)', borderBottom: '1px solid rgba(230,237,247,0.07)' }}
          >
            <div className="flex items-center gap-2">
              <Trophy size={15} style={{ color: '#FFB84D' }} />
              <span className="font-title font-bold text-sm" style={{ color: '#E6EDF7' }}>Global Leaderboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C896' }} />
              <span className="text-2xs" style={{ color: 'rgba(230,237,247,0.35)' }}>Live · Updated hourly</span>
            </div>
          </div>

          <div>
            {TOP_PLAYERS.map((player, i) => (
              <PlayerRow key={player.name} player={player} delay={i * 80} visible={visible} />
            ))}

            {/* You? row */}
            <div
              className="flex items-center gap-4 px-5 py-3.5"
              style={{
                background:  'rgba(124,92,252,0.05)',
                borderTop:   '1px solid rgba(124,92,252,0.15)',
                opacity:     visible ? 1 : 0,
                transform:   visible ? 'translateY(0)' : 'translateY(8px)',
                transition:  'all 0.5s ease 0.6s',
              }}
            >
              <div className="w-7 text-center font-title font-bold text-sm" style={{ color: 'rgba(230,237,247,0.2)' }}>?</div>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(124,92,252,0.1)', border: '1px dashed rgba(124,92,252,0.3)' }}
              >
                <span className="text-xs font-title font-bold" style={{ color: 'rgba(155,129,255,0.5)' }}>YOU</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-title font-semibold italic" style={{ color: 'rgba(230,237,247,0.35)' }}>Your spot is open</div>
                <div className="text-2xs" style={{ color: 'rgba(230,237,247,0.2)' }}>Connect wallet to enter the rankings</div>
              </div>
              <button className="nx-btn nx-btn-sm nx-btn-primary gap-1.5">
                <Zap size={12} /> Claim It
              </button>
            </div>
          </div>

          <div
            className="p-4 text-center"
            style={{ background: 'rgba(11,16,32,0.4)', borderTop: '1px solid rgba(230,237,247,0.06)' }}
          >
            <button className="nx-btn nx-btn-ghost nx-btn-sm gap-2">
              <TrendingUp size={13} />
              View Full Leaderboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlayerRow({ player, delay, visible }: { player: typeof TOP_PLAYERS[number]; delay: number; visible: boolean }) {
  const isTop3 = player.pos <= 3;

  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5"
      style={{
        background:  isTop3 ? 'rgba(28,38,64,0.5)' : 'transparent',
        borderBottom:'1px solid rgba(230,237,247,0.04)',
        opacity:     visible ? 1 : 0,
        transform:   visible ? 'translateY(0)' : 'translateY(8px)',
        transition:  `all 0.4s ease ${delay}ms`,
      }}
    >
      <div className="w-7 text-center text-sm font-title font-bold" style={{ color: 'rgba(230,237,247,0.25)' }}>
        {POS_ICONS[player.pos] ?? player.pos}
      </div>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-title font-bold"
        style={{ background: player.bg, border: '1px solid rgba(230,237,247,0.08)', color: player.tColor }}
      >
        {player.name[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-title font-semibold text-sm truncate" style={{ color: '#E6EDF7' }}>{player.name}</div>
        <div className="text-2xs font-title font-semibold mt-0.5" style={{ color: player.tColor }}>{player.tier}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-title font-extrabold text-sm" style={{ color: '#E6EDF7' }}>{player.score}</div>
        <div
          className="text-2xs font-bold flex items-center justify-end gap-0.5 mt-0.5"
          style={{
            color: player.delta.startsWith('+') ? '#00C896'
                 : player.delta === '—' ? 'rgba(230,237,247,0.2)'
                 : '#FF5A5A',
          }}
        >
          {player.delta.startsWith('+') && <ArrowUp size={9} />}
          {player.delta}
        </div>
      </div>
    </div>
  );
}
