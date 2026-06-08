import { Wallet, Brain, TrendingUp } from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const STEPS = [
  {
    num:    '01',
    icon:   <Wallet size={26} />,
    color:  '#9B81FF',
    bg:     'rgba(124,92,252,0.12)',
    border: 'rgba(124,92,252,0.22)',
    title:  'Connect Your Wallet',
    body:   'Sign in with any Ethereum-compatible wallet. No email, no password — your wallet address is your identity. Progress is stored permanently and linked to your address.',
  },
  {
    num:    '02',
    icon:   <Brain size={26} />,
    color:  '#33DEFF',
    bg:     'rgba(0,212,255,0.1)',
    border: 'rgba(0,212,255,0.2)',
    title:  'Pick a Domain & Start',
    body:   'Choose from 8 knowledge categories. AI instantly generates a calibrated challenge based on your current level, accuracy history, and category depth. Every session is unique.',
  },
  {
    num:    '03',
    icon:   <TrendingUp size={26} />,
    color:  '#33E8B8',
    bg:     'rgba(0,200,150,0.1)',
    border: 'rgba(0,200,150,0.2)',
    title:  'Answer, Earn & Climb',
    body:   'Correct answers earn XP, grow your streak, and build rank score. Level up, unlock categories, rise through rank tiers, and earn RITUAL tokens to spend in the shop.',
  },
];

export default function HowItWorksSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0B1020 0%, #0D1223 100%)' }}
    >
      {/* Connector line ambient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(124,92,252,0.08), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(230,237,247,0.06)', border: '1px solid rgba(230,237,247,0.1)', color: 'rgba(230,237,247,0.5)' }}
          >
            3 Steps
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            How It Works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(230,237,247,0.5)' }}>
            From wallet connection to leaderboard in three clean steps.
            No tutorials, no friction.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal connector (desktop) */}
          <div
            className="hidden lg:block absolute top-14 left-[16.66%] right-[16.66%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(124,92,252,0.15) 20%, rgba(0,212,255,0.15) 80%, transparent)' }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} delay={i * 120} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, delay }: { step: typeof STEPS[number]; delay: number }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center lg:items-start lg:text-left transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transitionDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: step.bg, border: `1px solid ${step.border}`, color: step.color }}
        >
          {step.icon}
        </div>
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-2xs font-mono font-bold"
          style={{ background: '#0B1020', border: `1px solid ${step.color}60`, color: step.color }}
        >
          {step.num.slice(1)}
        </div>
      </div>
      <div className="space-y-2 max-w-sm">
        <div className="font-mono text-2xs tracking-widest" style={{ color: `${step.color}80` }}>
          STEP {step.num}
        </div>
        <h3 className="font-title font-bold text-xl" style={{ color: '#E6EDF7' }}>{step.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(230,237,247,0.5)' }}>{step.body}</p>
      </div>
    </div>
  );
}
