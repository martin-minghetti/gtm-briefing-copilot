"use client";

import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Sparkles className="size-4 text-primary" />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
            GTM Briefing Copilot
          </span>
        </a>
        <div className="flex items-center gap-1">
          <a
            href="#"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </a>
          <a
            href="#try-it"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Try it
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
