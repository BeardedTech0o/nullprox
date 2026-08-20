#!/usr/bin/env bash
# nullprox watchdog — detects a stopped container or a wedged Docker daemon
# (e.g. after an LXC backup filesystem freeze) and recovers it. Idempotent;
# safe to run on a timer. Installed by scripts/install-lxc.sh, or manually via
# scripts/watchdog/install.sh on an existing deployment.
set -uo pipefail

COMPOSE_DIR="${PROXLINK_DIR:-/opt/proxlink}"
CONTAINER="${PROXLINK_CONTAINER:-proxlink}"
WEBHOOK_URL="${PROXLINK_WATCHDOG_WEBHOOK:-}"
LOG_TAG="proxlink-watchdog"

log() {
  logger -t "$LOG_TAG" "$1" 2>/dev/null || true
  echo "$(date -Is) $1"
}

notify() {
  [ -n "$WEBHOOK_URL" ] || return 0
  curl -fsS -m 5 -X POST -H 'Content-Type: application/json' \
    -d "{\"content\":\"$1\"}" "$WEBHOOK_URL" >/dev/null 2>&1 || true
}

HOST="$(hostname)"

# 1. Is the Docker daemon itself responsive? (A wedged daemon is the failure
#    mode seen after some Proxmox LXC backup filesystem freezes.)
if ! timeout 10 docker info >/dev/null 2>&1; then
  log "Docker daemon unresponsive — restarting docker.service"
  systemctl restart docker
  sleep 5
  if ! timeout 10 docker info >/dev/null 2>&1; then
    log "Docker daemon still unresponsive after restart"
    notify "⚠️ nullprox watchdog on ${HOST}: Docker daemon unresponsive even after restart — needs manual attention"
    exit 1
  fi
  log "Docker daemon recovered after restart"
fi

# 2. Is the app container actually running?
running="$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null || true)"
if [ "$running" != "true" ]; then
  log "$CONTAINER is not running (state: ${running:-absent}) — bringing it up"
  ( cd "$COMPOSE_DIR" && docker compose up -d ) || true
  sleep 5
  running="$(docker inspect -f '{{.State.Running}}' "$CONTAINER" 2>/dev/null || true)"
  if [ "$running" = "true" ]; then
    log "$CONTAINER recovered"
    notify "✅ nullprox watchdog on ${HOST}: container was down, restarted successfully"
  else
    log "Failed to bring $CONTAINER back up"
    notify "🛑 nullprox watchdog on ${HOST}: failed to restart the container — needs manual attention"
    exit 1
  fi
fi

# 3. Can the container actually reach anything outbound? A host OS upgrade
#    (e.g. a Debian major version bump) can leave Docker's iptables/NAT rules
#    stale — the daemon and container both report healthy, but every outbound
#    connection from inside the container silently goes nowhere. Test against
#    the container's own network gateway (always present, no dependency on
#    the user's actual Proxmox hosts or internet access): getting *any*
#    response — even a refused/reset connection — proves packets are flowing;
#    only a bare timeout with no response at all is the broken-NAT signature.
outbound_ok() {
  docker exec "$CONTAINER" node -e "
    const net = require('net');
    const s = net.createConnection({ host: process.argv[1], port: 1, timeout: 3000 });
    s.on('connect', () => { s.destroy(); process.exit(0); });
    s.on('error', () => process.exit(0));
    s.on('timeout', () => { s.destroy(); process.exit(1); });
  " "$1" >/dev/null 2>&1
}

gateway="$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}' "$CONTAINER" 2>/dev/null || true)"
if [ -n "$gateway" ] && ! outbound_ok "$gateway"; then
  log "$CONTAINER's outbound networking looks wedged (no response reaching its own gateway) — restarting docker.service"
  systemctl restart docker
  sleep 5
  if outbound_ok "$gateway"; then
    log "Outbound networking recovered after Docker restart"
    notify "✅ nullprox watchdog on ${HOST}: container networking was wedged, Docker restart fixed it"
  else
    log "Outbound networking still wedged after Docker restart"
    notify "🛑 nullprox watchdog on ${HOST}: container networking still broken after a Docker restart — needs manual attention (known to happen after a host OS major-version upgrade; a full reboot may be required)"
    exit 1
  fi
fi
