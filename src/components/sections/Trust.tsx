import { Shield, Cpu, Link, Database } from 'lucide-react';
import { useCountUp } from '../../hooks/useLanding';

const TRUST_BADGES = [
  {
    icon:  <Shield size={20} />,
    color: '#9B81FF',
    bg:    'rgba(124,92,252,0.12)',
    border:'rgba(124,92,252,0.22)',
    title: 'Wallet-Secured Identity',
    desc:  'Your progress is cryptographically tied to your wallet. No account theft possible.',
  },
  {
    icon:  <Cpu size={20} />,
    color: '#33DEFF',
    bg:    'rgba(0,212,255,0.1)',
    border:'rgba(0,212,255,0.2)',
    title: 'AI-Generated Questions',
    desc:  'Every question is unique. No fixed question banks that can be memorized.',
  },
  {
    icon:  <Link size={20} />,
    color: '#FFD080',
    bg:    'rgba(255,184,77,0.1)',
    border:'rgba(255,184,77,0.2)',
    title: 'Ethereum Testnet',
    desc:  'Smart contracts on Sepolia testnet. RITUAL token fully on-chain.',
  },
  {
    icon:  <Database size={20} />,
    color: '#33E8B8',
    bg:    'rgba(0,200,150,0.1)',
    border:'rgba(0,200,150,0.2)',
    title: 'Persistent Progress',
    desc:  'XP, rank, and history stored in Supabase with wallet-gated access.',
  },
];

const STATS = [
  { target: 12400, suffix: '+', label: 'Active Players' },
  { target: 850000, suffix: '+', label: 'Questions Answered', format: (n: number) => n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}` },
  { target: 8, suffix: '', label: 'Knowledge Domains' },
  { target: 6, suffix: '', label: 'Prestige Rank Tiers' },
];

export default function TrustSection() {
  return (
    <section
      className="py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0B1020 0%, #0D1223 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {STATS.map((stat, i) => (
            <StatCounter key={i} target={stat.target} suffix={stat.suffix} label={stat.label} format={stat.format} delay={i * 100} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="text-center mb-12">
          <h2
            className="font-title font-extrabold mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            Built with Integrity
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: 'rgba(230,237,247,0.45)' }}>
            Every architectural decision prioritizes security, fairness, and permanence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_BADGES.map((badge, i) => (
            <TrustBadge key={i} badge={badge} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({
  target,
  suffix,
  label,
  format,
  delay,
}: {
  target: number;
  suffix: string;
  label: string;
  format?: (n: number) => string;
  delay: number;
}) {
  const { ref, count } = useCountUp(target, 2200);
  const display = format ? format(count) : count.toLocaleString();

  return (
    <div ref={ref} className="text-center" style={{ transitionDelay: `${delay}ms` }}>
      <div
        className="font-title font-extrabold leading-none mb-2"
        style={{
          fontSize:      'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.04em',
          background:    'linear-gradient(135deg, #E6EDF7 0%, #9B81FF 60%, #00D4FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip:       'text',
        }}
      >
        {display}{suffix}
      </div>
      <div className="nx-stat-label">{label}</div>
    </div>
  );
}

function TrustBadge({ badge }: { badge: typeof TRUST_BADGES[number] }) {
  return (
    <div
      className="p-5 flex flex-col gap-3 rounded-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(28,38,64,0.9) 0%, rgba(20,27,45,0.95) 100%)',
        border:     `1px solid ${badge.border}`,
        boxShadow:  '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}
      >
        {badge.icon}
      </div>
      <div>
        <h4 className="font-title font-bold text-sm mb-1" style={{ color: '#E6EDF7' }}>{badge.title}</h4>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(230,237,247,0.45)' }}>{badge.desc}</p>
      </div>
    </div>
  );
}
