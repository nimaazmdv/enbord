import { SidebarProvider } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/widgets/sidebar";

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-hidden px-4 md:px-6">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
