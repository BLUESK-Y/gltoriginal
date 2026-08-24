import { Link } from 'react-router-dom';

const LINKS = [
  ['/#network', 'Network'],
  ['/#faq', 'FAQ'],
];

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="px-10 py-24 md:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <img src="/assets/glt-logo-dashboard.png" alt="Ground Link Technology" className="mb-2 h-16 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Hyper-localised retail ad infrastructure at the billing counter.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-1">
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} className="text-base text-white/70 transition-opacity hover:opacity-100 hover:text-white">
                {label}
              </a>
            ))}
            <Link to="/run-a-campaign" className="text-base text-white/70 transition-opacity hover:opacity-100 hover:text-white">
              Run a campaign
            </Link>
          </div>

          <div className="flex flex-col gap-4 md:col-span-1">
            <a href="mailto:groundlinktechnology@gmail.com" className="text-base font-bold text-white underline">
              Contact
            </a>
            <a href="mailto:groundlinktechnology@gmail.com" className="text-base text-white/70 hover:text-white">
              groundlinktechnology@gmail.com
            </a>
            <a href="tel:+918714010429" className="text-base text-white/70 hover:text-white">
              +91 87140 10429
            </a>
          </div>

          <div className="flex flex-col gap-4 md:col-span-1">
            <p className="text-base text-white/70">Trivandrum, Kerala 695013</p>
            <p className="text-base text-white/70">MSME UDYAM-KL-12-0139682</p>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-8">
          <p className="text-base text-white/40">© 2026 Ground Link Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
