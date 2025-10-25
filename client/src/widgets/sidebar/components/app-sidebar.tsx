import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavBoard } from "./nav-boards";

export function AppSidebar() {
  const { open, openMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="wiggle px-2.5 py-4">
        <div className="flex items-center justify-between">
          {(open || openMobile) && (
            <div className="pl-1.5 text-sm tracking-wide">ENBORD</div>
          )}
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavBoard />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
