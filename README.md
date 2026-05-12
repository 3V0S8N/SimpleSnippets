# Simple Snippets

Nice-looking terminal code blocks for your docs, blog, or next project — without dragging in 100 MB of dependencies.

[**Live Demo**](https://3v0s8n.github.io/simplesnippets/demo.html) · [**Snippet Builder**](https://3v0s8n.github.io/simplesnippets/builder.html)

- **No dependencies.** No React, no build step, no `npm install`.
- **Tiny.** ~8 KB minified (CSS + JS combined).
- **Convenient.** Auto-trims indentation, copy button built in.

---

## Why?

I just wanted to show terminal and code snippets without pulling in a 500 KB highlighter framework. Most libraries are either huge or expect you to restructure half your project. This one is two files. Drop in a `<div>`, get a terminal. That's it.

## Quick Start

**1. Grab the files**
Download `simplesnippets.min.css` and `simplesnippets.min.js` and drop them into your project.

**2. Link them**

```html
<link rel="stylesheet" href="simplesnippets.min.css">
<script src="simplesnippets.min.js" defer></script>
```

**3. Write a snippet**
A `div` with the `terminal` class — the rest happens automatically once the page loads.

```html
<div class="terminal" data-theme="bash" data-user="me" data-host="localhost" data-path="~">
  ls -la
</div>
```

---

## Themes

| Theme      | Good for …                                       |
| :--------- | :----------------------------------------------- |
| `code`     | General code with syntax highlighting            |
| `bash`     | Linux/macOS shell                                |
| `zsh`      | macOS window with the three traffic-light dots   |
| `cmd`      | Classic Windows Command Prompt                   |
| `ps`       | Windows PowerShell                               |
| `efishell` | EFI Shell                                        |

### Configuration

Everything works through `data-*` attributes:

| Attribute    | What it does                                          |
| :----------- | :---------------------------------------------------- |
| `data-theme` | Which theme to use (required).                        |
| `data-title` | Text in the title bar.                                |
| `data-user`  | Username (Bash/ZSH).                                  |
| `data-host`  | Hostname (Bash/ZSH).                                  |
| `data-path`  | Working directory shown in the prompt.                |

---

## Tips

### Visual Builder
The repo includes `builder.html`. Open it in your browser, click your snippet together, and copy the generated HTML. Saves you from typing attributes by hand.

### Dynamic content (SPAs)
If you're loading snippets after the initial render — React, Vue, fetch, whatever — there's a small API:

```js
// Initialize a specific element
TerminalSnippets.init(element);

// Re-scan the whole page
TerminalSnippets.refresh();
```

### Built-in syntax highlighting
The `code` theme ships with a tiny tokenizer — strings, numbers, comments, a handful of common keywords. Good enough for most examples without having to pull in Prism.js or Highlight.js.

---

## License

**MIT.** Use it however you want. A shout-out is appreciated, but honestly, I don't give a fuck.
