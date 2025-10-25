import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  BoardDropdownMenu,
  BoardLink,
  useBoardsQuery,
  useBoardsRealtimeHandlers,
} from "@/features/boards";
import { NavBoardsSkeleton } from "./ui/nav-boards-skeleton";
import { MoreHorizontalIcon } from "lucide-react";

import { useMatchRoute } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";

export function NavBoard() {
  const { open } = useSidebar();

  useBoardsRealtimeHandlers();
  const { data: boards, isPending, error } = useBoardsQuery();

  const matchRoute = useMatchRoute();

  if (isPending) {
    return <NavBoardsSkeleton />;
  }
  if (error) throw error;

  if (!boards.length) return null;

  return (
    <SidebarGroup className={cn(!open && "hidden")}>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {boards.map((board) => (
            <SidebarMenuItem key={board.id}>
              <SidebarMenuButton
                isActive={
                  !!matchRoute({
                    to: "/app/boards/$boardId",
                    params: { boardId: board.id },
                  })
                }
                asChild
              >
                <BoardLink board={board} />
              </SidebarMenuButton>

              <BoardDropdownMenu board={board}>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontalIcon />
                </SidebarMenuAction>
              </BoardDropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
