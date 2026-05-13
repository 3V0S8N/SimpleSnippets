<div align="center">

# Simple Snippets

**Tiny terminal-style code blocks.** No React, no build step, no `npm install` — two files and a `<div>`.

[**Live Demo**](https://3v0s8n.github.io/simplesnippets/demo.html) · [**Snippet Builder**](https://3v0s8n.github.io/simplesnippets/builder.html) · [License](#license)

![Size](https://img.shields.io/badge/min%20size-%3C9%20KB-blue?style=flat-square)
![Deps](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

</div>

---

## ✨ Why?

Most syntax-highlighting libraries are either 500 KB or expect you to restructure half your project. Simple Snippets is two files. Drop in a `<div>`, get a terminal block. That's the whole product.

- 🪶 **Tiny** — ~9 KB minified (CSS + JS combined)
- 🚫 **Zero dependencies** — no framework, no bundler
- ⚙️ **Convenient** — auto-dedents content, copy button included
- 🎨 **6 themes** — Code, Bash, ZSH, CMD, PowerShell, EFI Shell
- ☀️ **Light mode** — the `code` theme auto-adapts to your page's light/dark setting

---

## 🚀 Quick Start

**1. Grab the files**

```
simplesnippets.min.css
simplesnippets.min.js
```

**2. Link them**

```html
<link rel="stylesheet" href="simplesnippets.min.css">
<script src="simplesnippets.min.js" defer></script>
```

**3. Write a snippet**

A `<div class="terminal">` is all you need — the rest is configured via `data-*` attributes.

```html
<div class="terminal" data-theme="bash" data-user="me" data-host="localhost" data-path="~">
  ls -la
</div>
```

---

## 🎨 Themes

| Theme      | Use case                                           |
| :--------- | :------------------------------------------------- |
| `code`     | General source code with syntax highlighting       |
| `bash`     | Linux/macOS shell sessions                         |
| `zsh`      | macOS window with the three traffic-light dots     |
| `cmd`      | Classic Windows Command Prompt                     |
| `ps`       | Windows PowerShell                                 |
| `efishell` | EFI / UEFI shell                                   |

### ☀️ Light variant (`code` only)

The `code` theme has both a dark and a light palette (Atom One Light). It picks automatically:

- **Auto:** if your page declares `<html data-bs-theme="light">` (Bootstrap 5 convention)
- **Manual:** add `class="terminal--light"` to force light regardless of page theme

```html
<!-- Always light -->
<div class="terminal terminal--light" data-theme="code" data-title="config.json">
  { "version": "1.0.0" }
</div>
```

### Configuration

Everything works through `data-*` attributes:

| Attribute    | What it does                              |
| :----------- | :---------------------------------------- |
| `data-theme` | Which theme to use (required)             |
| `data-title` | Text in the title bar                     |
| `data-user`  | Username (Bash / ZSH)                     |
| `data-host`  | Hostname (Bash / ZSH)                     |
| `data-path`  | Working directory shown in the prompt     |

---

## 🛠️ Tips

### Visual Builder
The repo ships with `builder.html`. Open it, click your snippet together, copy the generated HTML — no attribute typing required.

### Dynamic content (SPAs, fetch, etc.)
Snippets are auto-initialised on `DOMContentLoaded`. For content loaded later, there's a small API:

```js
TerminalSnippets.init(element);  // initialise one element
TerminalSnippets.refresh();      // re-scan the whole page
```

### Built-in syntax highlighting
The `code` theme ships with a small tokenizer — strings, numbers, comments, common keywords (`import`, `const`, `function`, `return`, …). Enough for most examples without pulling in Prism.js or Highlight.js. Theme colours follow the Atom One palette and are exposed as CSS custom properties (`--hl-keyword`, `--hl-string`, …) — override them to taste.

---

## 📄 License

**MIT.** Use it however you want. A shout-out is appreciated but absolutely not required.
