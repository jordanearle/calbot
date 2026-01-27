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

Cal is Birdie's friendly prototyping assistant! It helps PMs and designers quickly spin up prototype environments with Next.js, Tailwind, and shadcn/ui - all pre-configured with Birdie's design system.

## Quick Start

### First-time Setup (run once)

Open Terminal and run:

```bash
/bin/bash /Users/jordan/Developer/calbot/install.sh
```

This will:
- Create your `~/Developer` folder
- Install Homebrew (if needed)
- Install Node.js (if needed)
- Install VS Code (if needed)
- Install Claude Code
- Set up Calbot

### Creating a New Prototype

Once set up, create a new prototype anytime with:

```bash
calbot new my-awesome-idea
```

This will:
- Create a new Next.js project with TypeScript & Tailwind
- Install and configure shadcn/ui components
- Add Birdie's design tokens and color system
- Set up the standard Birdie layout (top nav + side nav)
- Offer to open the project in VS Code or Cursor (or skip)
- Start the dev server and open your browser

## Commands

| Command | Description |
|---------|-------------|
| `calbot wizard` | Set up your development environment |
| `calbot new <name>` | Create a new Birdie prototype |
| `calbot hello` | Say hello to Cal! |

## Demo Script

For the demo tomorrow, here's the suggested flow:

### 1. Show the Install Script (already done for demo)
```bash
# We've already run this, but show them it exists
cat /Users/jordan/Developer/calbot/install.sh | head -50
```

### 2. Create a New Prototype
```bash
calbot new expense-tracker
```

### 3. Show the Running App
- The browser will open automatically
- Show the Birdie layout (top nav, side nav)
- Show the starter page with tips

### 4. Use Claude Code to Build Features
```bash
cd ~/Developer/expense-tracker
claude
```

Then ask Claude to:
- "Add a form to submit expenses with amount, category, and description"
- "Create a table showing recent expenses"
- "Add a chart showing expenses by category"

## Project Structure

When you create a new project, it includes:

```
my-prototype/
├── src/
│   ├── app/
│   │   ├── globals.css      # Birdie design tokens
│   │   ├── layout.tsx       # Main layout with nav
│   │   └── page.tsx         # Starter page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx   # Birdie top navigation
│   │   │   └── SideNav.tsx  # Birdie side navigation
│   │   └── ui/              # shadcn components
│   └── lib/
│       └── utils.ts         # Utility functions
├── tailwind.config.ts       # Tailwind + Birdie colors
└── components.json          # shadcn/ui config
```

## Birdie Design System

The prototype includes Birdie's design tokens:

### Colors
- **Primary**: `#54BDB8` (Cal's teal)
- **Nav Background**: `rgb(21, 41, 81)` (dark blue)
- **Status Colors**: Green, Blue, Yellow, Red, Purple, Orange
- **Neutral Palette**: Full range for UI elements

### Typography
- Font: Inter
- Sizes from 12px to 36px with various weights

### Layout
- **Top Nav**: 60px height, dark blue background
- **Side Nav**: 260px width, light gray background
- **Content Area**: White background, 24px padding

## Troubleshooting

### "command not found: calbot"
Open a new terminal window after running the install script.

### Project creation fails
Make sure you have a stable internet connection. The first project takes longer as it downloads Next.js and dependencies.

### Editor doesn't open
If VS Code or Cursor doesn't open (or you skip), you can manually open your editor and navigate to `~/Developer/your-project`.

---

Made with love by Cal (•ᴗ•)
