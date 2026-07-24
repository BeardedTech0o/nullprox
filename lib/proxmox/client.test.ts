import { describe, expect, it } from 'vitest';
import { describeNetworkError } from './client';

describe('describeNetworkError', () => {
  it('explains a DNS/hostname resolution failure', () => {
    const msg = describeNetworkError({ code: 'ENOTFOUND', message: 'x' } as any, 'pve-plex');
    expect(msg).toContain('Could not resolve host "pve-plex"');
  });

  it('explains a refused connection distinctly from a timeout', () => {
    const msg = describeNetworkError({ code: 'ECONNREFUSED', message: 'x' } as any, '10.0.0.5');
    expect(msg).toContain('Connection refused by 10.0.0.5');
  });

  it('explains an unverifiable TLS certificate', () => {
    const msg = describeNetworkError(
      { code: 'DEPTH_ZERO_SELF_SIGNED_CERT', message: 'x' } as any,
      '10.0.0.5',
    );
    expect(msg).toContain('TLS certificate could not be verified');
  });

  it('falls back to the raw error message for unrecognised codes', () => {
    const msg = describeNetworkError({ code: 'EWEIRD', message: 'something odd' } as any, 'h');
    expect(msg).toBe('something odd');
  });
});
