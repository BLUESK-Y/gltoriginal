import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { setClient } from '../../auth.js';
import { Modal } from './Modal';

const fieldLabelCls = 'mb-1.5 block text-[11px] font-semibold tracking-[1px] text-label uppercase';
const inputCls =
  'w-full rounded-md border border-rule bg-paper px-3.5 py-2.5 text-[14px] text-ink outline-none placeholder:text-label transition-colors focus:border-ink';

export function LoginModal({ open, onClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(payload.error ?? 'Could not log in. Try again.');
        return;
      }

      setClient(payload.client);
      onClose();
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelId="client-login" title="Client login" subtitle="Sign in to view your campaign.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={fieldLabelCls}>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="you@brand.com"
            value={email}
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={fieldLabelCls}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            required
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>

        {error && (
          <p role="alert" className="text-[13px] text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink py-4 text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </Modal>
  );
}
