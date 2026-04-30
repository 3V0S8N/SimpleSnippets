(function () {
  const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  const CHECK_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  // Escape HTML
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
  }

  // Trim & dedent
  function dedent(text) {
    text = text.replace(/\r\n?/g, '\n')
               .replace(/^[ \t]*\n/, '')
               .replace(/\s+$/, '');
    const lines = text.split('\n');
    const indents = lines
      .filter(l => l.trim().length)
      .map(l => l.match(/^[ \t]*/)[0].length);
    if (!indents.length) return text;
    const min = Math.min(...indents);
    return min ? lines.map(l => l.slice(min)).join('\n') : text;
  }

  // Tokenizer
  function highlightCode(rawCode) {
    const KEYWORDS = new Set([
      'import', 'from', 'class', 'def', 'function', 'let', 'const', 'var',
      'if', 'else', 'elif', 'return', 'for', 'while', 'export', 'default',
      'null', 'undefined', 'try', 'catch', 'finally', 'throw', 'new',
      'in', 'of', 'as', 'await', 'async', 'yield', 'break', 'continue'
    ]);
    const BUILTINS = new Set([
      'true', 'false', 'self', 'this', 'print', 'console', 'log',
      'window', 'document', 'None', 'True', 'False'
    ]);

    const tokens = [];
    let i = 0;
    const n = rawCode.length;

    while (i < n) {
      const ch = rawCode[i];
      const rest = rawCode.slice(i);

      // Block comment
      if (ch === '/' && rawCode[i + 1] === '*') {
        const end = rawCode.indexOf('*/', i + 2);
        const stop = end === -1 ? n : end + 2;
        tokens.push({ type: 'comment', value: rawCode.slice(i, stop) });
        i = stop;
        continue;
      }

      // Line comment
      if ((ch === '/' && rawCode[i + 1] === '/') || ch === '#') {
        const nl = rawCode.indexOf('\n', i);
        const stop = nl === -1 ? n : nl;
        tokens.push({ type: 'comment', value: rawCode.slice(i, stop) });
        i = stop;
        continue;
      }

      // Strings
      if (ch === '"' || ch === "'") {
        const quote = ch;
        let j = i + 1;
        while (j < n && rawCode[j] !== quote) {
          if (rawCode[j] === '\\' && j + 1 < n) j += 2;
          else j++;
        }
        const stop = Math.min(j + 1, n);
        tokens.push({ type: 'string', value: rawCode.slice(i, stop) });
        i = stop;
        continue;
      }

      // Numbers
      if (/\d/.test(ch)) {
        const m = rest.match(/^\d+(\.\d+)?/);
        if (m) {
          tokens.push({ type: 'number', value: m[0] });
          i += m[0].length;
          continue;
        }
      }

      // Identifiers
      if (/[A-Za-z_$]/.test(ch)) {
        const m = rest.match(/^[A-Za-z_$][\w$]*/);
        if (m) {
          const word = m[0];
          // Function call lookahead
          const after = rawCode[i + word.length];
          let type;
          if (KEYWORDS.has(word)) type = 'keyword';
          else if (BUILTINS.has(word)) type = 'builtin';
          else if (after === '(') type = 'function';
          else type = 'plain';
          tokens.push({ type, value: word });
          i += word.length;
          continue;
        }
      }

      // Plain char
      tokens.push({ type: 'plain', value: ch });
      i++;
    }

    // Render tokens
    return tokens.map(t => {
      const v = escapeHtml(t.value);
      if (t.type === 'plain') return v;
      return `<span class="hl-${t.type}">${v}</span>`;
    }).join('');
  }

  const THEMES = {
    code: {
      icon: null,
      defaultTitle: 'Code',
      prompt: () => ''
    },
    ps: {
      icon: '>_',
      defaultTitle: 'PowerShell',
      prompt: (d) => `<span class="term-prompt-text">PS ${escapeHtml(d.path || 'C:\\Users\\')}&gt;</span> `
    },
    cmd: {
      icon: 'C:\\',
      defaultTitle: 'Command Prompt',
      prompt: (d) => `<span class="term-prompt-text">${escapeHtml(d.path || 'C:\\Windows\\System32')}&gt;</span> `
    },
    bash: {
      icon: '$_',
      defaultTitle: 'bash',
      prompt: (d) => `<span class="term-bash-user">${escapeHtml(d.user || 'user')}@${escapeHtml(d.host || 'host')}</span>:<span class="term-bash-path">${escapeHtml(d.path || '~')}</span>$ `
    },
    zsh: {
      icon: null,
      defaultTitle: 'zsh',
      prompt: (d) => `<span class="term-prompt-text">${escapeHtml(d.user || 'user')}@${escapeHtml(d.host || 'host')} ${escapeHtml(d.path || '~')} % </span>`
    },
    efishell: {
      icon: null,
      defaultTitle: 'EFI Shell',
      prompt: (d) => `<span class="term-prompt-text">${escapeHtml(d.path || 'Shell')}&gt;</span> `
    }
  };

  // Clipboard with fallback
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
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

    let leftContent = '';
    if (themeKey === 'zsh') {
      leftContent = `<div class="term-dots"><span class="term-dot term-dot--red"></span><span class="term-dot term-dot--yellow"></span><span class="term-dot term-dot--green"></span></div>`;
    } else if (cfg.icon) {
      leftContent = `<div class="term-icon">${escapeHtml(cfg.icon)}</div>`;
    }

    el.classList.add('terminal--' + themeKey);

    const contentHtml = (themeKey === 'code')
      ? highlightCode(cmdText)
      : escapeHtml(cmdText);

    el.innerHTML = `
      <div class="term-titlebar">
        <div class="term-tb-left">${leftContent}<span class="term-title"></span></div>
        <div class="term-tb-right"><button class="term-copy" type="button" title="Kopieren" aria-label="In Zwischenablage kopieren">${COPY_ICON}</button></div>
      </div>
      <div class="term-content"><span class="term-prompt">${cfg.prompt(el.dataset)}</span><span class="term-cmd"></span></div>
    `;

    // Safe title
    el.querySelector('.term-title').textContent = title;

    // Semantic <code>
    const cmdEl = el.querySelector('.term-cmd');
    if (themeKey === 'code') {
      cmdEl.innerHTML = `<code>${contentHtml}</code>`;
    } else {
      cmdEl.innerHTML = contentHtml;
    }

    const btn = el.querySelector('.term-copy');
    let resetTimer = null;

    btn.addEventListener('click', () => {
      copyToClipboard(cmdText).then(() => {
        clearTimeout(resetTimer);
        btn.classList.add('copied');
        btn.innerHTML = CHECK_ICON;
        btn.setAttribute('aria-label', 'Kopiert');
        resetTimer = setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = COPY_ICON;
          btn.setAttribute('aria-label', 'In Zwischenablage kopieren');
        }, 1500);
      }).catch((err) => {
        console.warn('Copy failed:', err);
        btn.title = 'Kopieren fehlgeschlagen';
      });
    });
  }

  const run = () => document.querySelectorAll('.terminal').forEach(init);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Public API
  window.TerminalSnippets = { init, refresh: run };
})();
