import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/command-palette";
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { getRouteTitle } from "@/lib/nav";

/**
 * Authenticated app shell: collapsible sidebar + top navbar + page outlet.
 * All module pages render inside this layout via <Outlet />.
 */
export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const title = getRouteTitle(pathname);

  // Register the global keyboard-first navigation map.
  useKeyboardShortcuts();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <Navbar title={title} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl animate-in fade-in-50 duration-300">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
      {/* Global overlays */}
      <CommandPalette />
      <ShortcutsDialog />
    </SidebarProvider>
  );
}
