import Link from 'next/link';
import { useRouter } from 'next/router';
import Icon from './Icon';
import AccentDot from './AccentDot';

const TABS = [
  { href: '/', icon: 'dashboard', label: 'Guests' },
  { href: '/hosts', icon: 'dns', label: 'Hosts' },
  { href: '/tasks', icon: 'receipt_long', label: 'Tasks' },
  { href: '/settings', icon: 'settings', label: 'Settings' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

// Floating pill navigation on a card-coloured surface: a bottom bar on phones,
// a left rail on wide screens. The active item is the filled inverse pill.
// Rendered once, globally, by AppShell.
export default function Nav() {
  const router = useRouter();

  return (
    <>
      {/* Wide screens: left rail */}
      <aside className="hidden md:flex md:flex-col md:fixed md:left-3 md:top-3 md:bottom-3 md:w-56 md:z-30 bg-surface rounded-hero shadow-card p-3">
        <div className="px-3 py-3 flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/nullprox.svg" alt="" width={28} height={28} className="rounded-full" />
          <span className="text-xl font-bold tracking-tight">nullprox</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {TABS.map((t) => {
            const active = isActive(router.pathname, t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-inverse text-on-inverse'
                    : 'text-secondary hover:text-primary hover:bg-primary/[0.06]'
                }`}
              >
                <Icon name={t.icon} size={20} />
                {t.label}
              </Link>
            );
          })}
        </nav>
        <AccentDot className="self-start" />
      </aside>

      {/* Phones: floating bottom pill */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
        <div className="max-w-md mx-auto bg-surface rounded-full shadow-card p-1.5 grid grid-cols-4 gap-1 pointer-events-auto">
          {TABS.map((t) => {
            const active = isActive(router.pathname, t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-full text-[11px] font-semibold transition-colors ${
                  active ? 'bg-inverse text-on-inverse' : 'text-secondary hover:text-primary'
                }`}
              >
                <Icon name={t.icon} size={22} />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
