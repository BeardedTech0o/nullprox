# Security Model

ProxLink holds API tokens that control your Proxmox infrastructure, so security
is treated as a first-class concern mapped to the OWASP Top 10.

## Threat model summary
- **Assets:** Proxmox API token secrets, the app-unlock PIN-derived key, console
  tickets.
- **Trust boundary:** the self-hosted ProxLink server is the only component that
  ever sees decrypted token secrets. The browser talks only to ProxLink's
  same-origin BFF.

## Controls (OWASP Top 10)
- **A01 Broken Access Control** — every API route requires a valid app-unlock
  session. The PVE proxy (`pages/api/pve/[...path].ts`) only forwards
  `(method, path)` pairs on an explicit allowlist (`lib/proxmox/allowlist.ts`);
  arbitrary passthrough is impossible.
- **A02 Cryptographic Failures** — token secrets are encrypted at rest with
  AES-256-GCM. The data-encryption key (DEK) is wrapped by a key derived from the
  PIN via scrypt and only ever exists decrypted in server memory while unlocked
  (`lib/crypto.ts`, `lib/session.ts`).
- **A03 Injection** — all request bodies are validated with zod; SQLite access is
  fully parameterized (`lib/db.ts`).
- **A04 Insecure Design** — single-use, short-lived console tickets; PIN attempts
  are rate-limited with persistent exponential backoff.
- **A05 Security Misconfiguration** — strict security headers incl. CSP, HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, and `frame-ancestors 'none'`
  (`next.config.js`); the container runs as a non-root user; production source
  maps are disabled.
- **A06 Vulnerable & Outdated Components** — `npm audit` runs in CI on every push
  (informational, not currently a hard gate — see below).
- **A07 Identification & Authentication Failures** — httpOnly/SameSite=Strict
  session cookie with idle + absolute timeouts; wrong-PIN detection via GCM auth
  failure (no separate password hash to leak).
- **A08 Software & Data Integrity** — TLS fingerprint pinning per host; ISO
  download checksums passed through to Proxmox when provided.
- **A09 Logging & Monitoring** — privileged actions are recorded in an audit log
  that never contains secrets (`audit()` in `lib/db.ts`).
- **A10 SSRF** — the host base-URL and ISO-from-URL inputs pass through
  `lib/ssrf.ts`, which restricts schemes and blocks loopback/link-local/RFC1918/
  cloud-metadata targets by default (host URLs opt into private ranges; ISO
  downloads do so only via `PROXLINK_ALLOW_PRIVATE_ISO=1`).

## Known dependency findings (reviewed, not currently exploitable)

`npm audit` currently flags Next.js 14.2.35 (the latest stable 14.x release)
against several advisories. Each one was checked against how this app actually
uses Next.js, not just its title:

- Every remaining advisory requires a feature this app doesn't use: the App
  Router / Server Actions / React Server Components (this app is Pages Router
  only), `next.config.js` `rewrites()` or `i18n` (neither is configured), the
  built-in Image Optimizer (disabled outright via `images.unoptimized`), or
  Next's own WebSocket-upgrade proxying (this app's custom `server.ts` attaches
  its own `'upgrade'` listener directly on the raw `http.Server` and never
  hands WebSocket upgrade requests to Next's request handler at all, so Next's
  internal upgrade-handling code is never reached).
- The transitive `postcss` findings require processing untrusted CSS; this app
  only ever runs PostCSS on its own authored stylesheet at build time.

None of this is a substitute for actually upgrading — it's the reasoning for
why a stable, non-breaking patch isn't available for 14.x right now and a
major-version jump (Next 14 → 16) wasn't rushed through under time pressure
just to silence the scanner. That upgrade is worth doing deliberately, with
full regression testing of the custom server and console WebSocket proxy,
as separate, dedicated work — not folded into an unrelated change.

## Operational guidance
- Run ProxLink only on a trusted/VPN network and terminate TLS in front of it for
  production use.
- Create a dedicated Proxmox API token with the least privilege needed.
- Back up the `/data` volume (contains the encrypted SQLite database).

## Reporting
Open a private security advisory on the repository rather than a public issue.
