import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import AppBar from '@/components/AppBar';
import Icon from '@/components/Icon';
import { PageShell } from '@/components/ui';
import { api } from '@/lib/client/fetcher';

export default function SettingsPage() {
  const router = useRouter();
  const qc = useQueryClient();

  async function lockNow() {
    await api('/api/lock/lock', { method: 'POST' });
    qc.clear();
    router.replace('/lock');
  }

  return (
    <>
      <AppBar title="Settings" />
      <PageShell>
        <section className="card flex flex-col gap-3">
          <h2 className="font-semibold">Security</h2>
          <p className="text-sm text-secondary">
            Your Proxmox tokens are encrypted with your PIN and only decrypted in
            memory while unlocked.
          </p>
          <button
            onClick={lockNow}
            className="px-4 py-2 rounded-2xl bg-elevated text-sm font-medium hover:bg-border/40 transition-colors flex items-center gap-2 w-fit"
          >
            <Icon name="lock" size={18} /> Lock now
          </button>
        </section>

        <p className="text-center text-xs text-secondary">
          ProxLink · v0.1.0
          {process.env.NEXT_PUBLIC_BUILD_TIME && (
            <> · Built {new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toLocaleString()}</>
          )}
        </p>
      </PageShell>
    </>
  );
}
