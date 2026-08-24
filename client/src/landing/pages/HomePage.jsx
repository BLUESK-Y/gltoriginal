import { useState } from 'react';

import { HomeTopBar } from '../components/HomeTopBar';
import { StoreApplicationModal } from '../components/StoreApplicationModal';
import { Ticker } from '../components/Ticker';
import { DashboardShowcase } from '../sections/DashboardShowcase';
import { FaqCta } from '../sections/FaqCta';
import { Footer } from '../sections/Footer';
import { Hero } from '../sections/Hero';
import { ProcessSteps } from '../sections/ProcessSteps';
import { Showcase } from '../sections/Showcase';

export function HomePage() {
  const [storeModalOpen, setStoreModalOpen] = useState(false);

  return (
    <div className="bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-90 focus:bg-ink focus:px-4 focus:py-2 focus:font-semibold focus:text-paper"
      >
        Skip to content
      </a>

      <div className="flex h-auto flex-col sm:h-screen">
        <div className="shrink-0">
          <HomeTopBar />
        </div>
        <Hero />
      </div>

      <main id="main">
        <Ticker />
        <Showcase />
        <ProcessSteps />
        <DashboardShowcase />
        <FaqCta onBookHub={() => setStoreModalOpen(true)} />
      </main>

      <Footer />

      <StoreApplicationModal open={storeModalOpen} onClose={() => setStoreModalOpen(false)} />
    </div>
  );
}
