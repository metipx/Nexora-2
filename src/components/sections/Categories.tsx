import { useState } from 'react';
import {
  Bot, Code, Clock, Globe, FlaskConical,
  TrendingUp, Trophy, Film, BookOpen, Puzzle,
  Palette, Lightbulb, Lock,
} from 'lucide-react';
import { useReveal } from '../../hooks/useLanding';

const CATEGORIES = [
  { id: 'technology_ai',       label: 'Technology & AI',      icon: <Bot size={24} />,       color: '#00C896', bg: 'rgba(0,200,150,0.1)',      border: 'rgba(0,200,150,0.2)',     desc: 'Artificial intelligence, machine learning, tech innovations',  locked: false, unlockLevel: 1  },
  { id: 'programming',         label: 'Programming',          icon: <Code size={24} />,      color: '#7C5CFC', bg: 'rgba(124,92,252,0.1)',     border: 'rgba(124,92,252,0.2)',   desc: 'Software development, coding, algorithms',                    locked: false, unlockLevel: 1  },
  { id: 'history',              label: 'History',              icon: <Clock size={24} />,     color: '#CD7F32', bg: 'rgba(205,127,50,0.1)',     border: 'rgba(205,127,50,0.2)',   desc: 'Ancient civilizations to modern events',                      locked: false, unlockLevel: 1  },
  { id: 'geography',            label: 'Geography',            icon: <Globe size={24} />,     color: '#FFB84D', bg: 'rgba(255,184,77,0.1)',    border: 'rgba(255,184,77,0.2)',   desc: 'Nations, terrain, climate and cultures',                      locked: false, unlockLevel: 1  },
  { id: 'science_astronomy',    label: 'Science & Astronomy',  icon: <FlaskConical size={24} />,color: '#00D4FF', bg: 'rgba(0,212,255,0.1)',      border: 'rgba(0,212,255,0.2)',    desc: 'Physics, chemistry, biology, space exploration',              locked: false, unlockLevel: 1  },
  { id: 'business_economics',   label: 'Business & Economics', icon: <TrendingUp size={24} />, color: '#9BB0CC', bg: 'rgba(155,176,204,0.1)',   border: 'rgba(155,176,204,0.2)',  desc: 'Finance, markets, entrepreneurship',                           locked: true,  unlockLevel: 5  },
  { id: 'sports',               label: 'Sports',               icon: <Trophy size={24} />,    color: '#EF4444', bg: 'rgba(239,68,68,0.1)',      border: 'rgba(239,68,68,0.2)',    desc: 'Athletics, teams, records, sporting events',                  locked: true,  unlockLevel: 5  },
  { id: 'cinema_entertainment', label: 'Cinema & Entertainment',icon: <Film size={24} />,      color: '#B9F2FF', bg: 'rgba(185,242,255,0.1)',   border: 'rgba(185,242,255,0.2)',  desc: 'Movies, TV shows, actors, entertainment industry',            locked: true,  unlockLevel: 7  },
  { id: 'english',              label: 'English',              icon: <BookOpen size={24} />,  color: '#8FCDDD', bg: 'rgba(143,205,221,0.1)',    border: 'rgba(143,205,221,0.2)',  desc: 'Grammar, vocabulary, language structure',                      locked: true,  unlockLevel: 9  },
  { id: 'logic_problem_solving',label: 'Logic & Problem Solving',icon: <Puzzle size={24} />,    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',    border: 'rgba(245,158,11,0.2)',   desc: 'Puzzles, reasoning, analytical thinking',                     locked: true,  unlockLevel: 12 },
  { id: 'culture_art',          label: 'Culture & Art',        icon: <Palette size={24} />,   color: '#EC4899', bg: 'rgba(236,72,153,0.1)',    border: 'rgba(236,72,153,0.2)',   desc: 'Painting, sculpture, music, art history',                     locked: true,  unlockLevel: 15 },
  { id: 'general_knowledge',    label: 'General Knowledge',    icon: <Lightbulb size={24} />, color: '#A78BFA', bg: 'rgba(167,139,250,0.1)',   border: 'rgba(167,139,250,0.2)',  desc: 'Trivia, facts across all domains',                            locked: false, unlockLevel: 1  },
];

export default function CategoriesSection() {
  const { ref, visible } = useReveal();

  return (
    <section
      id="categories"
      className="py-24 md:py-32 relative"
      style={{ background: 'linear-gradient(180deg, #0D1223 0%, #0B1020 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-title font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.22)', color: '#33E8B8' }}
          >
            12 Domains
          </div>
          <h2
            className="font-title font-extrabold mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: '#E6EDF7' }}
          >
            Knowledge Has No Ceiling
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(230,237,247,0.5)' }}>
            Twelve categories, each with infinite AI-generated questions. Unlock new domains as your level grows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, delay }: { cat: typeof CATEGORIES[number]; delay: number }) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="p-5 flex flex-col gap-3 rounded-2xl transition-all duration-700 cursor-pointer"
      style={{
        background:      'linear-gradient(145deg, rgba(28,38,64,0.9) 0%, rgba(20,27,45,0.95) 100%)',
        border:          hovered && !cat.locked ? `1px solid ${cat.border}` : '1px solid rgba(230,237,247,0.07)',
        boxShadow:       hovered && !cat.locked ? `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${cat.bg}` : '0 4px 20px rgba(0,0,0,0.4)',
        opacity:         visible ? (cat.locked ? 0.6 : 1) : 0,
        transform:       visible ? (hovered ? 'translateY(-4px)' : 'translateY(0)') : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300"
          style={{
            background: cat.bg,
            border:     `1px solid ${cat.border}`,
            color:      cat.color,
            transform:  hovered && !cat.locked ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          {cat.locked ? <Lock size={20} style={{ color: 'rgba(230,237,247,0.25)' }} /> : cat.icon}
        </div>
        {cat.locked && (
          <span
            className="text-2xs font-title font-bold px-2 py-1 rounded-md"
            style={{ background: 'rgba(230,237,247,0.07)', color: 'rgba(230,237,247,0.35)', border: '1px solid rgba(230,237,247,0.1)' }}
          >
            Lv {cat.unlockLevel}
          </span>
        )}
      </div>
      <div>
        <h3
          className="font-title font-bold text-sm mb-1"
          style={{ color: cat.locked ? 'rgba(230,237,247,0.3)' : '#E6EDF7' }}
        >
          {cat.label}
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{ color: cat.locked ? 'rgba(230,237,247,0.2)' : 'rgba(230,237,247,0.45)' }}
        >
          {cat.locked ? `Unlocks at Level ${cat.unlockLevel}` : cat.desc}
        </p>
      </div>
    </div>
  );
}
