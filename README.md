# ProxLink

Mobile-first PWA for managing Proxmox VE hosts from your phone. Talks to
Proxmox over its REST API via API tokens, through a self-hosted backend that
holds encrypted credentials — meant to run as an LXC on Proxmox itself.

Built with Next.js + Tailwind. See [`SECURITY.md`](./SECURITY.md) for the
security model.

## Features

App lock (PIN, AES-256-GCM at rest) · multi-host dashboard, grouped by host ·
guest lifecycle (start/stop/reboot, confirm on destructive) · config editing ·
create wizard for QEMU/LXC · ISO/template download from URL · snapshots &
backups · VNC/terminal console with on-screen keyboard and auto-resize ·
node shell · cross-host tasks view · light/dark theme + accent, installable
PWA · allowlisted PVE proxy, SSRF-guarded ISO fetch, CSP/security headers,
audit log.

## Setup

### 1. Create a Proxmox API token

Tokens have Privilege Separation on by default — a new token starts with
**no permissions**. Either disable it so the token inherits the user's
rights, or grant an explicit role.

Web UI: Datacenter → Permissions → API Tokens → Add. Uncheck Privilege
Separation for the simple case. Copy the secret (shown once).

Shell (simple):

```bash
pveum user token add root@pam proxlink --privsep 0
```

For least privilege, create a dedicated role/user instead of using `root@pam`,
scoped to just the privileges below.

Privileges by feature — console needs `VM.Console`, node shell needs
`Sys.Console`, guest listing needs `VM.Audit`+`Sys.Audit`+`Pool.Audit`,
lifecycle needs `VM.PowerMgmt`, snapshots/backups need `VM.Snapshot`/
`VM.Backup`. A silent feature failure is almost always a missing privilege
here.

### 2. Deploy

One-line LXC installer (recommended), run on a Proxmox host:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/BeardedTech0o/prox-link/main/scripts/install-lxc.sh)"
```

Tunable via env vars, e.g. `CTID=131 CT_HOSTNAME=proxlink DISK_GB=10
RAM_MB=1024 CORES=2 BRIDGE=vmbr0 STORAGE=local-lvm bash -c "..."`.

Manual: any Docker host (LXC, NAS, VM) —

```bash
git clone https://github.com/beardedtech0o/prox-link.git && cd prox-link
docker compose up -d --build
```

Browse to `http://<ip>:3000`. The SQLite DB persists in the `proxlink-data`
volume — back it up if it matters.

### 3. First run

Add to Home Screen on a phone. Set a PIN (unrecoverable if forgotten). Go to
Hosts → Add: base URL with port, token ID, token secret — leave Verify TLS
off for a self-signed cert (ProxLink pins the fingerprint instead). Test
connection, then Save.

## Configuration

`PORT` (3000), `HOST` (0.0.0.0), `PROXLINK_DATA_DIR` (`/data`),
`PROXLINK_ALLOW_PRIVATE_ISO` (0 — allow ISO downloads from private/LAN URLs).
Run behind HTTPS on a trusted/VPN network in production.

## Updating

```bash
cd /opt/proxlink && git pull && docker compose up -d --build
```

## Watchdog

`scripts/install-lxc.sh` installs a systemd timer checking every 2 minutes,
restarting Docker/the container if wedged — including a silently-broken
outbound network (e.g. after a host OS upgrade) even when Docker looks
healthy. Add to an existing install:

```bash
pct exec <CTID> -- bash -c "cd /opt/proxlink && git pull"
pct exec <CTID> -- bash /opt/proxlink/scripts/watchdog/install.sh
```

Optional webhook alerts: set `PROXLINK_WATCHDOG_WEBHOOK=<url>` in
`/etc/default/proxlink-watchdog`, then restart the timer.

## Troubleshooting

"Request timed out" while Proxmox's own web UI works fine means the network
path from the ProxLink container is broken, not Proxmox — the error now
names the actual cause (DNS, refused, unreachable, timeout). Try
`systemctl restart docker` after a host OS upgrade. Prefer IPs over
hostnames for host entries.

## Development

```bash
npm install && npm run dev   # custom server, port 3000
npm run typecheck && npm run lint && npm test && npm run build
```

## Roadmap

Done: app lock, multi-host dashboard, lifecycle, config editing, create
wizard, ISO/template download, snapshots, backups, console, node shell,
tasks. Planned: monitoring charts, push notifications, cluster/storage/
network/firewall/user administration, passcode reset.

[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=nullobj&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/nullobj)
