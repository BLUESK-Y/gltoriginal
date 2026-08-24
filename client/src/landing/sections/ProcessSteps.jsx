import { Link } from 'react-router-dom';

const STEPS = [
  { n: '1', label: 'Plan your campaign' },
  { n: '2', label: 'Know the cost' },
  { n: '3', label: 'Book the slot' },
];

export function ProcessSteps() {
  return (
    <section className="relative overflow-hidden bg-ink px-10 py-20 text-center md:px-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(45% 55% at 100% 0%, rgba(255,255,255,0.16), transparent)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(35% 45% at 0% 100%, rgba(255,255,255,0.08), transparent)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-lg -translate-x-10 flex-col items-center gap-6 pl-12">
        {STEPS.map((step) => (
          <div key={step.n} className="flex w-full items-center gap-5">
            <span className="w-16 shrink-0 text-left text-[12px] font-semibold tracking-[0.15em] text-white/40 uppercase">
              Step {step.n}
            </span>
            <span
              className="flex-1 rounded-full border border-violet-400/70 px-8 py-3.5 text-[13px] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_0_16px_2px_rgba(167,139,250,0.4)]"
            >
              {step.label}
            </span>
          </div>
        ))}

        <Link
          to="/run-a-campaign"
          className="mt-6 translate-x-12 rounded-full bg-white px-10 py-4 text-[13px] font-semibold tracking-[0.1em] text-ink uppercase transition-opacity hover:opacity-90"
        >
          Plan campaign now
        </Link>
      </div>
    </section>
  );
}
