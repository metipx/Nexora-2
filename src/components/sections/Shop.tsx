import { Zap, Lock, ShoppingBag, Star, Swords } from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const SHOP_ITEMS = [
  {
    icon:       <Zap size={22} />,
    iconColor:  '#9B81FF',
    iconBg:     'rgba(124,92,252,0.15)',
    iconBorder: 'rgba(124,92,252,0.3)',
    name:       'XP Booster ×2',
    desc:       'Double all XP earned for the next 24 hours. Stack with streak multipliers.',
    price:      50,
    tag:        'Popular',
    tagBg:      'rgba(124,92,252,0.12)',
    tagBorder:  'rgba(124,92,252,0.25)',
    tagColor:   '#9B81FF',
    locked:     false,
    cta:        'Buy Now',
  },
  {
    icon:       <Star size={22} />,
    iconColor:  '#FFD080',
    iconBg:     'rgba(255,184,77,0.12)',
    iconBorder: 'rgba(255,184,77,0.28)',
    name:       'Nexora Elite Frame',
    desc:       'Exclusive profile frame reserved for Diamond+ rank players. Shows in leaderboards.',
    price:      500,
    tag:        'Elite',
    tagBg:      'rgba(255,184,77,0.1)',
    tagBorder:  'rgba(255,184,77,0.25)',
    tagColor:   '#FFD080',
    locked:     true,
    lockNote:   'Requires Diamond rank',
    cta:        'Unlock at Diamond',
  },
  {
    icon:       <ShoppingBag size={22} />,
    iconColor:  '#33DEFF',
    iconBg:     'rgba(0,212,255,0.1)',
    iconBorder: 'rgba(0,212,255,0.22)',
    name:       '"The Architect" Title',
    desc:       'Display this rare title beside your username. Earn the respect of the community.',
    price:      200,
    tag:        'Cosmetic',
    tagBg:      'rgba(0,212,255,0.08)',
    tagBorder:  'rgba(0,212,255,0.2)',
    tagColor:   '#33DEFF',
    locked:     false,
    cta:        'Buy Now',
  },
  {
    icon:       <Swords size={22} />,
    iconColor:  '#FFB84D',
    iconBg:     'rgba(255,184,77,0.1)',
    iconBorder: 'rgba(255,184,77,0.22)',
    name:       'Boss Challenge Pass',
    desc:       'Access to weekly Boss Challenges — high difficulty, huge XP, exclusive rewards.',
    price:      0,
    tag:        'Coming Soon',
    tagBg:      'rgba(230,237,247,0.07)',
    tagBorder:  'rgba(230,237,247,0.12)',
    tagColor:   'rgba(230,237,247,0.35)',
    locked:     true,
    lockNote:   'Launching Q3 2025',
    cta:        'Coming Soon',
  },
];

export default function ShopSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="shop"
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0D1223 0%, #0B1020 100%)' }}
    >
      {/* Ambient violet glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,92,252,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(255,184,77,0.1)', border: '1px solid rgba(255,184,77,0.25)', color: '#FFD080' }}
          >
            <ShoppingBag size={11} /> RITUAL Shop
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            Spend What You Earn
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(230,237,247,0.5)' }}>
            RITUAL tokens are earned by playing — not purchased. Use them for boosts,
            cosmetics, and exclusive access. Powered by testnet RITUAL.
          </p>
        </div>

        {/* RITUAL token banner */}
        <div
          className="mb-8 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700"
          style={{
            background:      'linear-gradient(135deg, rgba(124,92,252,0.1) 0%, rgba(28,38,64,0.6) 100%)',
            border:          '1px solid rgba(124,92,252,0.2)',
            opacity:         visible ? 1 : 0,
            transitionDelay: '100ms',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,92,252,0.18)', border: '1px solid rgba(124,92,252,0.35)' }}
            >
              <Zap size={18} style={{ color: '#9B81FF' }} />
            </div>
            <div>
              <div className="font-title font-bold text-sm" style={{ color: '#E6EDF7' }}>RITUAL Token — Earn by Playing</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(230,237,247,0.45)' }}>Correct answers, streaks, and achievements generate RITUAL automatically</div>
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-xl text-sm font-title font-semibold flex items-center gap-2"
            style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)', color: '#9B81FF' }}
          >
            <Zap size={14} />
            0 RITUAL — Connect Wallet
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SHOP_ITEMS.map((item, i) => (
            <ShopCard key={item.name} item={item} delay={i * 80} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopCard({
  item,
  delay,
  visible,
}: {
  item: typeof SHOP_ITEMS[number];
  delay: number;
  visible: boolean;
}) {
  const isComingSoon = item.cta === 'Coming Soon';

  return (
    <div
      className="p-5 flex flex-col gap-4 rounded-2xl transition-all duration-700"
      style={{
        background:      'linear-gradient(145deg, rgba(28,38,64,0.9) 0%, rgba(20,27,45,0.95) 100%)',
        border:          '1px solid rgba(230,237,247,0.07)',
        boxShadow:       '0 4px 20px rgba(0,0,0,0.4)',
        opacity:         visible ? 1 : 0,
        transform:       visible ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${delay}ms`,
        filter:          item.locked ? 'grayscale(0.25)' : 'none',
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: item.iconBg, border: `1px solid ${item.iconBorder}`, color: item.iconColor }}
        >
          {item.locked ? <Lock size={18} style={{ color: 'rgba(230,237,247,0.25)' }} /> : item.icon}
        </div>
        <span
          className="text-xs font-title font-bold px-2.5 py-1 rounded-full"
          style={{ background: item.tagBg, border: `1px solid ${item.tagBorder}`, color: item.tagColor }}
        >
          {item.tag}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-title font-bold text-base mb-1" style={{ color: '#E6EDF7' }}>{item.name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(230,237,247,0.45)' }}>{item.desc}</p>
        {item.lockNote && (
          <p className="text-2xs mt-2 italic" style={{ color: 'rgba(230,237,247,0.3)' }}>{item.lockNote}</p>
        )}
      </div>
      <div
        className="flex items-center justify-between mt-auto pt-3"
        style={{ borderTop: '1px solid rgba(230,237,247,0.07)' }}
      >
        {item.price > 0 ? (
          <div className="flex items-center gap-1.5">
            <Zap size={13} style={{ color: '#9B81FF' }} />
            <span className="font-title font-bold text-sm" style={{ color: '#9B81FF' }}>{item.price} RITUAL</span>
          </div>
        ) : (
          <div />
        )}
        <button
          className={`nx-btn nx-btn-sm ${isComingSoon || item.locked ? 'nx-btn-surface' : 'nx-btn-primary'}`}
          disabled={isComingSoon || item.locked}
        >
          {item.cta}
        </button>
      </div>
    </div>
  );
}
