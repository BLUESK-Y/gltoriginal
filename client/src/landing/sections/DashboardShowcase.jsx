export function DashboardShowcase() {
  return (
    <section className="bg-paper-dark px-10 py-20 text-center md:px-20 md:py-28">
      <h2 className="mx-auto max-w-2xl text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-ink uppercase">
        Track your campaign on our client dashboard
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted">
        Active hubs, audit photos and reports — one login, updated through the cycle.
      </p>

      {/* The screenshot sits in a thin ink bezel so its dark edges read as an
          intentional device frame rather than a hard crop on the paper ground. */}
      <div className="mx-auto mt-12 max-w-5xl rounded-2xl bg-ink p-2 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.5)] md:p-2.5">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src="/assets/dashboard-photos-v3.png"
            alt="The GLT client dashboard's Photos view, showing audit photos captured at every hub."
            className="w-full"
            loading="lazy"
          />
          {/* The screenshot is cropped mid-row — fading it into the bezel reads
              as "there's more below" instead of a hard chop. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
