# Getting Started with Calbot

Calbot is your friendly prototyping assistant. In a few seconds, it spins up a fully designed prototype environment — pre-loaded with Birdie's design system, components, and styles — so you can jump straight into building, not configuring.

---

## Before You Begin

You only need to do this once. Calbot's installer handles everything automatically, including tools you may not have heard of (Node.js, Homebrew, etc.).

### Step 1 — Run the installer

Open **Terminal** (press `Cmd + Space`, type "Terminal", press Enter), then paste this command and press Enter:

```
curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | bash
```

The installer will walk you through a setup wizard. It may ask for your Mac password at certain steps — that's normal.

> **This takes a few minutes.** Grab a coffee.

### Step 2 — Open a new Terminal window

Once the installer finishes, **close your Terminal window and open a new one**. This is required for the `calbot` command to become available.

### Step 3 — Verify it worked

In your new Terminal window, type:

```
calbot hello
```

If Cal says hello back, you're all set.

---

## Creating Your First Prototype

### Using the Dashboard (recommended)

Run this command in Terminal:

```
calbot
```

This opens the Calbot dashboard in your browser at `http://localhost:4321`. From here you can:

- **Create a new prototype** — click "New Prototype", give it a name, and watch it build in real time
- **Start or stop** a prototype's dev server
- **Open a prototype** in your code editor (Cursor or VS Code)
- **Duplicate** an existing prototype to use as a starting point
- **Delete** prototypes you no longer need

### Using the Terminal (alternative)

If you prefer to skip the dashboard, you can create a prototype directly from Terminal:

```
calbot new my-expense-tracker
```

Replace `my-expense-tracker` with whatever you want to call your prototype. Use lowercase letters and dashes — no spaces.

Calbot will:
1. Create a new Next.js project
2. Install Birdie's design system and components
3. Set up navigation (top bar + side nav)
4. Start a dev server
5. Open the prototype in your browser automatically

---

## What You Get

Every prototype comes ready to use with:

| What | Details |
|------|---------|
| Birdie design tokens | Brand colours, typography, spacing — all pre-configured |
| shadcn/ui components | Buttons, cards, inputs, avatars, and more |
| Navigation | A top nav and side nav styled to match Birdie |
| Claude Code | An AI coding assistant wired up and ready to help |

Your prototypes are saved to `~/Developer/calbot-projects/` on your Mac.

---

## Day-to-Day Usage

### Starting a prototype you've already built

Open the dashboard:

```
calbot
```

Find your prototype in the list and click **Start**. Once it's running, click the URL to open it in your browser.

### Checking what prototypes you have

```
calbot status
```

This shows a list of all your prototypes and whether their dev servers are currently running.

### Getting a fresh start from an existing prototype

Use **Duplicate** in the dashboard to copy an existing prototype. This is handy when you want to try a different direction without losing your original.

---

## Updating Calbot

To get the latest version of Calbot:

```
calbot update
```

---

## Common Questions

**Do I need to know how to code to use Calbot?**
Not to get started. Calbot sets everything up for you, and the prototypes are designed to be used with Claude Code (an AI assistant) that can make changes based on plain-English instructions.

**Where are my prototypes saved?**
All prototypes live in the `calbot-projects` folder in your `Developer` directory (`~/Developer/calbot-projects/`).

**The `calbot` command isn't found after installing.**
Make sure you opened a **new** Terminal window after the installer finished.

**Something looks broken / the dashboard won't load.**
Try closing Terminal, opening a new window, and running `calbot` again. If the problem persists, run `calbot wizard` to re-run the setup check.

**How do I re-run the setup wizard?**
```
calbot wizard
```

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `calbot` | Open the dashboard |
| `calbot new <name>` | Create a new prototype |
| `calbot status` | List all prototypes and their status |
| `calbot update` | Update Calbot to the latest version |
| `calbot wizard` | Re-run the environment setup wizard |
| `calbot hello` | Check that Calbot is installed correctly |
