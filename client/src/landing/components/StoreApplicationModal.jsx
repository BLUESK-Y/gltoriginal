import { useEffect, useState } from 'react';

import { usePricingConfig } from '../hooks/usePricing';
import { submitStoreApplication } from '../lib/api';
import { Modal } from './Modal';

const SIZES = [
  { id: 'under500', label: 'Under 500 sq ft — Cat B' },
  { id: '500to1500', label: '500–1500 sq ft — Cat A' },
  { id: 'over1500', label: 'Over 1500 sq ft — Cat A' },
];

const emptyForm = {
  ownerName: '',
  storeName: '',
  phone: '',
  email: '',
  locality: '',
  city: 'Thiruvananthapuram',
  state: 'Kerala',
  storeSize: '500to1500',
};

const inputCls =
  'w-full border border-rule bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-label focus:border-ink';

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-semibold tracking-[1.2px] text-label uppercase">{label}</label>
      {children}
    </div>
  );
}

export function StoreApplicationModal({ open, onClose }) {
  const { config } = usePricingConfig(open);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) return undefined;
    const timer = setTimeout(() => {
      setForm(emptyForm);
      setErrors({});
      setResult(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [open]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      setResult(await submitStoreApplication({ ...form, email: form.email || undefined }));
    } catch (err) {
      setErrors(Object.keys(err.fields ?? {}).length ? err.fields : { _: err.message });
      const firstField = Object.keys(err.fields ?? {})[0];
      if (firstField) document.querySelector(`[name="${firstField}"]`)?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  const states = config?.regions.map((r) => r.state) ?? ['Kerala'];

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelId="store-title"
      title={result ? 'Application received' : 'Add my store to the network'}
      subtitle={result ? undefined : '₹4,500 deposit. 50/50 split. Nothing else to pay.'}
    >
      {result ? (
        <div className="text-center">
          <p className="text-[15px] text-ink">{result.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full bg-ink py-3.5 text-[13px] font-semibold tracking-[1.4px] text-paper uppercase transition-opacity hover:opacity-80"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner name">
              <input
                name="ownerName"
                autoComplete="name"
                value={form.ownerName}
                onChange={update('ownerName')}
                placeholder="Full name"
                required
                className={inputCls}
              />
              {errors.ownerName && <p className="mt-1 text-[12px] text-red-600">{errors.ownerName}</p>}
            </Field>
            <Field label="Store name">
              <input
                name="storeName"
                autoComplete="organization"
                value={form.storeName}
                onChange={update('storeName')}
                placeholder="Store"
                required
                className={inputCls}
              />
              {errors.storeName && <p className="mt-1 text-[12px] text-red-600">{errors.storeName}</p>}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone">
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="+91"
                required
                className={inputCls}
              />
              {errors.phone && <p className="mt-1 text-[12px] text-red-600">{errors.phone}</p>}
            </Field>
            <Field label="Email">
              <input
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                placeholder="Optional"
                className={inputCls}
              />
              {errors.email && <p className="mt-1 text-[12px] text-red-600">{errors.email}</p>}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Locality">
              <input
                name="locality"
                value={form.locality}
                onChange={update('locality')}
                placeholder="Area"
                required
                className={inputCls}
              />
              {errors.locality && <p className="mt-1 text-[12px] text-red-600">{errors.locality}</p>}
            </Field>
            <Field label="City">
              <input name="city" value={form.city} onChange={update('city')} required className={inputCls} />
              {errors.city && <p className="mt-1 text-[12px] text-red-600">{errors.city}</p>}
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State">
              <select name="state" value={form.state} onChange={update('state')} required className={`${inputCls} appearance-none`}>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.state && <p className="mt-1 text-[12px] text-red-600">{errors.state}</p>}
            </Field>
            <Field label="Store size">
              <select
                name="storeSize"
                value={form.storeSize}
                onChange={update('storeSize')}
                required
                className={`${inputCls} appearance-none`}
              >
                {SIZES.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
              {errors.storeSize && <p className="mt-1 text-[12px] text-red-600">{errors.storeSize}</p>}
            </Field>
          </div>

          {errors._ && (
            <p role="alert" className="text-[13px] text-red-600">
              {errors._}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink py-3.5 text-[13px] font-semibold tracking-[1.4px] text-paper uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Apply to host a hub'}
          </button>
          <p className="text-center text-[11.5px] text-label">
            Our field team surveys your counter before anything is installed.
          </p>
        </form>
      )}
    </Modal>
  );
}
