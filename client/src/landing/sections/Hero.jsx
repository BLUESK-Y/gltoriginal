import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section id="top" className="relative aspect-square w-full overflow-hidden bg-paper text-center sm:aspect-auto sm:min-h-[560px] sm:flex-1">
      <img
        src="/assets/hero-composite-mobile.jpg"
        alt="Ground Link Technology — the GLT dual-A3 backlit ad hub, showing two brand posters lit side by side behind a single glass front."
        className="absolute inset-0 h-full w-full object-cover sm:hidden"
        fetchPriority="high"
      />
      <img
        src="/assets/hero-composite2.jpg"
        alt="Ground Link Technology — the GLT dual-A3 backlit ad hub, showing two brand posters lit side by side behind a single glass front."
        className="absolute inset-0 hidden h-full w-full object-cover sm:block"
        fetchPriority="high"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(55% 45% at 50% 30%, rgba(0,0,0,0.05), transparent)' }}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 px-6 pb-5 sm:gap-4 sm:px-10 sm:pb-6 md:px-20 md:pb-8">
        <Link
          to="/run-a-campaign"
          className="-translate-x-[0.5vw] translate-y-4 rounded-full bg-ink px-5 py-2 text-[10px] font-semibold tracking-[1px] text-paper uppercase transition-opacity hover:opacity-80 sm:translate-y-5 sm:px-10 sm:py-4 sm:text-[13px] sm:tracking-[2px]"
        >
          Run a campaign
        </Link>

        <div className="hidden w-full items-center justify-between gap-3 text-[12px] font-semibold tracking-[2px] text-muted uppercase sm:flex sm:translate-y-4 lg:text-[15px] lg:tracking-[3px]">
          <span>Hyper-localised retail ad network</span>
          <span>Exclusive for FMCG brands</span>
        </div>
      </div>
    </section>
  );
}
