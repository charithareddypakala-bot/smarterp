import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Debounce-free controlled search input with leading icon.
 * Keyboard-friendly: focusable, ESC clears via the parent if wired.
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <div className={`relative w-full sm:max-w-xs ${className ?? ""}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
    </div>
  );
}
