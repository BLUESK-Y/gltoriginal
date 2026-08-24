import { useState } from 'react';

import { BookCallModal } from '../components/BookCallModal';

const FAQS = [
  {
    q: 'How are campaigns verified?',
    a: 'We provide weekly geo-stamped and time-stamped photo audits and reports, delivered through your client dashboard.',
  },
  {
    q: 'What is included in the campaign cost?',
    a: 'Ad space rental, poster printing, installation, and real-time tracking — no extra line items.',
  },
  {
    q: 'How do retailers join the network?',
    a: 'Retailers can submit an installation request below. We provide the hardware, backed by a fully refundable security deposit.',
  },
];

export function FaqCta({ onBookHub }) {
  const [callModalOpen, setCallModalOpen] = useState(false);

  return (
    <section id="faq" className="bg-paper px-10 py-20 md:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-ink uppercase">FAQ</h2>
          <div className="flex flex-col gap-6">
            {FAQS.map((item) => (
              <div key={item.q} className="border-t border-rule pt-4">
                <p className="text-[12px] font-bold tracking-[0.06em] text-ink uppercase">Q: {item.q}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">A: {item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <button
              type="button"
              onClick={() => setCallModalOpen(true)}
              className="block w-full rounded-full bg-ink py-4 text-center text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80"
            >
              Book a call
            </button>
            <p className="mt-2 text-[13px] text-muted">Connect with us for a detailed walkthrough of your campaign.</p>
          </div>

          <div>
            <button
              type="button"
              onClick={onBookHub}
              className="block w-full rounded-full bg-ink py-4 text-center text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80"
            >
              Book a hub
            </button>
            <p className="mt-2 text-[13px] text-muted">Are you a store owner? Register your retail outlet to host an ad hub.</p>
          </div>

          <div>
            <a
              href="#network"
              className="block w-full rounded-full bg-ink py-4 text-center text-[13px] font-semibold tracking-[0.1em] text-paper uppercase transition-opacity hover:opacity-80"
            >
              See previous campaigns
            </a>
            <p className="mt-2 text-[13px] text-muted">Explore where hubs are already live across Trivandrum.</p>
          </div>
        </div>
      </div>

      <BookCallModal open={callModalOpen} onClose={() => setCallModalOpen(false)} />
    </section>
  );
}
