import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { shortcutSections } from "@/lib/shortcuts";
import { OPEN_SHORTCUTS_HELP } from "@/hooks/use-keyboard-shortcuts";

/** Render a key combo as individual <kbd> chips. */
function Keys({ combo }: { combo: string }) {
  const parts = combo.split(/\s*\+\s*|\s*\/\s*/);
  return (
    <span className="flex flex-wrap items-center gap-1">
      {parts.map((p, i) => (
        <kbd
          key={i}
          className="select-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
        >
          {p}
        </kbd>
      ))}
    </span>
  );
}

/**
 * Keyboard shortcut reference. Opens via the "?" key, the command palette,
 * or the navbar help button.
 */
export function ShortcutsDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_SHORTCUTS_HELP, onOpen);
    return () => window.removeEventListener(OPEN_SHORTCUTS_HELP, onOpen);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="size-5 text-primary" /> Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            SmartERP is fully keyboard-driven. Press these combos anywhere in the app.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-3">
          <div className="grid gap-6 sm:grid-cols-2">
            {shortcutSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li
                      key={item.keys + item.label}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground">{item.label}</span>
                      <Keys combo={item.keys} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
