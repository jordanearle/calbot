// Birdie Design System Templates

export function getBirdieGlobalsCss(): string {
  return `@import "tailwindcss";

/* Birdie Design System - Tailwind v4 Compatible */
@theme {
  /* Birdie Brand Colors */
  --color-birdie-primary: #54BDB8;
  --color-birdie-primary-light: #A6FAE8;
  --color-birdie-nav: rgb(21, 41, 81);

  /* Background */
  --color-background: #ffffff;
  --color-background-2: #f3f4f7;

  /* Neutral Palette */
  --color-neutral-bg: #e3e7ed;
  --color-neutral-bg-hover: #dadee7;
  --color-neutral-bg-active: #cdd3df;
  --color-neutral-border: #c5c9d3;
  --color-neutral-border-hover: #a8abbd;
  --color-neutral-text: #606876;
  --color-neutral-text-dark: #151619;

  /* Status: Green */
  --color-green-bg: #e6f7ef;
  --color-green-border: #acdec8;
  --color-green-text: #072c1e;
  --color-green-high-contrast: #006643;

  /* Status: Blue */
  --color-blue-bg: #ebf3ff;
  --color-blue-border: #c1d6ff;
  --color-blue-text: #0f2757;
  --color-blue-high-contrast: #1847a5;

  /* Status: Yellow */
  --color-yellow-bg: #fff0d1;
  --color-yellow-border: #f0ce99;
  --color-yellow-text: #3d1f00;
  --color-yellow-high-contrast: #a35f00;

  /* Status: Red */
  --color-red-bg: #feecef;
  --color-red-border: #ffced6;
  --color-red-text: #811316;
  --color-red-high-contrast: #c20a1d;

  /* Status: Purple */
  --color-purple-bg: #f6ebfb;
  --color-purple-border: #e3c5ed;
  --color-purple-text: #390042;
  --color-purple-high-contrast: #9724a8;

  /* Status: Orange */
  --color-orange-bg: #feede2;
  --color-orange-border: #fdceaf;
  --color-orange-text: #5d1d14;
  --color-orange-high-contrast: #d14715;

  /* Status: Cyan */
  --color-cyan-bg: #def7f9;
  --color-cyan-border: #9ddde7;
  --color-cyan-text: #0b323c;
  --color-cyan-high-contrast: #008099;

  /* shadcn/ui compatible colors */
  --color-card: #ffffff;
  --color-card-foreground: #151619;
  --color-popover: #ffffff;
  --color-popover-foreground: #151619;
  --color-primary: #54BDB8;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f3f4f7;
  --color-secondary-foreground: #151619;
  --color-muted: #f3f4f7;
  --color-muted-foreground: #606876;
  --color-accent: #f3f4f7;
  --color-accent-foreground: #151619;
  --color-destructive: #c20a1d;
  --color-destructive-foreground: #ffffff;
  --color-border: #e3e7ed;
  --color-input: #e3e7ed;
  --color-ring: #54BDB8;

  /* Radius */
  --radius-lg: 0.5rem;
  --radius-md: 0.375rem;
  --radius-sm: 0.25rem;

  /* Font */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Base styles */
* {
  border-color: var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-neutral-text-dark);
  font-family: var(--font-sans);
}

/* Birdie Navigation Styles */
.birdie-top-nav {
  background-color: var(--color-birdie-nav);
  height: 60px;
}

.birdie-side-nav {
  width: 260px;
  background-color: var(--color-background-2);
  border-right: 1px solid var(--color-neutral-border);
}

.birdie-content {
  background-color: var(--color-background);
}
`;
}

export function getBirdieTailwindConfig(): string {
  // Tailwind v4 uses CSS-first configuration via @theme in globals.css
  // This config file is minimal - just content paths
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

export default function Home() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Welcome to ${projectName}
        </h1>
        <p className="text-gray-600 mt-2">
          Keep this preview open, run <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">claude</code> in
          this project folder, and talk through what needs to change - no technical phrasing required.
        </p>
      </div>

      <Card className="border border-dashed border-teal-200 bg-white">
        <CardHeader>
          <CardTitle>Start prompting with Claude</CardTitle>
          <CardDescription>
            Describe the user moment, the problem, and the outcome you want.
            Claude will edit this codebase instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-gray-700">
            <p>1. Open a terminal in this project folder and run <code className="px-1 py-0.5 bg-gray-100 rounded font-mono">claude</code>.</p>
            <p>2. Paste any context or screenshots you already have.</p>
            <p>3. Type your instruction in plain language and watch hot reload.</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">Try prompts like:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
              <li>
                "Show a progress summary for caregiver onboarding with clear
                next steps"
              </li>
              <li>
                "Add a lightweight call-to-action so PMs can capture meeting
                notes from this screen"
              </li>
              <li>
                "Rewrite the empty state to assure caregivers we're pulling new
                data soon"
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-teal-50 p-4 text-sm text-teal-900">
            <p>
              Already in Claude? Mention that the dev server is running at this
              preview URL so the assistant skips starting another one.
            </p>
          </div>
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
        {/* Birdie Logo */}
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
        <button className="text-white/70 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-white/70 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-teal-500 text-white text-sm">
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

const labelFromPath = (path: string) => {
  if (!path || path === "/") {
    return "Current page";
  }

  let normalizedPath = path;
  while (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.slice(1);
  }

  return normalizedPath
    .split("/")
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" / ");
};

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
          key={currentItem.href}
          href={currentItem.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-teal-500/10 text-teal-600"
          )}
        >
          <currentItem.icon className="w-5 h-5" />
          {currentItem.label}
        </Link>
      </nav>

      <div className="px-3 mt-auto">
        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
          <p className="text-xs text-gray-600">
            Built with{" "}
            <span className="text-teal-600 font-medium">Calbot</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
`,
  };
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
        "prefix": ""
      },
      "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks"
      }
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
