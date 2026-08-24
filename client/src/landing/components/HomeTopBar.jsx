import { useState } from 'react';

import { BookCallModal } from './BookCallModal';
import { LoginModal } from './LoginModal';

export function HomeTopBar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between border-b border-rule px-6 py-4 md:px-10">
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="bg-ink px-4 py-2 text-[11px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80"
          onClick={() => setLoginOpen(true)}
        >
          Client login
        </button>
        <button
          type="button"
          className="text-[11px] font-semibold tracking-[0.1em] text-muted uppercase transition-colors hover:text-ink"
          onClick={() => setCallOpen(true)}
        >
          Contact us
        </button>
      </div>

      <p className="absolute right-6 hidden text-[13px] font-bold tracking-[0.3em] text-ink uppercase sm:block lg:right-auto lg:left-1/2 lg:-translate-x-1/2">
        Ground Link Technology
      </p>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <BookCallModal open={callOpen} onClose={() => setCallOpen(false)} />
    </div>
  );
}
