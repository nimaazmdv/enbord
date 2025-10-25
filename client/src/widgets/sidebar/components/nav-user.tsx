import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Profile } from "@/shared/components/app-ui/profile";
import { NotificationsDialog } from "@/features/notifications";
import {
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react";

import { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useSignoutMutation } from "@/features/auth";

export function NavUser() {
  const [dialog, setDialog] = useState<"notifications" | null>(null);
  const isMobile = useIsMobile();

  const user = useAuthStore((state) => state.user);
  const { mutateAsync: signout } = useSignoutMutation();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground focus-visible:ring-0"
            >
              {user && <Profile user={user} />}
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            sideOffset={4}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="px-1 py-1.5">
                {user && <Profile user={user} />}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserRoundIcon />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setDialog("notifications")}>
                <BellIcon />
                Notifications
              </DropdownMenuItem>

              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signout()}>
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationsDialog
          open={dialog === "notifications"}
          onOpenChange={(open) => setDialog(open ? "notifications" : null)}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
