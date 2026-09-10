import { json, sha256Hex, safeEqual, unauthorized } from './util.js';

const SESSION_TTL = 7 * 24 * 60 * 60;

function getPassword(env) {
  return env.ADMIN_PASSWORD || 'admin123';
}

export async function verifyPasswordHash(passwordHash, env) {
  if (!passwordHash || typeof passwordHash !== 'string') return false;
  const expected = await sha256Hex(getPassword(env));
  return safeEqual(passwordHash.toLowerCase(), expected);
}

export async function createSession(env) {
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const payload = {
    exp: Date.now() + SESSION_TTL * 1000
  };
  await env.BLOG_KV.put(`session:${token}`, JSON.stringify(payload), {
    expirationTtl: SESSION_TTL
  });
  return token;
}

export async function readToken(request) {
  const header = request.headers.get('Authorization') || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return '';
}

export async function verifySession(request, env) {
  const token = await readToken(request);
  if (!token) return false;
  const raw = await env.BLOG_KV.get(`session:${token}`);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw);
    return Date.now() < Number(session.exp || 0);
  } catch {
    return false;
  }
}

export async function requireAuth(request, env) {
  const ok = await verifySession(request, env);
  if (!ok) return unauthorized('登录已过期，请重新登录');
  return null;
}

export function authOk(token) {
  return json({ token, ok: true });
}
