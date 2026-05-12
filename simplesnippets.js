(function () {
  const ICONS = {
    copy: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
  };

  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const escapeHtml = s => s.replace(/[&<>"']/g, c => ESC[c]);

  function dedent(text) {
    text = text.replace(/\r\n?/g, '\n').replace(/^[ \t]*\n/, '').replace(/\s+$/, '');
    const lines = text.split('\n');
    const indents = lines.filter(l => l.trim().length).map(l => l.match(/^[ \t]*/)[0].length);
    if (!indents.length) return text;
    const min = Math.min(...indents);
    return min ? lines.map(l => l.slice(min)).join('\n') : text;
  }

  const KEYWORDS = new Set('import from class def function let const var if else elif return for while export default null undefined try catch finally throw new in of as await async yield break continue'.split(' '));
  const BUILTINS = new Set('true false self this print console log window document None True False'.split(' '));

  function highlightCode(src) {
    const out = [];
    const n = src.length;
    let i = 0;
    while (i < n) {
      const ch = src[i], rest = src.slice(i);
      if (ch === '/' && src[i + 1] === '*') {
        const end = src.indexOf('*/', i + 2);
        const stop = end === -1 ? n : end + 2;
        out.push(['comment', src.slice(i, stop)]); i = stop; continue;
      }
      if ((ch === '/' && src[i + 1] === '/') || ch === '#') {
        const nl = src.indexOf('\n', i);
        const stop = nl === -1 ? n : nl;
        out.push(['comment', src.slice(i, stop)]); i = stop; continue;
      }
      if (ch === '"' || ch === "'") {
        let j = i + 1;
        while (j < n && src[j] !== ch) j += (src[j] === '\\' && j + 1 < n) ? 2 : 1;
        const stop = Math.min(j + 1, n);
        out.push(['string', src.slice(i, stop)]); i = stop; continue;
      }
      if (/\d/.test(ch)) {
        const m = rest.match(/^\d+(\.\d+)?/);
        if (m) { out.push(['number', m[0]]); i += m[0].length; continue; }
      }
      if (/[A-Za-z_$]/.test(ch)) {
        const m = rest.match(/^[A-Za-z_$][\w$]*/);
        if (m) {
          const w = m[0];
          const type = KEYWORDS.has(w) ? 'keyword'
            : BUILTINS.has(w) ? 'builtin'
            : src[i + w.length] === '(' ? 'function'
            : 'plain';
          out.push([type, w]); i += w.length; continue;
        }
      }
      out.push(['plain', ch]); i++;
    }
    return out.map(([t, v]) => t === 'plain' ? escapeHtml(v) : `<span class="hl-${t}">${escapeHtml(v)}</span>`).join('');
  }

  const wrap = (cls, txt) => `<span class="${cls}">${escapeHtml(txt)}</span>`;
  const THEMES = {
    code:     { defaultTitle: 'Code',           prompt: () => '' },
    ps:       { icon: '>_',  defaultTitle: 'PowerShell',     prompt: d => wrap('term-prompt-text', `PS ${d.path || 'C:\\Users\\'}>`) + ' ' },
    cmd:      { icon: 'C:\\', defaultTitle: 'Command Prompt', prompt: d => wrap('term-prompt-text', `${d.path || 'C:\\Windows\\System32'}>`) + ' ' },
    bash:     { icon: '$_',  defaultTitle: 'bash',           prompt: d => `${wrap('term-bash-user', `${d.user || 'user'}@${d.host || 'host'}`)}:${wrap('term-bash-path', d.path || '~')}$ ` },
    zsh:      {              defaultTitle: 'zsh',            prompt: d => wrap('term-prompt-text', `${d.user || 'user'}@${d.host || 'host'} ${d.path || '~'} % `) },
    efishell: {              defaultTitle: 'EFI Shell',      prompt: d => wrap('term-prompt-text', `${d.path || 'Shell'}>`) + ' ' }
  };

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('execCommand failed'));
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  function init(el) {
    if (el.dataset.termInit) return;
    el.dataset.termInit = '1';

    const themeKey = el.dataset.theme || 'ps';
    const cfg = THEMES[themeKey] || THEMES.ps;
    const cmdText = dedent(el.textContent);
    const title = el.dataset.title || cfg.defaultTitle;
    const isCode = themeKey === 'code';

    const left = themeKey === 'zsh'
      ? '<div class="term-dots"><span class="term-dot term-dot--red"></span><span class="term-dot term-dot--yellow"></span><span class="term-dot term-dot--green"></span></div>'
      : cfg.icon ? `<div class="term-icon">${escapeHtml(cfg.icon)}</div>` : '';

    el.classList.add('terminal--' + themeKey);
    el.innerHTML = `
      <div class="term-titlebar">
        <div class="term-tb-left">${left}<span class="term-title"></span></div>
        <div class="term-tb-right"><button class="term-copy" type="button" title="Kopieren" aria-label="In Zwischenablage kopieren">${ICONS.copy}</button></div>
      </div>
      <div class="term-content"><span class="term-prompt">${cfg.prompt(el.dataset)}</span><span class="term-cmd"></span></div>
    `;

    el.querySelector('.term-title').textContent = title;
    const body = isCode ? highlightCode(cmdText) : escapeHtml(cmdText);
    el.querySelector('.term-cmd').innerHTML = isCode ? `<code>${body}</code>` : body;

    const btn = el.querySelector('.term-copy');
    const setState = (copied) => {
      btn.classList.toggle('copied', copied);
      btn.innerHTML = copied ? ICONS.check : ICONS.copy;
      btn.setAttribute('aria-label', copied ? 'Kopiert' : 'In Zwischenablage kopieren');
    };
    let resetTimer = null;
    btn.addEventListener('click', () => {
      copyToClipboard(cmdText).then(() => {
        clearTimeout(resetTimer);
        setState(true);
        resetTimer = setTimeout(() => setState(false), 1500);
      }).catch(err => {
        console.warn('Copy failed:', err);
        btn.title = 'Kopieren fehlgeschlagen';
      });
    });
  }

  const run = () => document.querySelectorAll('.terminal').forEach(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.TerminalSnippets = { init, refresh: run };
})();
