import { MessageCircle, ExternalLink } from 'lucide-react';
import { NexoraWordmark } from '../../design-system/Logo';

const FOOTER_LINKS = {
  Product:  ['Features', 'Categories', 'Daily Challenge', 'Shop', 'Roadmap'],
  Compete:  ['Leaderboard', 'Rank Tiers', 'Streaks & XP', 'Achievements', 'Seasons'],
  Web3:     ['Connect Wallet', 'RITUAL Token', 'Smart Contracts', 'On-Chain Progress', 'Testnet Info'],
};

export default function LandingFooter() {
  return (
    <footer
      className="pt-20 pb-8"
      style={{
        background: 'linear-gradient(180deg, #0D1223 0%, #090C12 100%)',
        borderTop:  '1px solid rgba(124,92,252,0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <NexoraWordmark size={30} tint="default" showText textPlacement="right" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(230,237,247,0.4)' }}>
              The AI-powered knowledge arena where mastery builds rank,
              streaks fuel rewards, and every answer matters.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/Metipax"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(28,38,64,0.8)',
                  border:     '1px solid rgba(230,237,247,0.1)',
                  color:      'rgba(230,237,247,0.45)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#E6EDF7';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230,237,247,0.22)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,92,252,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(230,237,247,0.45)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230,237,247,0.1)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(28,38,64,0.8)';
                }}
                aria-label="X (Twitter)"
              >
                <span className="text-base font-bold leading-none">𝕏</span>
              </a>
              <a
                href="https://discord.gg/yfdVK6dU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(28,38,64,0.8)',
                  border:     '1px solid rgba(230,237,247,0.1)',
                  color:      'rgba(230,237,247,0.45)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#7289DA';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(114,137,218,0.35)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(114,137,218,0.1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(230,237,247,0.45)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(230,237,247,0.1)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(28,38,64,0.8)';
                }}
                aria-label="Discord"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, string[]][]).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-xs font-title font-semibold tracking-widest uppercase mb-5"
                style={{ color: 'rgba(230,237,247,0.3)' }}
              >
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'rgba(230,237,247,0.4)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(230,237,247,0.75)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(230,237,247,0.4)'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mb-8"
          style={{ height: '1px', background: 'rgba(230,237,247,0.06)' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs" style={{ color: 'rgba(230,237,247,0.25)' }}>
            © 2026 Nexora. All rights reserved. Built on Ethereum.
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(230,237,247,0.3)' }}>
            <span>Built by</span>
            <a
              href="https://x.com/Metipax"
              target="_blank"
              rel="noopener noreferrer"
              className="font-title font-semibold transition-colors duration-150 flex items-center gap-1"
              style={{ color: 'rgba(230,237,247,0.5)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#9B81FF'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(230,237,247,0.5)'; }}
            >
              Meti pax
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
