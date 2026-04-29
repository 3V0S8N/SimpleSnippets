# Simple Snippets

**No-nonsense code blocks for your terminal-style snippets.**

Stop shipping 100MB of dependencies just to draw a fancy box around `ls -la`. **Simple Snippets** gives you beautiful, terminal-inspired code blocks for your docs, blog, or project pages with zero overhead.

[**Live Demo**](https://3v0s8n.github.io/simplesnippets/demo.html) | [**Snippet Builder**](https://3v0s8n.github.io/simplesnippets/builder.html)

* **Zero Dependencies:** No React, no build steps, no `npm install`.
* **Featherweight:** Just ~12 KB of vanilla JS and CSS.
* **Smart:** Auto-trims indentation and includes a built-in copy button.

---

## Why this exists

I wanted a simple way to display terminal commands and code snippets without the bloat. Most existing libraries are massive or require complex frameworks. This project is just two files. Add a `<div>`, get a nicely styled terminal. That’s it.

## Quick Start

### 1. Grab the files
Download `simplesnippets.css` and `simplesnippets.js` and add them to your project. 

### 2. Link them in your HTML
    <link rel="stylesheet" href="simplesnippets.css">
    <script src="simplesnippets.js" defer></script>

### 3. Add your snippet
Just use a `div` with the `terminal` class. The script handles the rest automatically once the page loads.

    <div class="terminal" data-theme="bash" data-user="me" data-host="localhost" data-path="~">
      ls -la
    </div>

---

## Themes & Customization

Pick the look that fits your environment. See all of them in action in the [**Demo**](#link-to-demo).

| Theme | Best for... | Default Title |
| :--- | :--- | :--- |
| `code` | General code with syntax highlighting | `Code` |
| `bash` | Linux/macOS shell style | `bash` |
| `zsh` | macOS window with traffic light buttons | `zsh` |
| `cmd` | Classic Windows Command Prompt | `Command Prompt` |
| `ps` | Modern Windows PowerShell | `PowerShell` |

### Configuration
You can customize the prompt and behavior using `data-*` attributes:

* `data-theme`: The visual style (required).
* `data-title`: Change the text in the title bar.
* `data-user` / `data-host`: Set the username and hostname (Bash/ZSH).
* `data-path`: Set the working directory path.

---

## Pro Tips

### Visual Builder
The repo includes `builder.html`. Open it in your browser to pick a theme, fill in your details, and copy the generated HTML instantly. 

### Dynamic Content (SPAs)
If you're using a framework or loading content dynamically, use the global API to refresh your snippets:

    // Initialize a specific element
    TerminalSnippets.init(element);

    // Re-scan the whole page for new snippets
    TerminalSnippets.refresh();

### Minimal Syntax Highlighting
The `code` theme includes a tiny, built-in tokenizer. It handles strings, numbers, comments, and common keywords. It’s perfect for quick examples without needing a heavy library like Prism.js.

---

## License
**MIT.** Use it however you like. Attribution is appreciated, but honestly, I dont give a fuck.
