import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { MapFrame } from '../components/MapFrame';
import { Modal } from '../components/Modal';
import { StoreListModal } from '../components/StoreListModal';
import { useHubs } from '../hooks/useHubs';
import { usePricingConfig, useQuote } from '../hooks/usePricing';
import { submitLead } from '../lib/api';
import { inr } from '../lib/format';

const emptyForm = { name: '', brand: '', email: '', phone: '', preferredStart: '' };

// The network is Category B supermarkets only for now — not a user choice
// (see RATE_CARD.storeMix on the server).
const STORE_MIX = 'catB';

// Real city-centre coordinates for framing each map — not store locations,
// just where to point the camera. The hub network itself is still only
// real, live hubs (currently all in Thiruvananthapuram).
const CITY_CENTERS = {
  Thiruvananthapuram: [8.5241, 76.9366],
  Kollam: [8.8932, 76.6141],
  Kochi: [9.9312, 76.2673],
  Thrissur: [10.5276, 76.2144],
  Kozhikode: [11.2588, 75.7804],
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Bengaluru: [12.9716, 77.5946],
};
const KERALA_CENTER = [10.3, 76.4];

const fieldLabelCls = 'mb-1.5 block text-[11px] font-semibold tracking-[1px] text-label uppercase';
const inputCls =
  'w-full rounded-md border border-rule bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-label transition-colors focus:border-ink';
const cardCls = 'flex min-h-0 flex-col overflow-hidden rounded-xl border border-rule bg-white';

