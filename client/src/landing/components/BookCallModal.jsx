import { useEffect, useState } from 'react';

import { submitCallRequest } from '../lib/api';
import { Modal } from './Modal';

const emptyForm = { name: '', brand: '', email: '', phone: '' };

const fieldLabelCls = 'mb-2 block text-[11px] font-semibold tracking-[1.2px] text-label uppercase';
const inputCls =
  'w-full rounded-lg border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none placeholder:text-label transition-colors focus:border-ink';

export function BookCallModal({ open, onClose }) {
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
      setResult(await submitCallRequest(form));
    } catch (err) {
      setErrors(Object.keys(err.fields ?? {}).length ? err.fields : { _: err.message });
      const firstField = Object.keys(err.fields ?? {})[0];
      if (firstField) document.querySelector(`[name="${firstField}"]`)?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelId="book-call-title"
      title={result ? 'Request received' : 'Book a call'}
      subtitle={result ? undefined : "Leave your details and we'll call you back."}
    >
      {result ? (
        <div className="text-center">
          <p className="text-[15px] text-ink">{result.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-full bg-ink py-3.5 text-[13px] font-semibold tracking-[1.4px] text-paper uppercase transition-opacity hover:opacity-80"
          >
            Done
          </button>
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
            disabled={submitting}
            className="w-full rounded-full bg-ink py-4 text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Sending…' : 'Book a call'}
          </button>
        </form>
      )}
    </Modal>
  );
}
