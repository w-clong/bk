/* 博客文章页增强：返回顶部按钮 + 右侧吸附跟随大纲 + 滚动高亮当前章节 */
(function () {
  'use strict';
  if (window.__articleUiLoaded) return;
  window.__articleUiLoaded = true;

  /* 后台编辑器 PDF 导入所需的 worker 路径 */
  if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';
  }

  var isPost = function () {
    return /^\/post\//.test(location.pathname);
  };

  /* ---------- 返回顶部按钮 ---------- */
  var btn = document.createElement('button');
  btn.id = 'back-top';
  btn.type = 'button';
  btn.title = '返回顶部';
  btn.setAttribute('aria-label', '返回顶部');
  btn.textContent = '↑';
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  document.body.appendChild(btn);

  /* ---------- 右侧文章大纲 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var tocBox = null;
  var lastTocHtml = '';
  var headsCache = [];

  function renderToc() {
    var body = document.querySelector('.article-body');
    var widget = document.querySelector('.widget-area');
    if (!body || !widget || !isPost()) {
      if (tocBox && tocBox.parentNode) tocBox.parentNode.removeChild(tocBox);
      tocBox = null;
      lastTocHtml = '';
      headsCache = [];
      return;
    }
    var heads = Array.prototype.slice.call(body.querySelectorAll('h1,h2,h3,h4')).filter(function (h) {
      return h.id;
    });
    headsCache = heads;
    if (!heads.length) {
      if (tocBox && tocBox.parentNode) tocBox.parentNode.removeChild(tocBox);
      tocBox = null;
      lastTocHtml = '';
      return;
    }
    if (!tocBox) {
      tocBox = document.createElement('nav');
      tocBox.className = 'article-toc';
      tocBox.setAttribute('aria-label', '文章目录');
      widget.insertBefore(tocBox, widget.firstChild);
    }
    var html = '<div class="article-toc-title">文章目录</div><ul>';
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      var lv = +h.tagName.charAt(1);
      html += '<li class="toc-l' + (lv > 4 ? 4 : lv) + '"><a href="#' + esc(h.id) + '">' + esc(h.textContent) + '</a></li>';
    }
    html += '</ul>';
    /* 内容无变化时不要重写 DOM，避免 MutationObserver 死循环 */
    if (lastTocHtml === html) return;
    lastTocHtml = html;
    tocBox.innerHTML = html;

    var links = tocBox.querySelectorAll('a');
    for (var j = 0; j < links.length; j++) {
      links[j].addEventListener('click', function (e) {
        e.preventDefault();
        var id = decodeURIComponent(this.getAttribute('href').slice(1));
        var target = document.getElementById(id);
        if (target) {
          var y = target.getBoundingClientRect().top + window.scrollY - 18;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        }
      });
    }
  }

  /* ---------- 滚动：按钮显隐 + 大纲当前章节高亮（吸附跟随） ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      btn.classList.toggle('show', y > 420);
      if (tocBox && headsCache.length) {
        var probe = y + 140;
        var current = null;
        for (var i = 0; i < headsCache.length; i++) {
          var top = headsCache[i].getBoundingClientRect().top + y;
          if (top <= probe) current = headsCache[i]; else break;
        }
        var links = tocBox.querySelectorAll('a');
        for (var k = 0; k < links.length; k++) {
          var id = decodeURIComponent(links[k].getAttribute('href').slice(1));
          links[k].classList.toggle('active', current && id === current.id);
        }
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 监听文章内容变化（SPA 路由切换 / 文章异步加载） */
  var mo = new MutationObserver(function () {
    renderToc();
  });
  mo.observe(document.body, { childList: true, subtree: true });

  /* 路由变化（History API）也重建 */
  window.addEventListener('popstate', renderToc);
  window.addEventListener('pushState', renderToc);

  renderToc();
})();
