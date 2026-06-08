import { Wallet, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const QUESTION = {
  category:   'Crypto & Web3',
  difficulty: 7,
  text: "Ethereum's transition to Proof of Stake reduced its energy consumption by approximately how much?",
  options: [
    { id: 'a', text: 'Around 25% less energy usage' },
    { id: 'b', text: 'Roughly 50% reduction' },
    { id: 'c', text: 'Over 99.9% reduction' },
    { id: 'd', text: 'Energy usage remained the same' },
  ],
  correct: 'c',
};

export default function DailyChallengeSection() {
  const { ref, visible } = useReveal();
  const circumference = 2 * Math.PI * 16;

  return (
    <section
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0D1223 0%, #0B1020 100%)' }}
    >
      {/* Ambient emerald glow */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.25)', color: '#33E8B8' }}
          >
            <Clock size={11} /> Daily Challenge
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            One Challenge. Every Day.
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: 'rgba(230,237,247,0.5)' }}>
            A special challenge resets at midnight UTC. Complete it for bonus XP and streak protection.
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
          {/* Card header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ background: 'rgba(11,16,32,0.6)', borderBottom: '1px solid rgba(230,237,247,0.07)' }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-title font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.22)', color: '#33DEFF' }}
              >
                Crypto &amp; Web3
              </span>
              <span
                className="text-xs font-title font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.22)', color: '#FFD080' }}
              >
                Difficulty 7/10
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Timer ring */}
              <div className="relative w-9 h-9">
                <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(230,237,247,0.07)" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="14"
                    fill="none"
                    stroke="#00C896"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={2 * Math.PI * 14 * 0.25}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-title font-bold text-xs" style={{ color: '#E6EDF7' }}>27</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={13} style={{ color: '#9B81FF' }} />
                <span className="font-title font-bold text-sm" style={{ color: '#9B81FF' }}>+250 XP</span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="p-5 pb-4">
            <p className="font-title font-semibold text-base leading-relaxed" style={{ color: '#E6EDF7' }}>
              {QUESTION.text}
            </p>
          </div>

          {/* Options */}
          <div className="px-5 pb-5 space-y-2.5 relative">
            {QUESTION.options.map((opt, i) => {
              const isCorrect = opt.id === QUESTION.correct;
              const isBlurred = i >= 2;

              return (
                <button
                  key={opt.id}
                  className="nx-option"
                  style={{
                    filter:       isBlurred ? 'blur(4px)' : 'none',
                    opacity:      isBlurred ? 0.4 : 1,
                    background:   isCorrect && !isBlurred ? 'rgba(0,200,150,0.12)' : undefined,
                    borderColor:  isCorrect && !isBlurred ? 'rgba(0,200,150,0.4)' : undefined,
                    color:        isCorrect && !isBlurred ? '#33E8B8' : undefined,
                    pointerEvents:isBlurred ? 'none' : 'auto',
                  }}
                  disabled={isBlurred}
                >
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-title font-bold flex-shrink-0"
                    style={{
                      background:  isCorrect && !isBlurred ? 'rgba(0,200,150,0.2)' : 'rgba(11,16,32,0.7)',
                      border:      isCorrect && !isBlurred ? '1px solid rgba(0,200,150,0.45)' : '1px solid rgba(230,237,247,0.1)',
                      color:       isCorrect && !isBlurred ? '#33E8B8' : 'rgba(230,237,247,0.45)',
                    }}
                  >
                    {isCorrect && !isBlurred ? <CheckCircle2 size={13} /> : opt.id.toUpperCase()}
                  </span>
                  {opt.text}
                </button>
              );
            })}

            {/* Wallet gate overlay */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-3 pt-20"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(20,27,45,0.97) 55%)' }}
            >
              <button className="nx-btn nx-btn-primary gap-2.5" style={{ fontSize: '0.9375rem' }}>
                <Wallet size={16} />
                Connect Wallet to Answer
              </button>
              <p className="text-2xs mt-2" style={{ color: 'rgba(230,237,247,0.3)' }}>Free to play — wallet is your identity</p>
            </div>
          </div>
        </div>

        {/* Reset strip */}
        <div
          className="mt-5 flex items-center justify-center gap-3 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transitionDelay: '300ms' }}
        >
          <div className="nx-divider flex-1" />
          <div className="flex items-center gap-2 text-xs font-title" style={{ color: 'rgba(230,237,247,0.3)' }}>
            <Clock size={12} />
            <span>Resets in <strong style={{ color: 'rgba(230,237,247,0.6)' }}>14h 22m</strong></span>
            <span style={{ color: 'rgba(230,237,247,0.15)' }}>·</span>
            <span><strong style={{ color: '#9B81FF' }}>+500 XP</strong> for today's challenge</span>
          </div>
          <div className="nx-divider flex-1" />
        </div>
      </div>
    </section>
  );
}
