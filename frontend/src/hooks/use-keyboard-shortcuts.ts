import { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

/** Custom DOM events used to open global overlays from anywhere. */
export const OPEN_COMMAND_PALETTE = "smarterp:open-command-palette";
export const OPEN_SHORTCUTS_HELP = "smarterp:open-shortcuts-help";

export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE));
}

export function openShortcutsHelp() {
  window.dispatchEvent(new CustomEvent(OPEN_SHORTCUTS_HELP));
}

/**
 * Registers the application's global, keyboard-first navigation map.
 * Mirrors the SmartERP shortcut specification. Mount once in the app shell.
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const go = (to: string) => navigate({ to });

    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      // ---- Function keys (no modifier) ----
      if (!ctrl && !alt) {
        switch (key) {
          case "F1":
            e.preventDefault();
            return go("/companies");
          case "F6":
            e.preventDefault();
            return go("/app/receipt");
          case "F7":
            e.preventDefault();
            return go("/app/journal");
          case "F8":
            e.preventDefault();
            return go("/app/sales");
          case "F9":
            e.preventDefault();
            return go("/app/purchase");
          case "F10":
            e.preventDefault();
            return go("/app/contra");
          case "F2":
            e.preventDefault();
            return toast.info("Change Financial Year");
          case "F3":
            e.preventDefault();
            return toast.info("Company Information");
          case "F4":
            e.preventDefault();
            return toast.info("Calculator");
          case "Escape":
            return router.history.back();
        }
      }

      // ---- Alt + Function keys (return notes) ----
      if (alt && key === "F8") {
        e.preventDefault();
        return go("/app/credit-note");
      }
      if (alt && key === "F9") {
        e.preventDefault();
        return go("/app/debit-note");
      }

      // ---- Alt + letter ----
      if (alt && !ctrl) {
        switch (key.toLowerCase()) {
          case "l":
          case "a":
            e.preventDefault();
            return go("/app/ledgers");
          case "g":
            e.preventDefault();
            return go("/app/groups");
          case "s":
            e.preventDefault();
            return go("/app/stock-items");
          case "u":
            e.preventDefault();
            return go("/app/units");
          case "b":
            e.preventDefault();
            return go("/app/balance-sheet");
          case "p":
            e.preventDefault();
            return go("/app/profit-loss");
          case "t":
            e.preventDefault();
            return go("/app/trial-balance");
          case "r":
            e.preventDefault();
            return go("/app/inventory");
          case "x":
            e.preventDefault();
            return go("/app/gst");
        }
      }

      // ---- Ctrl / Cmd combos ----
      if (ctrl) {
        // Ctrl + Shift combos first
        if (shift) {
          switch (key.toLowerCase()) {
            case "c":
              e.preventDefault();
              return go("/app/customers");
            case "s":
              e.preventDefault();
              return go("/app/suppliers");
            case "f":
              e.preventDefault();
              return openCommandPalette();
          }
          return;
        }
        switch (key.toLowerCase()) {
          case "k":
          case "f":
            e.preventDefault();
            return openCommandPalette();
          case "h":
            e.preventDefault();
            return go("/app");
          case "q":
            e.preventDefault();
            toast.success("Logged out");
            return go("/");
          case "i":
            e.preventDefault();
            return go("/app/inventory");
          case "n":
            e.preventDefault();
            return go("/app/stock-items");
          case "b":
            e.preventDefault();
            return go("/app/sales");
          case "p":
            e.preventDefault();
            toast.info("Print Invoice");
            return;
        }
      }

      // ---- "?" opens the shortcuts help ----
      if (!ctrl && !alt && shift && key === "?") {
        e.preventDefault();
        return openShortcutsHelp();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, router]);
}
