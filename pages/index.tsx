import Link from 'next/link';
import AppBar from '@/components/AppBar';
import Icon from '@/components/Icon';
import {
  PageShell,
  CardSkeleton,
  ErrorState,
  EmptyState,
  StatusBadge,
} from '@/components/ui';
import { useHosts, useAllGuests, type GuestRow } from '@/lib/client/hooks';

function fmtMem(bytes?: number) {
  if (!bytes) return '—';
  const gb = bytes / 1024 ** 3;
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 ** 2).toFixed(0)} MB`;
}

function GuestCard({ g }: { g: GuestRow }) {
  const type = g.type === 'lxc' ? 'lxc' : 'qemu';
  return (
    <Link
      href={`/guest/${g.hostId}/${type}/${g.vmid}`}
      // Grid instead of flex here: the middle column's minmax(0, 1fr) gives an
      // explicit, unambiguous minimum width for the truncating text block.
      // Flexbox's equivalent relies on each browser correctly overriding a
      // flex item's default min-width:auto — Safari/iOS doesn't always agree
      // with Chromium on that, which was letting this row render wider than
      // the screen instead of truncating the guest name.
      className="card !py-3.5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 hover:shadow-card-hover transition-shadow"
    >
      <div className="h-10 w-10 icon-badge">
        <Icon name={type === 'lxc' ? 'deployed_code' : 'computer'} />
      </div>
      <div className="min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold truncate">{g.name || `#${g.vmid}`}</span>
          <span className="text-xs text-secondary shrink-0">#{g.vmid}</span>
        </div>
        <div className="text-xs text-secondary truncate">
          {g.node} · {type.toUpperCase()} · {fmtMem(g.maxmem)}
        </div>
      </div>
      <StatusBadge status={g.status} />
    </Link>
  );
}

// The screen's one gradient surface: running guests as the big number, with
// host and total counts as frosted chips.
function Hero({ running, total, hosts }: { running: number; total: number; hosts: number }) {
  return (
    <section className="hero">
      <p className="text-sm font-semibold opacity-80">Running now</p>
      <p className="big-number text-[4.5rem] mt-3">
        {running}
        <span className="dim text-3xl ml-2 tracking-tight">of {total}</span>
      </p>
      <div className="flex flex-wrap gap-2 mt-5">
        <span className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold">
          {hosts} host{hosts === 1 ? '' : 's'}
        </span>
        <span className="glass rounded-full px-3.5 py-1.5 text-xs font-semibold">
          {total - running} stopped
        </span>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const hostsQ = useHosts();
  const guestsQ = useAllGuests(hostsQ.data);
  const running = guestsQ.data?.guests.filter((g) => g.status === 'running').length ?? 0;

  return (
    <>
      <AppBar
        title="Guests"
        subtitle={
          hostsQ.data
            ? `${hostsQ.data.length} host${hostsQ.data.length === 1 ? '' : 's'} · ${running} running`
            : undefined
        }
        actions={
          hostsQ.data && hostsQ.data.length > 0 ? (
            <Link href="/create" aria-label="Create guest" className="icon-circle h-10 w-10 text-accent">
              <Icon name="add" size={24} />
            </Link>
          ) : undefined
        }
      />
      <PageShell>
        {hostsQ.isLoading && <CardSkeleton />}
        {hostsQ.isError && (
          <ErrorState message={(hostsQ.error as Error).message} onRetry={hostsQ.refetch} />
        )}
        {hostsQ.data && hostsQ.data.length === 0 && (
          <EmptyState
            icon="dns"
            title="No hosts yet"
            subtitle="Connect your first Proxmox host to see its VMs and containers."
            action={
              <Link
                href="/hosts/new"
                className="px-4 py-2 rounded-full bg-inverse text-on-inverse text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add a host
              </Link>
            }
          />
        )}

        {hostsQ.data && hostsQ.data.length > 0 && (
          <>
            {guestsQ.isLoading && <CardSkeleton count={4} />}
            {guestsQ.data?.errors.map((e) => (
              <div
                key={e}
                className="card !p-3 flex items-center gap-2 text-sm text-warning"
              >
                <Icon name="warning" size={18} /> {e}
              </div>
            ))}
            {guestsQ.data && (
              <Hero running={running} total={guestsQ.data.guests.length} hosts={hostsQ.data.length} />
            )}
            {guestsQ.data && (
              <div className="flex flex-col gap-3">
                {hostsQ.data.map((h) => {
                  const guestsForHost = guestsQ.data!.guests.filter((g) => g.hostId === h.id);
                  return (
                    <section key={h.id} className="flex flex-col gap-3">
                      <h2 className="stat-label px-2">{h.name}</h2>
                      {guestsForHost.length === 0 ? (
                        <p className="text-sm text-secondary">No guests on this host.</p>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {guestsForHost.map((g) => (
                            <GuestCard key={`${g.hostId}-${g.vmid}`} g={g} />
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </PageShell>
    </>
  );
}
