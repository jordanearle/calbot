// Birdie Design System Templates

export function getBirdieGlobalsCss(): string {
  return `@import "tailwindcss";

/* =========================================
   TAILWIND V4 THEME
   Maps Tailwind utilities to CSS variables
   so dark mode overrides work at runtime
   ========================================= */
@theme inline {
  /* Semantic tokens → Tailwind utilities */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Birdie primitive utilities */
  --color-birdie-nav: rgb(21, 41, 81);
  --color-background-2: var(--background-background-2);
  --color-neutral-bg: var(--neutral-bg);
  --color-neutral-border: var(--neutral-border);
  --color-neutral-text: var(--neutral-text);
  --color-neutral-text-dark: var(--neutral-text-dark);
  --color-green-bg: var(--green-bg);
  --color-green-border: var(--green-border);
  --color-green-high-contrast: var(--green-high-contrast);
  --color-green-text-dark: var(--green-text-dark);
  --color-blue-bg: var(--blue-bg);
  --color-blue-border: var(--blue-border);
  --color-blue-high-contrast: var(--blue-high-contrast);
  --color-blue-text-dark: var(--blue-text-dark);
  --color-red-bg: var(--red-bg);
  --color-red-border: var(--red-border);
  --color-red-high-contrast: var(--red-high-contrast);
  --color-red-text-dark: var(--red-text-dark);
  --color-yellow-bg: var(--yellow-bg);
  --color-yellow-border: var(--yellow-border);
  --color-yellow-high-contrast: var(--yellow-high-contrast);
  --color-yellow-text-dark: var(--yellow-text-dark);
  --color-purple-high-contrast: var(--purple-high-contrast);
  --color-orange-high-contrast: var(--orange-high-contrast);
  --color-cyan-high-contrast: var(--cyan-high-contrast);

  /* Radius */
  --radius-lg: var(--radius);
  --radius-md: var(--radius-md);
  --radius-sm: var(--radius-sm);

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

/* =========================================
   PRIMITIVE COLOR TOKENS
   ========================================= */
:root {
  /* Backgrounds */
  --background-background-1: #ffffff;
  --background-background-2: #f3f4f7;

  /* Neutrals */
  --neutral-bg: #e3e7ed;
  --neutral-bg-hover: #dadee7;
  --neutral-bg-active: #cdd3df;
  --neutral-border: #c5c9d3;
  --neutral-border-hover: #a8abbd;
  --neutral-border-active: #999db2;
  --neutral-high-contrast: #575c6b;
  --neutral-high-contrast-hover: #454954;
  --neutral-text: #606876;
  --neutral-text-dark: #151619;
  --neutral-white: #ffffff;

  /* Green (Primary/Brand) */
  --green-bg: #e6f7ef;
  --green-bg-hover: #d6f1e3;
  --green-bg-active: #c3e9d7;
  --green-border: #acdec8;
  --green-border-hover: #8bceb2;
  --green-border-active: #56ba90;
  --green-high-contrast: #006643;
  --green-high-contrast-hover: #044e35;
  --green-text-muted: #034f35;
  --green-text-dark: #072c1e;

  /* Blue (Info / Focus) */
  --blue-bg: #ebf3ff;
  --blue-bg-hover: #dbe9ff;
  --blue-bg-active: #ccddff;
  --blue-border: #c1d6ff;
  --blue-border-hover: #abc5f9;
  --blue-border-active: #8daeef;
  --blue-high-contrast: #1847a5;
  --blue-high-contrast-hover: #143371;
  --blue-text-muted: #1345aa;
  --blue-text-dark: #0f2757;

  /* Red (Destructive) */
  --red-bg: #feecef;
  --red-bg-hover: #ffdce2;
  --red-bg-active: #ffc7cd;
  --red-border: #ffced6;
  --red-border-hover: #f9bec6;
  --red-border-active: #f2a6ae;
  --red-high-contrast: #c20a1d;
  --red-high-contrast-hover: #a20615;
  --red-text: #8f1518;
  --red-text-dark: #811316;

  /* Yellow (Warning) */
  --yellow-bg: #fff0d1;
  --yellow-bg-hover: #ffe8bd;
  --yellow-bg-active: #ffe1a8;
  --yellow-border: #f0ce99;
  --yellow-border-hover: #ecbe79;
  --yellow-border-active: #e7ad56;
  --yellow-high-contrast: #a35f00;
  --yellow-high-contrast-hover: #804a00;
  --yellow-text: #703800;
  --yellow-text-dark: #3d1f00;

  /* Other Accents */
  --purple-high-contrast: #9724a8;
  --orange-high-contrast: #d14715;
  --lime-high-contrast: #5d7e1b;
  --pink-high-contrast: #d31763;
  --cyan-high-contrast: #008099;

  /* Radius */
  --radius: 0.625rem;
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);

  /* Shadows */
  --shadow-sm: 0 0 2px #0000000d;
  --shadow-base: 0 0 2px #0000000f, 0 0 3px #0000001a;
  --shadow-md: 0 0 4px #0000000f, 0 0 6px #0000001a;
  --shadow-lg: 0 0 6px #0000000d, 0 0 15px #0000001a;
  --shadow-xl: 0 0 10px #0000000a, 0 0 25px #0000001a;
}

/* =========================================
   SEMANTIC THEME MAPPING — LIGHT
   ========================================= */
:root {
  --background: var(--background-background-1);
  --foreground: var(--neutral-text-dark);

  --card: var(--background-background-1);
  --card-foreground: var(--neutral-text-dark);

  --popover: var(--background-background-1);
  --popover-foreground: var(--neutral-text-dark);

  --primary: var(--green-high-contrast);
  --primary-foreground: var(--neutral-white);

  --secondary: var(--background-background-2);
  --secondary-foreground: var(--neutral-text-dark);

  --muted: var(--neutral-bg);
  --muted-foreground: var(--neutral-text);

  --accent: var(--background-background-2);
  --accent-foreground: var(--neutral-text-dark);

  --destructive: var(--red-high-contrast);
  --destructive-foreground: var(--neutral-white);

  --border: var(--neutral-border);
  --input: var(--neutral-border);
  --ring: var(--blue-border-active);
}

/* =========================================
   SEMANTIC THEME MAPPING — DARK
   ========================================= */
.dark {
  --background: var(--neutral-text-dark);
  --foreground: var(--neutral-white);

  --card: var(--neutral-high-contrast);
  --card-foreground: var(--neutral-white);

  --popover: var(--neutral-high-contrast);
  --popover-foreground: var(--neutral-white);

  --primary: var(--blue-bg);
  --primary-foreground: var(--blue-high-contrast);

  --secondary: var(--neutral-high-contrast);
  --secondary-foreground: var(--neutral-white);

  --muted: var(--neutral-high-contrast);
  --muted-foreground: var(--neutral-bg);

  --accent: var(--neutral-high-contrast);
  --accent-foreground: var(--neutral-white);

  --destructive: var(--red-text);
  --destructive-foreground: var(--neutral-white);

  --border: var(--neutral-border-hover);
  --input: var(--neutral-border-hover);
  --ring: var(--blue-border-active);
}

/* =========================================
   BASE STYLES
   ========================================= */
* {
  border-color: var(--neutral-border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* =========================================
   BIRDIE LAYOUT
   ========================================= */
.birdie-top-nav {
  background-color: rgb(21, 41, 81);
  height: 60px;
}

.birdie-side-nav {
  width: 260px;
  background-color: var(--background-background-2);
  border-right: 1px solid var(--neutral-border);
}

.birdie-content {
  background-color: var(--background);
}

/* =========================================
   ANIMATION UTILITIES
   Custom easing curves for polish
   ========================================= */
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}
`;
}

