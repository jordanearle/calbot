# Calbot Installation Guide

This guide walks you through setting up Calbot, Birdie's prototyping assistant. By the end, you'll be able to spin up fully-configured prototype environments in seconds.

## What You'll Get

The installer sets up a complete prototyping environment:

- **Homebrew** — macOS package manager (used to install everything else)
- **Node.js** — JavaScript runtime that powers your prototypes
- **Git** — Version control (usually pre-installed on Mac)
- **VS Code** — Code editor (optional but recommended)
- **Claude Code** — AI assistant for building your prototypes
- **Calbot** — The CLI tool that ties it all together

If you already have some of these installed, the installer skips them automatically.

---

## Installation

### Step 1: Open Terminal

Press `Cmd + Space`, type "Terminal", and hit Enter.

### Step 2: Run the Installer

Copy and paste this command into Terminal and press Enter:

```bash
curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | sudo bash
```

You'll be prompted for your Mac password. This is normal — the installer needs permission to install software on your system. When you type your password, nothing will appear on screen (no dots or asterisks). Just type it and press Enter.

### Step 3: Wait for Installation

The installer shows progress as it works:

```
✓ Homebrew
✓ Node.js (v20.x.x)
✓ Git
✓ VS Code
✓ Claude Code
✓ Calbot
```

Items already on your system show "already installed" and are skipped.

### Step 4: Open a New Terminal Window

**Important:** After installation completes, open a fresh Terminal window (`Cmd + N`). This ensures your system recognizes the newly installed commands.

---

## Creating Your First Prototype

With installation complete, you're ready to create a prototype:

```bash
calbot new my-first-prototype
```

Replace `my-first-prototype` with whatever you want to call it (use dashes instead of spaces).

### What Happens Next

1. **Project creation** — Sets up a Next.js project with TypeScript and Tailwind CSS
2. **UI components** — Installs shadcn/ui (buttons, cards, inputs, etc.)
3. **Design system** — Applies Birdie's colors, typography, and tokens
4. **Layout** — Creates the standard Birdie navigation structure
5. **Dev server** — Starts automatically and opens in your browser
6. **Editor prompt** — Choose to open in VS Code, Cursor, or skip

Your prototype is now running at `http://localhost:3000` (or another port if 3000 is busy).

---

## Working With Your Prototype

### Project Location

All prototypes live in `~/Developer/calbot-projects/`. Each project is a standalone folder you can open in any editor.

### Using Claude Code

Navigate to your project and run Claude:

```bash
cd ~/Developer/calbot-projects/my-first-prototype
claude
```

Then describe what you want to build:
- "Add a form with name, email, and message fields"
- "Create a dashboard with three stat cards"
- "Build a table showing user data"

Claude reads the project's configuration and builds within Birdie's design system automatically.

### File Structure

```
my-prototype/
├── src/
│   ├── app/
│   │   ├── page.tsx        ← Edit this (your main page)
│   │   ├── layout.tsx      ← Don't edit (controls navigation)
│   │   └── globals.css     ← Design tokens (reference only)
│   └── components/
│       ├── layout/         ← Don't edit (TopNav, SideNav)
│       └── ui/             ← Don't edit (shadcn primitives)
├── CLAUDE.md               ← Instructions for Claude
└── context.md              ← Your prototype's context (fill this in)
```

### Hot Reload

The dev server watches for file changes. Save a file and your browser refreshes automatically — no need to restart anything.

---

## Managing Prototypes

Run `calbot` without arguments to see all your prototypes:

```bash
calbot
```

This shows a list of projects with options to open, run, or manage them.

---

## Common Issues

### "command not found: calbot"

You need to open a new Terminal window after installation. The current window doesn't know about newly installed commands.

If it still doesn't work, try running the installer again — it will skip already-installed components and re-link Calbot.

### "command not found: claude"

Claude Code may have failed to install. Run manually:

```bash
npm install -g @anthropic-ai/claude-code
```

If you get a permissions error, prefix with `sudo`:

```bash
sudo npm install -g @anthropic-ai/claude-code
```

### Installation hangs at "Installing Homebrew"

Homebrew installation can take a few minutes on first run. It's downloading and compiling tools. If it's been more than 10 minutes, press `Ctrl + C` and try again.

### Project creation fails partway through

Usually a network issue. Check your internet connection and run the same `calbot new` command again. If a partial project was created, delete it first:

```bash
rm -rf ~/Developer/calbot-projects/my-prototype
calbot new my-prototype
```

### Port already in use

If you see an error about port 3000, another app is using it. Calbot automatically finds the next available port, but if issues persist:

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace PID with the actual number)
kill -9 PID
```

### Editor doesn't open

If VS Code or Cursor fails to launch, you can open them manually and navigate to your project folder at `~/Developer/calbot-projects/your-project`.

For VS Code, ensure the `code` command is installed: open VS Code, press `Cmd + Shift + P`, type "Shell Command", and select "Install 'code' command in PATH".

### "Permission denied" errors

If you see permission errors during installation:

```bash
# Re-run with sudo
curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | sudo bash
```

### Prototype shows blank page or errors

Check the Terminal where the dev server is running for error messages. Common fixes:

1. Stop the server (`Ctrl + C`) and restart: `npm run dev`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check for syntax errors in files you've edited

---

## FAQ

**Q: Do I need to know how to code?**

Not really. Calbot sets everything up, and Claude Code does the actual coding. You describe what you want in plain English. That said, understanding basic concepts helps you communicate more precisely.

**Q: Can I use Cursor instead of VS Code?**

Yes. When a prototype is created, you're asked which editor to open. Both work identically.

**Q: How do I stop the dev server?**

Press `Ctrl + C` in the Terminal window where it's running. To restart: `npm run dev` from the project folder.

**Q: Can I delete a prototype?**

Yes, just delete its folder:

```bash
rm -rf ~/Developer/calbot-projects/prototype-name
```

**Q: Where does Calbot itself live?**

The Calbot CLI is installed at `~/.calbot-cli/`. You shouldn't need to touch this.

**Q: How do I update Calbot?**

Run the installer again. It pulls the latest version:

```bash
curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | sudo bash
```

**Q: Can I run multiple prototypes at once?**

Yes. Each prototype runs on its own port. The first uses 3000, the next 3001, and so on.

**Q: What if I want to add more UI components?**

From your project folder, use shadcn's CLI:

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
```

See all available components at [ui.shadcn.com](https://ui.shadcn.com).

---

## Getting Help

If you're stuck:

1. Check the Terminal output for error messages
2. Try the troubleshooting steps above
3. Run `calbot` to see available commands
4. Ask Claude Code for help — it understands the project structure

---

Happy prototyping! 🐦
