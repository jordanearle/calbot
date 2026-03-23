# Calbot

```
      _...._
    /       \
   /  o _ o
   (    \/  )            ▗▄▄▖ ▗▄▖ ▗▖   ▗▄▄▖  ▗▄▖▗▄▄▄▖
  )          (           ▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌ █
(    -  -  -  )          ▐▌   ▐▛▀▜▌▐▌   ▐▛▀▚▖▐▌ ▐▌ █
(             )          ▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▐▙▄▞▘▝▚▄▞▘ █
 (            )
  [          ]
---/l\    /l\--------    Birdie's friendly prototyping assistant
  ----------------
     (  )
    ( __ _)
```

Cal is Birdie's friendly prototyping assistant. It helps PMs and designers quickly spin up Next.js prototype environments — pre-configured with Birdie's design system, shadcn/ui components, Tailwind, and TypeScript.

---

## Installation

Run this in Terminal (one-time setup):

```bash
curl -fsSL https://raw.githubusercontent.com/jordanearle/calbot/main/install.sh | bash
```

This installs:
- Homebrew (if needed)
- Node.js via NVM (if needed)
- Cursor editor (if needed)
- Calbot itself (cloned to `~/.calbot-cli` and linked globally)

After installing, **open a new terminal window** so `calbot` is available.

---

## Usage

### Dashboard (recommended)

```bash
calbot
```

Opens the web dashboard at `http://localhost:4321`. From here you can:
- Create new prototypes (with live progress tracking)
- Start / stop dev servers
- Open prototypes in Cursor or VS Code
- Delete prototypes
- See which prototypes are currently running

### Create a prototype from the terminal

```bash
calbot new my-expense-tracker
```

Names are auto-sanitised to lowercase + dashes. This sets up a full Next.js + shadcn/ui project in `~/Developer/my-expense-tracker`, then opens it in your browser.

---

## All Commands

| Command | Description |
|---------|-------------|
| `calbot` | Open the web dashboard |
| `calbot new <name>` | Create a new prototype directly from the terminal |
| `calbot tui` | Open the terminal UI (alternative to the dashboard) |
| `calbot dashboard` | Open the dashboard (explicit form of the default command) |
| `calbot status` | Show dashboard status and list of prototypes |
| `calbot update` | Update calbot to the latest version |
| `calbot wizard` | Re-run the environment setup wizard |
| `calbot hello` | Say hello to Cal |

---

## Updating

```bash
calbot update
```

Pulls the latest changes from GitHub, rebuilds, and relinks. Cal will let you know if you're already up to date.

---

## What gets created

Each `calbot new` project produces a Next.js app at `~/Developer/<name>`:

```
my-prototype/
├── src/
│   ├── app/
│   │   ├── globals.css        # Birdie design tokens
│   │   ├── layout.tsx         # Root layout with nav
│   │   └── page.tsx           # Starter page with tips
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx     # Birdie top navigation
│   │   │   └── SideNav.tsx    # Birdie side navigation
│   │   └── ui/                # shadcn/ui components
│   └── lib/
│       └── utils.ts
├── tailwind.config.ts         # Tailwind + Birdie colour tokens
└── components.json            # shadcn config
```

### Included Birdie design tokens

- **Primary green**: `#006643`
- **Teal**: `#54BDB8`
- **Nav background**: `rgb(21, 41, 81)` (dark blue)
- **Full neutral palette** and status colours (green, blue, yellow, red, purple, orange)
- **Font**: Inter, sizes 12px–36px

### Pinned dependency versions

To keep prototypes stable and reproducible, calbot pins:
- `create-next-app@16.2.1`
- `shadcn@4.1.0`

These are intentionally not `@latest` — bump them only after testing.

---

## Architecture

```
calbot/
├── src/
│   ├── cli.tsx                # Commander entrypoint, command definitions
│   ├── commands/
│   │   ├── new.ts             # Ink UI for `calbot new`
│   │   ├── home.ts            # Ink home screen
│   │   ├── wizard.ts          # Environment setup wizard
│   │   ├── dashboard.ts       # Launches dashboard server
│   │   ├── status.ts          # Terminal status output
│   │   └── update.ts          # Self-update via git pull + rebuild
│   ├── dashboard/
│   │   ├── server.ts          # Express server (API + static HTML)
│   │   └── ui.ts              # Single-file dashboard HTML/CSS/JS
│   ├── components/            # Ink React components (Cal face, intro, etc.)
│   └── utils/
│       ├── shell.ts           # Project discovery, shell helpers
│       └── running.ts         # Detect running dev servers via PID files
├── dist/                      # Compiled output (gitignored)
├── install.sh                 # Remote install script
└── package.json
```

The dashboard is a single-page app served inline from `ui.ts` — no build step, no separate frontend. The Express server handles:
- `GET /api/state` — list of projects + running status
- `POST /api/projects` — create a new prototype (streams progress via `/api/progress/:name`)
- `GET /api/progress/:name` — poll creation progress (frontend polls every 600ms)
- `POST /api/projects/:name/start` — start dev server
- `POST /api/projects/:name/stop` — stop dev server
- `POST /api/projects/:name/open-editor` — open in Cursor or VS Code
- `DELETE /api/projects/:name` — delete prototype

---

## Troubleshooting

**"command not found: calbot"**
Open a new terminal window after installing, or run `source ~/.zshrc` (or `~/.bashrc` / `~/.config/fish/config.fish`).

**Dashboard won't open / port 4321 in use**
Running `calbot` again will detect the existing instance and open a browser tab to it.

**Project creation fails**
Requires a stable internet connection. The first project takes longer (downloads Next.js + dependencies, ~200MB).

**Editor doesn't open automatically**
Calbot tries Cursor first, then VS Code. If neither is installed it skips silently. Open your editor manually and navigate to `~/Developer/<name>`.

**Prototype list is empty after creating projects**
Projects live in `~/Developer`. Calbot scans for directories containing a `package.json` with a `dev` script. If you've moved a project, it won't appear.

---

Made with (•ᴗ•) by Cal
