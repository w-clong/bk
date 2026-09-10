import { autoExcerpt, extractCover, slugify, summarize, uniqueSlug } from './util.js';

const POSTS_KEY = 'meta:posts';
const SITE_KEY = 'meta:site';

const DEFAULT_SITE = {
  title: '我的博客',
  description: '记录生活与思考',
  author: ''
};

export async function getSite(env) {
  const site = await env.BLOG_KV.get(SITE_KEY, 'json');
  return { ...DEFAULT_SITE, ...(site || {}) };
}

export async function saveSite(env, patch) {
  const current = await getSite(env);
  const next = {
    title: String(patch.title ?? current.title).trim() || DEFAULT_SITE.title,
    description: String(patch.description ?? current.description).trim(),
    author: String(patch.author ?? current.author).trim()
  };
  await env.BLOG_KV.put(SITE_KEY, JSON.stringify(next));
  return next;
}

export async function getIndex(env) {
  const raw = await env.BLOG_KV.get(POSTS_KEY, 'json');
  if (Array.isArray(raw)) return raw;

  const rebuilt = [];
  let cursor;
  do {
    const page = await env.BLOG_KV.list({ prefix: 'post:', cursor });
    for (const key of page.keys) {
      const post = await env.BLOG_KV.get(key.name, 'json');
      if (post?.id) rebuilt.push(summarize(post));
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  await env.BLOG_KV.put(POSTS_KEY, JSON.stringify(rebuilt));
  return rebuilt;
}

async function writeIndex(env, index) {
  await env.BLOG_KV.put(POSTS_KEY, JSON.stringify(index));
}

export async function getPost(env, id) {
  return env.BLOG_KV.get(`post:${id}`, 'json');
}

export async function getPostBySlug(env, slug) {
  const index = await getIndex(env);
  const meta = index.find((p) => p.slug === slug);
  if (!meta) return null;
  return getPost(env, meta.id);
}

export async function listFullPosts(env) {
  const index = await getIndex(env);
  const posts = [];
  for (const item of index) {
    const post = await getPost(env, item.id);
    if (post) posts.push(post);
  }
  return posts;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, 20);
}

function normalizeStatus(status) {
  return status === 'draft' ? 'draft' : 'published';
}

export async function createPost(env, input) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const index = await getIndex(env);
  const slug = uniqueSlug(slugify(input.slug || input.title, id), index, id);
  const content = String(input.content || '');
  const post = {
    id,
    slug,
    title: String(input.title || '未命名文章').trim() || '未命名文章',
    content,
    excerpt: String(input.excerpt || '').trim() || autoExcerpt(content),
    tags: normalizeTags(input.tags),
    status: normalizeStatus(input.status),
    cover: String(input.cover || '').trim() || extractCover(content),
    createdAt: now,
    updatedAt: now
  };
  await env.BLOG_KV.put(`post:${id}`, JSON.stringify(post));
  index.unshift(summarize(post));
  await writeIndex(env, index);
  return post;
}

export async function updatePost(env, id, input) {
  const current = await getPost(env, id);
  if (!current) return null;
  const index = await getIndex(env);
  const content = input.content != null ? String(input.content) : current.content;
  const next = {
    ...current,
    title: input.title != null ? String(input.title).trim() || current.title : current.title,
    content,
    excerpt:
      input.excerpt != null
        ? String(input.excerpt).trim() || autoExcerpt(content)
        : current.excerpt,
    tags: input.tags != null ? normalizeTags(input.tags) : current.tags,
    status: input.status != null ? normalizeStatus(input.status) : current.status,
    cover:
      input.cover != null
        ? String(input.cover).trim() || extractCover(content)
        : current.cover || extractCover(content),
    updatedAt: new Date().toISOString()
  };
  if (input.slug != null || input.title != null) {
    const base = slugify(input.slug || next.title, id);
    next.slug = uniqueSlug(base, index, id);
  }
  await env.BLOG_KV.put(`post:${id}`, JSON.stringify(next));
  const i = index.findIndex((p) => p.id === id);
  if (i >= 0) index[i] = summarize(next);
  else index.unshift(summarize(next));
  await writeIndex(env, index);
  return next;
}

export async function deletePost(env, id) {
  const index = await getIndex(env);
  const exists = index.some((p) => p.id === id);
  if (!exists) return false;
  await env.BLOG_KV.delete(`post:${id}`);
  await writeIndex(env, index.filter((p) => p.id !== id));
  return true;
}

export async function saveImage(env, file) {
  const id = crypto.randomUUID();
  const buf = await file.arrayBuffer();
  const type = file.type || 'image/jpeg';
  const filename = file.name || `${id}.jpg`;
  const createdAt = new Date().toISOString();
  await env.BLOG_KV.put(`img:${id}`, buf, {
    metadata: {
      type,
      filename,
      size: buf.byteLength,
      createdAt
    }
  });
  return {
    id,
    url: `/api/img/${id}`,
    filename,
    type,
    size: buf.byteLength,
    createdAt
  };
}

export async function getImage(env, id) {
  return env.BLOG_KV.getWithMetadata(`img:${id}`, { type: 'arrayBuffer' });
}

export async function listImages(env) {
  const out = [];
  let cursor;
  do {
    const page = await env.BLOG_KV.list({ prefix: 'img:', cursor });
    for (const key of page.keys) {
      const id = key.name.slice(4);
      out.push({
        id,
        url: `/api/img/${id}`,
        filename: key.metadata?.filename || id,
        type: key.metadata?.type || 'image/jpeg',
        size: key.metadata?.size || 0,
        createdAt: key.metadata?.createdAt || ''
      });
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  out.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return out;
}

export async function deleteImage(env, id) {
  const exists = await env.BLOG_KV.get(`img:${id}`, { type: 'arrayBuffer' });
  if (!exists) return false;
  await env.BLOG_KV.delete(`img:${id}`);
  return true;
}

export async function exportAll(env) {
  const posts = await listFullPosts(env);
  const imagesMeta = await listImages(env);
  const images = [];
  for (const item of imagesMeta) {
    const stored = await getImage(env, item.id);
    if (!stored?.value) continue;
    const bytes = new Uint8Array(stored.value);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    images.push({
      ...item,
      data: btoa(binary)
    });
  }
  return { posts, images, site: await getSite(env) };
}
