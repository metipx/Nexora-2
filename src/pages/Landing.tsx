import { useState } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/sections/Hero';
import FeaturesSection from '../components/sections/Features';
import HowItWorksSection from '../components/sections/HowItWorks';
import CategoriesSection from '../components/sections/Categories';
import GameMechanicsSection from '../components/sections/GameMechanics';
import DailyChallengeSection from '../components/sections/DailyChallenge';
import LeaderboardSection from '../components/sections/Leaderboard';
import ShopSection from '../components/sections/Shop';
import TrustSection from '../components/sections/Trust';
import LandingFooter from '../components/sections/Footer';

interface LandingProps {
  onConnectWallet?: () => void;
}

export default function Landing({ onConnectWallet }: LandingProps) {
  const [walletToast, setWalletToast] = useState(false);

  function handleConnectWallet() {
    if (onConnectWallet) {
      onConnectWallet();
    } else {
      setWalletToast(true);
      setTimeout(() => setWalletToast(false), 3500);
    }
  }

  return (
    <div className="min-h-screen bg-void scrollbar-nexora">
      <NavBar onConnectWallet={handleConnectWallet} />

      <main>
        <HeroSection onConnectWallet={handleConnectWallet} />
        <FeaturesSection />
        <HowItWorksSection />
        <CategoriesSection />
        <GameMechanicsSection />
        <DailyChallengeSection />
        <LeaderboardSection />
        <ShopSection />
        <TrustSection />
      </main>

      <LandingFooter />

      {walletToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-toast animate-fade-in-up"
          style={{ minWidth: '320px' }}
        >
          <div className="nx-toast nx-toast-accent px-5 py-4 rounded-2xl">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(160,70,104,0.2)', border: '1px solid rgba(160,70,104,0.3)' }}
            >
              <span className="text-base">🔗</span>
            </div>
            <div>
              <div className="font-title font-semibold text-ink-100 text-sm">Wallet Integration Coming Soon</div>
              <div className="text-xs text-ink/50 mt-0.5">
                Full Web3 integration is being built. Stay tuned!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