export function getBirdieTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [],
} satisfies Config;
`;
}

export function getBirdieLayoutTsx(): string {
  return `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { SideNav } from "@/components/layout/SideNav";
import { Agentation } from "agentation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Birdie Prototype",
  description: "Built with Calbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <TopNav />
          <div className="flex flex-1 overflow-hidden">
            <SideNav />
            <main className="flex-1 overflow-auto birdie-content p-6">
              {children}
            </main>
          </div>
        </div>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
`;
}

export function getBirdiePageTsx(projectName: string): string {
  return `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Welcome to ${projectName}
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep this preview open, run{" "}
          <code className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono">
            claude
          </code>{" "}
          in this project folder, and talk through what needs to change.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start prompting with Claude</CardTitle>
          <CardDescription>
            Describe the user moment, the problem, and the outcome you want.
            Claude will edit this codebase instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Open a terminal in this project folder and run <code className="px-1 py-0.5 bg-muted rounded font-mono text-foreground">claude</code>.</p>
            <p>2. Paste any context or screenshots you already have.</p>
            <p>3. Type your instruction in plain language and watch hot reload.</p>
          </div>

          <div className="rounded-[var(--radius)] bg-green-bg border border-green-border p-4 text-sm text-green-text-dark">
            <p className="font-medium mb-1">Try prompts like:</p>
            <ul className="space-y-1 list-disc list-inside text-green-text-dark/80">
              <li>"Show a progress summary for caregiver onboarding with clear next steps"</li>
              <li>"Add a data table showing recent care visits with status badges"</li>
              <li>"Rewrite the empty state to reassure caregivers we're pulling new data"</li>
            </ul>
          </div>

          <Button variant="secondary" className="w-full" disabled>
            Already running — just open Claude and start prompting
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
`;
}

export function getBirdieNavComponents(): { topNav: string; sideNav: string } {
  return {
    topNav: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";

export function TopNav() {
  return (
    <header className="birdie-top-nav flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" fill="#54BDB8" />
            <circle cx="12" cy="13" r="2" fill="white" />
            <circle cx="20" cy="13" r="2" fill="white" />
            <path
              d="M14 18 L16 21 L18 18"
              stroke="#F19800"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-white font-semibold text-lg">Birdie</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-white/70 hover:text-white transition-colors duration-150">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors duration-150 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            PM
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
`,
    sideNav: `"use client";

import { Home, Settings, Users, FileText, BarChart3, Folder } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/projects", icon: Folder, label: "Projects" },
  { href: "/team", icon: Users, label: "Team" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function labelFromPath(path: string) {
  if (!path || path === "/") return "Home";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return clean
    .split("/")
    .map((s) => s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
    .join(" / ");
}

export function SideNav() {
  const pathname = usePathname();
  const currentItem =
    navItems.find((item) => item.href === pathname) ?? {
      href: pathname || "/",
      icon: Home,
      label: labelFromPath(pathname || "/"),
    };

  return (
    <aside className="birdie-side-nav flex flex-col py-4">
      <nav className="flex-1 px-3 space-y-1">
        <Link
          href={currentItem.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium",
            "transition-colors duration-150",
            "bg-green-bg text-green-high-contrast"
          )}
        >
          <currentItem.icon className="w-4 h-4" />
          {currentItem.label}
        </Link>
      </nav>

      <div className="px-3 mt-auto">
        <div className="p-3 rounded-[var(--radius)] bg-muted border border-border">
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-primary font-medium">Calbot</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
`,
  };
}

