# 个人博客

基于 Cloudflare Pages + Pages Functions 的博客系统（KV 存储）。

## 部署方式（Git 集成）

1. 推送本仓库到 GitHub
2. Cloudflare 控制台 → Workers 和 Pages → Create → Pages → **Connect to Git**
3. 选择本仓库
4. 构建配置：
   - 构建命令：留空
   - 构建输出目录：`/`
5. **部署成功后必须配置两项**（项目设置 → Settings）：
   - **环境变量（Environment variables）**：添加 `ADMIN_PASSWORD` = 你的后台登录密码
   - **绑定（Bindings）→ KV Namespace**：添加 `BLOG_KV` = 绑定存有文章数据的命名空间
6. 配置完成后**重新部署一次**（让配置生效）

## 登录说明

后台地址：`/admin`。登录时前端会把 `ADMIN_PASSWORD` 的 SHA-256 发给 `/api/auth` 校验。

## 目录结构

- `index.html` — SPA 入口
- `assets/` — 静态资源（前端 JS/CSS）
- `functions/` — API（Pages Functions，处理 /api/*）
- `_redirects` — SPA 兜底 + 301 重定向
- `_routes.json` — /api/* 路由到 Functions
- `_headers` — 静态资源缓存策略