export function CampaignEstimator() {
  const [state, setState] = useState('Kerala');
  const [scope, setScope] = useState('state');
  const [selectedCities, setSelectedCities] = useState(['Thiruvananthapuram']);
  const [hubs, setHubs] = useState(25);
  const [duration, setDuration] = useState('first15');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [storeList, setStoreList] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { hubs: hubNetwork } = useHubs();
  const { config, error: configError } = usePricingConfig(true);
  const { quote, pending } = useQuote({ hubs, duration, storeMix: STORE_MIX }, true);

  const regions = config?.regions ?? [];
  const rateCard = config?.rateCard;

  const cities = useMemo(() => regions.find((r) => r.state === state)?.cities ?? [], [regions, state]);
  const liveCities = useMemo(() => cities.filter((c) => c.status === 'live'), [cities]);
  const stateHubs = useMemo(() => liveCities.reduce((sum, c) => sum + c.availableHubs, 0), [liveCities]);

  const selectedCityObjs = useMemo(
    () => cities.filter((c) => selectedCities.includes(c.city)),
    [cities, selectedCities],
  );
  const cityHubs = useMemo(
    () => selectedCityObjs.filter((c) => c.status === 'live').reduce((sum, c) => sum + c.availableHubs, 0),
    [selectedCityObjs],
  );

  // The real hub network doesn't carry a city field of its own — every
  // real, live hub today is in Thiruvananthapuram. Any other city is
  // honestly empty (waitlist) rather than showing invented markers.
  const hubsForCity = (cityName) => (cityName === 'Thiruvananthapuram' ? hubNetwork : []);

  // The next 12 calendar months, starting this month — a month is all the
  // business needs to schedule installs, so this replaces asking for an
  // exact day.
  const monthOptions = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      return { value, label };
    });
  }, []);

  const maxHubs = (scope === 'city' ? cityHubs : stateHubs) || 50;
  const place =
    scope === 'city'
      ? `${selectedCities.length <= 2 ? selectedCities.join(' & ') : `${selectedCities.length} cities`}, ${state}`
      : `${state} (statewide)`;

  useEffect(() => {
    if (!cities.length) return;
    setSelectedCities((prev) => {
      const valid = prev.filter((name) => cities.some((c) => c.city === name));
      return valid.length ? valid : [cities[0].city];
    });
  }, [cities]);

  const toggleCity = (cityName) => {
    setSelectedCities((prev) => {
      if (prev.includes(cityName)) return prev.length > 1 ? prev.filter((c) => c !== cityName) : prev;
      return [...prev, cityName];
    });
  };

  // No manual hub-count control anymore — a campaign always books every
  // available hub in the selected coverage.
  useEffect(() => {
    setHubs(maxHubs);
  }, [maxHubs]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const response = await submitLead({
        ...form,
        preferredStart: form.preferredStart || undefined,
        state,
        scope,
        cities: scope === 'city' ? selectedCities : [],
        hubs,
        duration,
        storeMix: STORE_MIX,
      });
      setResult(response);
    } catch (err) {
      setErrors(Object.keys(err.fields ?? {}).length ? err.fields : { _: err.message });
      const firstField = Object.keys(err.fields ?? {})[0];
      if (firstField) document.querySelector(`[name="${firstField}"]`)?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="estimator" className="bg-paper px-4 py-3 md:px-8">
      <div className="mx-auto max-w-[1580px] pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase transition-colors hover:text-ink"
        >
          ← Back to home
        </Link>
        <h1 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-tight font-bold tracking-[-1.28px] text-ink uppercase">
          Plan your campaign
        </h1>
      </div>

      {configError && (
        <p role="alert" className="mx-auto mb-2 max-w-[1580px] rounded-md border border-rule bg-white p-2 text-[12px] text-red-600">
          Could not load pricing. {configError}
        </p>
      )}

      <div className="flex justify-center pb-10">
        <div className="mt-4 grid w-full min-w-0 max-w-[1580px] grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1100px)_minmax(0,320px)]">
          <div className="flex flex-col gap-5">
            {/* Coverage + Settings */}
            <div className={cardCls}>
              <div className="space-y-5 p-6 pt-8 md:p-8 md:pt-10">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className={fieldLabelCls}>Select state</label>
                    <select value={state} onChange={(e) => setState(e.target.value)} className={`${inputCls} cursor-pointer appearance-none`}>
                      {regions.map((region) => (
                        <option key={region.state} value={region.state}>
                          {region.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {rateCard && (
                    <>
                      <div>
                        <label className={fieldLabelCls}>Preferred start month</label>
                        <select
                          name="preferredStart"
                          value={form.preferredStart}
                          onChange={update('preferredStart')}
                          className={`${inputCls} cursor-pointer appearance-none`}
                        >
                          <option value="">No preference yet</option>
                          {monthOptions.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={fieldLabelCls}>Campaign duration</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {rateCard.durations.map((d) => {
                            const active = duration === d.id;
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onClick={() => setDuration(d.id)}
                                className={`rounded-md border p-2 text-left transition-colors ${
                                  active ? 'border-ink bg-ink' : 'border-rule bg-white hover:border-ink/40'
                                }`}
                              >
                                <div className={`text-[10px] tracking-wide uppercase ${active ? 'text-white/70' : 'text-muted'}`}>
                                  {d.label}
                                </div>
                                <div className={`mt-0.5 text-[12px] font-bold ${active ? 'text-paper' : 'text-ink'}`}>
                                  {inr(d.ratePerDay)}/day
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className={fieldLabelCls}>Campaign scope</label>
                  <div className="inline-flex w-full rounded-full border border-rule bg-paper-dark p-1">
                    {[
                      ['state', 'Whole state'],
                      ['city', 'Specific city'],
                    ].map(([key, scopeLabel]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setScope(key)}
                        className={`flex-1 rounded-full px-3 py-1.5 text-center text-[11px] font-semibold tracking-[0.06em] uppercase transition-colors ${
                          scope === key ? 'bg-ink text-paper' : 'text-ink hover:bg-white'
                        }`}
                      >
                        {scopeLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={fieldLabelCls}>Store locations</label>
                  {scope === 'state' ? (
                    <MapFrame
                      compact
                      label={`${state} — whole state`}
                      hubCount={hubNetwork.length}
                      center={KERALA_CENTER}
                      zoom={7}
                      hubs={hubNetwork}
                      onClick={() =>
                        setStoreList({
                          title: `${state} — whole state`,
                          subtitle: `${hubNetwork.length} live hub${hubNetwork.length === 1 ? '' : 's'} across the state.`,
                          hubs: hubNetwork,
                        })
                      }
                    />
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {cities.map((c) => {
                        const cityName = c.city;
                        const cityHubList = hubsForCity(cityName);
                        return (
                          <MapFrame
                            compact
                            selectable
                            key={cityName}
                            label={cityName}
                            hubCount={cityHubList.length}
                            center={CITY_CENTERS[cityName] ?? KERALA_CENTER}
                            zoom={12}
                            hubs={cityHubList}
                            selected={selectedCities.includes(cityName)}
                            onToggleSelect={() => toggleCity(cityName)}
                            onClick={() =>
                              setStoreList({
                                title: cityName,
                                subtitle:
                                  cityHubList.length > 0
                                    ? `${cityHubList.length} live hub${cityHubList.length === 1 ? '' : 's'} in ${cityName}.`
                                    : `No live hubs in ${cityName} yet.`,
                                hubs: cityHubList,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live estimate — side panel */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-rule bg-ink text-paper">
            <div className="flex min-h-0 flex-1 flex-col p-6 pt-8 md:p-8 md:pt-10">
              <h2 className="mb-4 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">Live estimate</h2>

              {!quote ? (
                <p className="animate-pulse text-[11px] tracking-[1.2px] text-white/50 uppercase">Calculating…</p>
              ) : (
                <div className={`transition-opacity duration-200 ${pending ? 'opacity-50' : 'opacity-100'}`}>
                  <div>
                    {[
                      ['Location', place],
                      ['Hubs', quote.hubs],
                      ['Panels', quote.panels],
                      ['Duration', `${quote.days} days`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between border-b border-white/10 py-1.5 text-sm">
                        <span className="text-[11px] tracking-[0.04em] text-white/50 uppercase">{label}</span>
                        <span className="text-[12px] font-bold">{value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 mb-1 text-[10px] tracking-[0.18em] text-white/50 uppercase">How this is calculated</p>

                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] tracking-[0.18em] text-white/50 uppercase">Rate per store</p>
                    <p className="accent-serif mt-0.5 text-[28px] leading-tight text-paper">
                      {inr(quote.ratePerDay)}/day × {quote.days} days = {inr(quote.ratePerHub)}/store
                    </p>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center justify-between border-b border-white/10 py-1.5 text-sm">
                      <span className="text-[11px] tracking-[0.04em] text-white/60">
                        {inr(quote.ratePerHub)}/store × {quote.hubs} stores
                      </span>
                      <span className="text-[12px] font-bold">{inr(quote.base)}</span>
                    </div>
                    {quote.surcharge > 0 && (
                      <div className="flex items-center justify-between border-b border-white/10 py-1.5 text-sm">
                        <span className="text-[11px] tracking-[0.04em] text-white/60">+ {quote.surchargePct}% surcharge</span>
                        <span className="text-[12px] font-bold">{inr(quote.surcharge)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b border-white/10 py-1.5 text-sm">
                      <span className="text-[11px] tracking-[0.04em] text-white/60">
                        + Install fee ({quote.hubs} × {inr(rateCard.installFeePerHub)})
                      </span>
                      <span className="text-[12px] font-bold">{inr(quote.installFee)}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-[10px] tracking-[0.18em] text-white/50 uppercase">Estimated total</span>
                    <span className="text-[16px] font-bold text-paper">{inr(quote.total)}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-white/40">Excludes GST</p>

                  <ul className="mt-2 space-y-1">
                    {quote.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[11.5px]">
                        <span className="mt-0.5 shrink-0 font-bold">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-2 text-[10px] leading-relaxed text-white/40">
                    Indicative. {quote.gstNote} · {quote.advancePct}% advance required to secure hubs.
                  </p>

                  {result ? (
                    <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2.5 text-center">
                      <p className="text-[12px] font-bold text-paper">Enquiry received.</p>
                      <p className="mt-0.5 text-[11px] text-white/50">{result.message}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEnquiryOpen(true)}
                      disabled={!config || !quote}
                      className="mt-2 w-full rounded-full bg-paper py-2.5 text-[12px] font-semibold tracking-[0.1em] text-ink uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Send enquiry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        labelId="enquiry-details"
        title="Your details"
        subtitle="Tell us who to send this estimate to — we'll follow up with next steps."
      >
        {result ? (
          <div className="rounded-lg border border-rule bg-paper p-6 text-center">
            <p className="text-xl font-bold text-ink">Enquiry received.</p>
            <p className="mt-2 text-sm text-muted">{result.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className={fieldLabelCls}>Full name</label>
              <input type="text" name="name" placeholder="Your name" value={form.name} required onChange={update('name')} className={inputCls} />
              {errors.name && <p className="mt-1 text-[11px] text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className={fieldLabelCls}>Brand / agency</label>
              <input type="text" name="brand" placeholder="Brand name" value={form.brand} required onChange={update('brand')} className={inputCls} />
              {errors.brand && <p className="mt-1 text-[11px] text-red-600">{errors.brand}</p>}
            </div>
            <div>
              <label className={fieldLabelCls}>Email address</label>
              <input type="email" name="email" placeholder="email@domain.com" value={form.email} required onChange={update('email')} className={inputCls} />
              {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className={fieldLabelCls}>Phone number</label>
              <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} required onChange={update('phone')} className={inputCls} />
              {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
            </div>

            {errors._ && (
              <p role="alert" className="text-[13px] text-red-600">
                {errors._}
              </p>
            )}

            <button
              type="submit"
              disabled={!config || !quote}
              className="w-full rounded-full bg-ink py-4 text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Sending…' : 'Send enquiry'}
            </button>
          </form>
        )}
      </Modal>

      <StoreListModal
        open={!!storeList}
        onClose={() => setStoreList(null)}
        title={storeList?.title ?? ''}
        subtitle={storeList?.subtitle}
        hubs={storeList?.hubs ?? []}
      />
    </section>
  );
}
