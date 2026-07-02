import { Link } from "@tanstack/react-router";
import { Keyboard, LogOut, Search, Settings, User } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  openCommandPalette,
  openShortcutsHelp,
} from "@/hooks/use-keyboard-shortcuts";
import { getWorkspace } from "@/lib/workspace";

/**
 * Top navigation bar: sidebar trigger, global search, notifications, user menu.
 */
export function Navbar({ title }: { title: string }) {
  const workspace = getWorkspace();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="h-6" />

      <div className="hidden text-sm font-medium text-foreground sm:block">{title}</div>

      {/* Global search — opens the command palette */}
      <button
        type="button"
        onClick={openCommandPalette}
        className="relative ml-auto hidden w-full max-w-sm items-center rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/50 md:flex"
      >
        <Search className="mr-2 size-4 shrink-0" />
        <span className="truncate">Search transactions, parties, items…</span>
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 select-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium lg:inline-block">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1 md:ml-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Keyboard shortcuts"
          onClick={openShortcutsHelp}
        >
          <Keyboard className="size-5 text-muted-foreground" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {workspace.initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-sm font-medium text-foreground">{workspace.name}</p>
                <p className="text-[11px] text-muted-foreground">Administrator</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/app/settings">
                <Settings className="size-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/" className="text-destructive focus:text-destructive">
                <LogOut className="size-4" /> Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