export function getClaudeMd(): string {
  return `# Calbot Prototype — Claude Instructions

This is a Next.js prototype using the **Birdie Design System**. The dev server is already running.

---

## What to Edit

**DO edit:**
- \`src/app/page.tsx\` — main page content
- \`src/app/*/page.tsx\` — any route pages you create
- \`src/components/\` — your own components (not the locked ones below)

**DO NOT edit:**
- \`src/components/layout/TopNav.tsx\` — locked nav
- \`src/components/layout/SideNav.tsx\` — locked nav
- \`src/app/layout.tsx\` — root layout
- \`src/components/ui/*\` — shadcn/ui primitives
- \`src/app/globals.css\` — design tokens (reference only)

---

## Component Rules

**Always use shadcn/ui components** — never build a custom button, input, card, badge, dialog, etc. from scratch.

Pre-installed: \`Button\`, \`Card\`, \`Input\`, \`Avatar\`

Add more with:
\`\`\`bash
npx shadcn@latest add <component-name>
\`\`\`

Common ones: \`badge\`, \`dialog\`, \`select\`, \`table\`, \`tabs\`, \`tooltip\`, \`dropdown-menu\`, \`sheet\`

You also have the **shadcn MCP server** available — use it to browse and add components directly.

---

## Design System — Color Rules

**Never hardcode hex values.** Always use semantic Tailwind classes that reference CSS variables.

### Semantic tokens (use these first)
| Class | Use |
|-------|-----|
| \`bg-background\` / \`text-foreground\` | Page background and body text |
| \`bg-card\` / \`text-card-foreground\` | Card surfaces |
| \`bg-primary\` / \`text-primary-foreground\` | Primary actions (Birdie green #006643) |
| \`bg-secondary\` / \`text-secondary-foreground\` | Subtle backgrounds |
| \`bg-muted\` / \`text-muted-foreground\` | Muted surfaces and helper text |
| \`bg-destructive\` / \`text-destructive-foreground\` | Destructive actions |
| \`border-border\` | Standard borders |
| \`ring-ring\` | Focus rings |

### Status / semantic colour sets
Use these for badges, alerts, and status indicators:

| Status | Background | Border | Text |
|--------|-----------|--------|------|
| Green | \`bg-green-bg\` | \`border-green-border\` | \`text-green-text-dark\` |
| Blue | \`bg-blue-bg\` | \`border-blue-border\` | \`text-blue-text-dark\` |
| Yellow | \`bg-yellow-bg\` | \`border-yellow-border\` | \`text-yellow-text-dark\` |
| Red | \`bg-red-bg\` | \`border-red-border\` | \`text-red-text-dark\` |

For high-contrast icon/link colours: \`text-green-high-contrast\`, \`text-blue-high-contrast\`, \`text-red-high-contrast\`, \`text-yellow-high-contrast\`

---

## Design System — Sizing & Spacing

- **Base border radius:** \`rounded-[var(--radius)]\` (10px) — use this for cards, buttons, inputs
- **Interactive heights:** \`h-8\` (sm), \`h-9\` (default), \`h-10\` (lg)
- **Typography:** use \`text-sm\` (14px) for interactive elements, \`text-base\` (16px) for body
- **Icon size:** \`size-4\` (16px) inline, \`size-5\` (20px) for prominent actions

---

## Design System — Component Patterns

### Buttons
\`\`\`tsx
// Primary
<Button>Save changes</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Ghost
<Button variant="ghost">More options</Button>
\`\`\`

### Inputs & Form Fields
\`\`\`tsx
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium text-foreground">Label</label>
  <Input placeholder="Placeholder" />
  <p className="text-sm text-muted-foreground">Helper text</p>
</div>
\`\`\`

### Cards
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
\`\`\`

### Status Badges
\`\`\`tsx
// Use inline styles with design tokens — shadcn Badge or a plain span
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
  bg-green-bg border border-green-border text-green-text-dark">
  Active
</span>
\`\`\`

---

## Animation & Polish Rules

These rules make the UI feel intentional and finished:

1. **Only animate \`transform\` and \`opacity\`** — never animate \`height\`, \`padding\`, or \`width\` directly (triggers layout)
2. **Use \`ease-out\` for entering elements** — feels fast and responsive. Never use \`ease-in\` on UI (starts slow, feels sluggish)
3. **Start from \`scale(0.95) opacity-0\`** — nothing in the real world appears from nothing; never animate from \`scale(0)\`
4. **Buttons need an \`:active\` state** — \`active:scale-[0.97]\` gives press feedback
5. **Keep UI animations under 300ms** — 150–200ms for hover/dropdowns, 200–300ms for modals
6. **Popovers scale from their trigger** — use Radix's \`data-[state=open]\` with \`origin-[--radix-popover-content-transform-origin]\`
7. **No animation on keyboard-triggered actions** — command palettes, shortcuts run hundreds of times/day

### Tailwind animation helpers
\`\`\`tsx
// Entering element
className="animate-in fade-in-0 zoom-in-95 duration-200"

// Exiting element
className="animate-out fade-out-0 zoom-out-95 duration-150"

// Button press feedback
className="transition-transform duration-100 active:scale-[0.97]"
\`\`\`

### Custom easing (available as CSS vars)
\`\`\`css
transition-timing-function: var(--ease-out);    /* strong ease-out */
transition-timing-function: var(--ease-in-out); /* smooth movement */
\`\`\`

---

## Focus States

All interactive elements must have visible focus states:
\`\`\`
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
\`\`\`

shadcn/ui components include this by default — don't strip it out.

---

## Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx      ← DO NOT EDIT
│   ├── page.tsx        ← EDIT THIS
│   ├── globals.css     ← reference only
│   └── [routes]/       ← add new pages here
├── components/
│   ├── layout/         ← DO NOT EDIT
│   └── ui/             ← DO NOT EDIT (shadcn)
└── lib/
    └── utils.ts        ← cn() helper
\`\`\`
`;
}

export function getMcpJson(): string {
  return JSON.stringify(
    {
      mcpServers: {
        shadcn: {
          command: "npx",
          args: ["shadcn@latest", "mcp"],
        },
      },
    },
    null,
    2
  );
}

export function getComponentsJson(): string {
  return JSON.stringify(
    {
      "$schema": "https://ui.shadcn.com/schema.json",
      "style": "new-york",
      "rsc": true,
      "tsx": true,
      "tailwind": {
        "config": "tailwind.config.ts",
        "css": "src/app/globals.css",
        "baseColor": "neutral",
        "cssVariables": true,
        "prefix": "",
      },
      "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks",
      },
    },
    null,
    2
  );
}

export function getLibUtils(): string {
  return `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
}
