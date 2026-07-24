# ProxLink

![ProxLink — homelab control, in your pocket](./public/proxlink-collage.png)

Mobile-first PWA for managing Proxmox VE hosts from your phone — self-hosted,
meant to run as an LXC on Proxmox itself.

Built with Next.js + Tailwind. See [`SECURITY.md`](./SECURITY.md).

## Features

App lock (PIN, AES-256-GCM) · multi-host dashboard · guest lifecycle ·
config editing · create wizard · ISO/template download from URL ·
snapshots & backups · VNC/terminal console (keyboard, Tab/arrows,
auto-resize) · node shell · cross-host tasks · theming, installable PWA ·
allowlisted proxy, SSRF guard, CSP headers, audit log.

## Setup

### 1. Proxmox API token

A new token has **no permissions** by default (Privilege Separation). Disable
it to inherit the user's rights, or grant a role.

Web UI: Datacenter → Permissions → API Tokens → Add, uncheck Privilege
Separation, copy the secret. Or via shell:

```bash
pveum user token add root@pam proxlink --privsep 0
```

Least privilege: a dedicated role, not `root@pam`. Console needs
`VM.Console`, node shell `Sys.Console`, listing
`VM.Audit`+`Sys.Audit`+`Pool.Audit`, lifecycle `VM.PowerMgmt`, snapshots/
backups `VM.Snapshot`/`VM.Backup`. A silent feature failure is almost always
a missing privilege here.

### 2. Deploy

One-line LXC installer (recommended), on a Proxmox host:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/BeardedTech0o/prox-link/main/scripts/install-lxc.sh)"
```

Tunable via env vars: `CTID`, `CT_HOSTNAME`, `DISK_GB`, `RAM_MB`, `CORES`,
`BRIDGE`, `STORAGE`.

Manual, any Docker host:

```bash
git clone https://github.com/beardedtech0o/prox-link.git && cd prox-link
docker compose up -d --build
```

Browse to `http://<ip>:3000`. The SQLite DB lives in the `proxlink-data`
volume — back it up if it matters.

### 3. First run

Add to Home Screen. Set a PIN (unrecoverable if forgotten). Hosts → Add:
base URL with port, token ID, token secret — leave Verify TLS off for a
self-signed cert (ProxLink pins the fingerprint instead). Test, then Save.

## Creating a VM and downloading an ISO

Tap **+** on the dashboard for the create wizard: host, node, VM or LXC,
cores/RAM/disk, network bridge. Need an image first? Its **Download ISO/
template from URL** section pulls one straight into Proxmox storage with
live progress, ready to select for the new guest.

## Configuration

`PORT` (3000), `HOST` (0.0.0.0), `PROXLINK_DATA_DIR` (`/data`),
`PROXLINK_ALLOW_PRIVATE_ISO` (0). Run behind HTTPS on a trusted/VPN network
in production.

## Updating

```bash
cd /opt/proxlink && git pull && docker compose up -d --build
```

## Watchdog

The installer adds a systemd timer restarting Docker/the container if
wedged, including a silently-broken network. Add to an existing install:

```bash
pct exec <CTID> -- bash -c "cd /opt/proxlink && git pull"
pct exec <CTID> -- bash /opt/proxlink/scripts/watchdog/install.sh
```

Optional webhook alerts: set `PROXLINK_WATCHDOG_WEBHOOK=<url>` in
`/etc/default/proxlink-watchdog`, then restart the timer.

## Troubleshooting

"Request timed out" while Proxmox's own UI works fine means the network path
from ProxLink is broken, not Proxmox. Try `systemctl restart docker` after a
host OS upgrade. Prefer IPs over hostnames.

## Development

```bash
npm install && npm run dev
npm run typecheck && npm run lint && npm test && npm run build
```

## Roadmap

Done: app lock, dashboard, lifecycle, config editing, create wizard,
ISO/template download, snapshots, backups, console, node shell, tasks.
Planned: monitoring charts, push notifications, cluster/storage/network/
firewall/user administration, passcode reset.

[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=nullobj&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/nullobj)
