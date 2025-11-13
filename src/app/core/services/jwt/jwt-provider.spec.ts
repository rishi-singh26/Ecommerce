import { TestBed } from '@angular/core/testing';

import { JwtProvider } from './jwt-provider';

describe('JwtProvider', () => {
  let service: JwtProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Helper to create a token whose payload is base64 (not base64url) to match JwtProvider.atob usage
  function createToken(payload: object): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = btoa(JSON.stringify(header));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'signature';
    return `${headerB64}.${payloadB64}.${signature}`;
  }

  it('isTokenValid should return true for a token with exp well in the future', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 5 * 60; // 5 minutes
    const token = createToken({ exp: futureExp });
    expect(JwtProvider.isTokenValid(token)).toBeTrue();
  });

  it('isTokenValid should return false for an expired token', () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
    const token = createToken({ exp: pastExp });
    expect(JwtProvider.isTokenValid(token)).toBeFalse();
  });

  it('isTokenValid should return false for a token that is about to expire (within 1 minute)', () => {
    const aboutToExpire = Math.floor(Date.now() / 1000) + 30; // 30 seconds
    const token = createToken({ exp: aboutToExpire });
    expect(JwtProvider.isTokenValid(token)).toBeFalse();
  });

  it('isTokenValid should return true for a token without an exp claim', () => {
    const token = createToken({ sub: 'user123' });
    expect(JwtProvider.isTokenValid(token)).toBeTrue();
  });

  it('isTokenValid should return false for invalid token format', () => {
    const invalid = 'not.a.validtoken';
    expect(JwtProvider.isTokenValid(invalid)).toBeFalse();
  });

  it('isTokenValid should return false for malformed payload (invalid JSON)', () => {
    // Create a token whose payload decodes to non-JSON string
    const headerB64 = btoa(JSON.stringify({ alg: 'HS256' }));
    const payloadB64 = btoa('this is not json');
    const token = `${headerB64}.${payloadB64}.sig`;
    expect(JwtProvider.isTokenValid(token)).toBeFalse();
  });

  it('isTokenValid should return true for a token that expires just beyond the buffer (e.g., 61s)', () => {
    const exp = Math.floor(Date.now() / 1000) + 61; // 61 seconds
    const token = createToken({ exp });
    expect(JwtProvider.isTokenValid(token)).toBeTrue();
  });
});
