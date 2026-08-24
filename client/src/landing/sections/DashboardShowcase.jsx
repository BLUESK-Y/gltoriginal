export function DashboardShowcase() {
  return (
    <section className="bg-paper-dark px-10 py-20 text-center md:px-20 md:py-28">
      <h2 className="mx-auto max-w-2xl text-[clamp(1.75rem,3.6vw,2.75rem)] leading-tight font-bold tracking-[-0.02em] text-ink uppercase">
        Track your campaign on our client dashboard
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-[15px] text-muted">
        Active hubs, audit photos and reports — one login, updated through the cycle.
      </p>

      <div className="mx-auto mt-12 max-w-5xl overflow-hidden border border-rule bg-ink">
        <img
          src="/assets/dashboard-network.png"
          alt="The GLT client dashboard's Network page, showing audit photos captured at every hub."
          className="w-full"
          loading="lazy"
        />
      </div>
    </section>
  );
}
