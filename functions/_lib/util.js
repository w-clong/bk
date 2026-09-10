export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers
    }
  });
}

export function notFound(message = '未找到') {
  return json({ error: message }, 404);
}

export function badRequest(message = '请求无效') {
  return json({ error: message }, 400);
}

export function unauthorized(message = '未授权') {
  return json({ error: message }, 401);
}

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export function slugify(title, fallbackId) {
  const s = String(title || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return s || `post-${String(fallbackId || 'item').slice(0, 8)}`;
}

export function uniqueSlug(base, existing, currentId) {
  const taken = new Set(
    (existing || [])
      .filter((p) => p.id !== currentId)
      .map((p) => p.slug)
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export function autoExcerpt(markdown, max = 160) {
  const text = String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function extractCover(markdown) {
  const match = String(markdown || '').match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1].trim() : '';
}

export function summarize(post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || '',
    tags: post.tags || [],
    status: post.status || 'published',
    cover: post.cover || '',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
