import { authOk, createSession, requireAuth, verifyPasswordHash } from '../_lib/auth.js';
import {
  createPost,
  deleteImage,
  deletePost,
  exportAll,
  getImage,
  getPost,
  getPostBySlug,
  getIndex,
  getSite,
  listFullPosts,
  listImages,
  saveImage,
  saveSite,
  updatePost
} from '../_lib/store.js';
import { badRequest, json, notFound, readJson } from '../_lib/util.js';

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

// 公开 GET 接口的 CDN 缓存头：短缓存 + stale-while-revalidate，发布后约 30-60 秒生效。
const PUBLIC_CACHE = { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=300' };

export async function onRequest(context) {
  const { request, env, params } = context;

  if (!env.BLOG_KV) {
    return json({ error: '未绑定 KV 空间 BLOG_KV，请在 Pages 设置中绑定。' }, 500);
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  const parts = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const path = parts.join('/');

  try {
    const response = await route(request, env, path, parts);
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders()).forEach(([k, v]) => headers.set(k, v));
    return new Response(response.body, { status: response.status, headers });
  } catch (error) {
    console.error(error);
    return json({ error: error.message || '服务器错误' }, 500);
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}

async function route(request, env, path, parts) {
  const method = request.method;

  if (path === 'site' && method === 'GET') {
    return json(await getSite(env), 200, PUBLIC_CACHE);
  }

  if (path === 'auth' && method === 'POST') {
    const body = await readJson(request);
    const ok = await verifyPasswordHash(body?.passwordHash, env);
    if (!ok) return json({ error: '密码错误' }, 401);
    const token = await createSession(env);
    return authOk(token);
  }

  if (path === 'posts' && method === 'GET') {
    const index = await getIndex(env);
    const published = index
      .filter((p) => p.status !== 'draft')
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json(published, 200, PUBLIC_CACHE);
  }

  if (parts[0] === 'posts' && parts[1] && method === 'GET') {
    const slug = decodeURIComponent(parts.slice(1).join('/'));
    const post = await getPostBySlug(env, slug);
    if (!post || post.status === 'draft') return notFound('文章不存在');
    return json(post, 200, PUBLIC_CACHE);
  }

  if (parts[0] === 'img' && parts[1] && method === 'GET') {
    const stored = await getImage(env, parts[1]);
    if (!stored?.value) return new Response('Not found', { status: 404 });
    return new Response(stored.value, {
      headers: {
        'Content-Type': stored.metadata?.type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  if (path.startsWith('admin/')) {
    const denied = await requireAuth(request, env);
    if (denied) return denied;
    return adminRoute(request, env, path, parts);
  }

  return notFound('接口不存在');
}

async function adminRoute(request, env, path, parts) {
  const method = request.method;

  if (path === 'admin/posts' && method === 'GET') {
    const posts = await listFullPosts(env);
    posts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return json(posts);
  }

  if (path === 'admin/posts' && method === 'POST') {
    const body = await readJson(request);
    if (!body?.title || !String(body.content || '').trim()) {
      return badRequest('标题和正文不能为空');
    }
    const post = await createPost(env, body);
    return json(post, 201);
  }

  if (parts[0] === 'admin' && parts[1] === 'posts' && parts[2] && method === 'GET') {
    const post = await getPost(env, parts[2]);
    if (!post) return notFound('文章不存在');
    return json(post);
  }

  if (parts[0] === 'admin' && parts[1] === 'posts' && parts[2] && method === 'PUT') {
    const body = await readJson(request);
    if (!body) return badRequest('请求体无效');
    const post = await updatePost(env, parts[2], body);
    if (!post) return notFound('文章不存在');
    return json(post);
  }

  if (parts[0] === 'admin' && parts[1] === 'posts' && parts[2] && method === 'DELETE') {
    const ok = await deletePost(env, parts[2]);
    if (!ok) return notFound('文章不存在');
    return json({ ok: true });
  }

  if (path === 'admin/upload' && method === 'POST') {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file.arrayBuffer !== 'function') {
      return badRequest('请上传图片文件');
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return badRequest('图片不能超过 2MB，请压缩后再试');
    }
    if (file.type && !file.type.startsWith('image/')) {
      return badRequest('仅支持图片文件');
    }
    const saved = await saveImage(env, file);
    return json(saved, 201);
  }

  if (path === 'admin/images' && method === 'GET') {
    return json(await listImages(env));
  }

  if (parts[0] === 'admin' && parts[1] === 'images' && parts[2] && method === 'DELETE') {
    const ok = await deleteImage(env, parts[2]);
    if (!ok) return notFound('图片不存在');
    return json({ ok: true });
  }

  if (path === 'admin/export' && method === 'GET') {
    return json(await exportAll(env));
  }

  if (path === 'admin/settings' && method === 'GET') {
    return json(await getSite(env));
  }

  if (path === 'admin/settings' && method === 'PUT') {
    const body = await readJson(request);
    if (!body) return badRequest('请求体无效');
    return json(await saveSite(env, body));
  }

  if (path === 'admin/me' && method === 'GET') {
    return json({ ok: true });
  }

  return notFound('接口不存在');
}
