/**
 * Frontend-only workspace helper.
 *
 * The company workspace is derived from the email address used to sign in
 * (the domain becomes the company). There is no company-selection step —
 * signing in takes the user straight to the dashboard for that workspace.
 */

export interface Workspace {
  /** Display name, e.g. "Apex Traders". */
  name: string;
  /** The email used to sign in. */
  email: string;
  /** Email domain, e.g. "apextraders.com". */
  domain: string;
  /** 2-letter initials for the avatar/badge. */
  initials: string;
}

const STORAGE_KEY = "smarterp.workspace";

/** Title-case a slug/domain fragment into a friendly company name. */
function humanize(raw: string): string {
  return raw
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build a workspace object from a company email address. */
export function workspaceFromEmail(email: string): Workspace {
  const trimmed = email.trim();
  const domain = trimmed.includes("@") ? trimmed.split("@")[1] ?? "" : "";
  // Use the part before the TLD as the company label.
  const label = domain ? domain.split(".")[0] : trimmed.split("@")[0] ?? "Workspace";
  const name = humanize(label) || "Workspace";
  const initials =
    name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "WS";

  return { name, email: trimmed, domain, initials };
}

/** Persist the active workspace (frontend-only, localStorage). */
export function saveWorkspace(ws: Workspace): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ws));
  } catch {
    /* ignore storage errors */
  }
}

/** Read the active workspace, falling back to a sensible default. */
export function getWorkspace(): Workspace {
  const fallback: Workspace = {
    name: "Apex Traders",
    email: "admin@apextraders.com",
    domain: "apextraders.com",
    initials: "AT",
  };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<Workspace>) };
  } catch {
    return fallback;
  }
}
