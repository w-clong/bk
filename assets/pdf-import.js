/* 后台文章列表：PDF 导入为文章（独立脚本，不侵入构建产物） */
(function () {
  'use strict';
  if (window.__pdfImportLoaded) return;
  window.__pdfImportLoaded = true;
  if (!window.pdfjsLib) return;
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

  function isPostsPage() {
    var p = location.pathname;
    return /^\/admin/.test(p) && !/\/editor/.test(p);
  }

  async function extractText(file) {
    try {
      var buf = await file.arrayBuffer();
      var doc = await window.pdfjsLib.getDocument({ data: buf }).promise;
      var text = '';
      for (var n = 1; n <= doc.numPages; n++) {
        var page = await doc.getPage(n);
        var tc = await page.getTextContent();
        text += tc.items.map(function (it) { return it.str + (it.hasEOL ? '\n' : ' '); }).join('') + '\n\n';
      }
      return text;
    } catch (e) { return ''; }
  }

  async function importPdf(file) {
    if (!/\.pdf$/i.test(file.name)) return;
    var btn = document.querySelector('.pdf-import-btn');
    var old = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '解析中…'; }
    try {
      var text = await extractText(file);
      if (!text || !text.trim()) {
        window.alert('PDF 解析失败或没有文本内容：' + file.name);
        return;
      }
      var res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.replace(/\.pdf$/i, ''),
          content: text,
          status: 'published'
        })
      });
      if (res.ok) {
        location.reload();
        return;
      }
      var j = await res.json().catch(function () { return {}; });
      window.alert('导入失败：' + (j.error || res.status));
    } catch (e) {
      window.alert('导入失败：' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  }

  function setup() {
    var zone = document.querySelector('.drop-zone');
    if (!zone) return false;
    if (document.querySelector('.pdf-import')) return true;
    zone.addEventListener('drop', function (e) {
      var files = e.dataTransfer && e.dataTransfer.files ? Array.prototype.slice.call(e.dataTransfer.files) : [];
      for (var i = 0; i < files.length; i++) {
        if (/\.pdf$/i.test(files[i].name)) importPdf(files[i]);
      }
    });
    var wrap = document.createElement('div');
    wrap.className = 'pdf-import';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn pdf-import-btn';
    btn.textContent = '📄 导入 PDF 为文章';
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.style.display = 'none';
    btn.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      if (input.files && input.files[0]) importPdf(input.files[0]);
      input.value = '';
    });
    wrap.appendChild(btn);
    wrap.appendChild(input);
    zone.parentNode.insertBefore(wrap, zone.nextSibling);
    return true;
  }

  var mo = new MutationObserver(function () {
    if (isPostsPage() && setup()) mo.disconnect();
  });
  mo.observe(document.body, { childList: true, subtree: true });
  if (isPostsPage()) setup();
})();
