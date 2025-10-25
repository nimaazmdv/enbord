import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Button } from "@/shared/components/ui/button";
import { Action, Can, subject } from "@/shared/components/can";
import { MoreVerticalIcon, UserPlusIcon } from "lucide-react";

import { BoardDropdownMenu, useBoardSuspenseQuery } from "@/features/boards";
import { ManageInvitationsDialog } from "@/features/invitations";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export function BoardHeader({ id }: { id: string }) {
  const isMobile = useIsMobile();
  const { data: board } = useBoardSuspenseQuery(id);

  return (
    <header className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <div className="flex items-center gap-2">
          {!isMobile && <div className="text-xl">{board.icon}</div>}
          <div>
            <h1>{board.name}</h1>
            <p className="text-muted-foreground text-sm">
              {board.membersCount} members
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Can I={Action.Create} this={subject("Invitation", { boardId: id })}>
          <ManageInvitationsDialog boardId={id}>
            <Button size="sm" variant="ghost">
              <UserPlusIcon />
              Invite
            </Button>
          </ManageInvitationsDialog>
        </Can>

        <BoardDropdownMenu
          board={board}
          contentSide="bottom"
          contentAlign="end"
        >
          <Button variant="ghost" size="icon-sm">
            <MoreVerticalIcon className="size-5" />
          </Button>
        </BoardDropdownMenu>
      </div>
    </header>
  );
}
