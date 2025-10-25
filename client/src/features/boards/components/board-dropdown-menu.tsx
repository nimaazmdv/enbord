import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/shared/components/app-ui/confirm-dialog";
import { Can, Action, subject } from "@/shared/components/can";
import { BoardFormDialog } from "./board-form-dialog";
import { EditIcon, ArchiveIcon, TrashIcon, LogOutIcon } from "lucide-react";

import { useState } from "react";
import {
  useِDeleteBoardMutation,
  useِLeaveBoardMutation,
} from "../api/mutations";

import type { Board } from "@/shared/types/entity.types";

interface BoardDropdownMenuProps
  extends React.ComponentProps<typeof DropdownMenu> {
  board: Board;
  contentSide?: "right" | "top" | "bottom" | "left";
  contentAlign?: "center" | "start" | "end";
}

export function BoardDropdownMenu({
  board,
  contentSide = "right",
  contentAlign = "start",
  children,
  ...props
}: BoardDropdownMenuProps) {
  const [dialog, setDialog] = useState<"edit" | "delete" | "leave" | null>(
    null,
  );

  const { mutateAsync: deleteBoard } = useِDeleteBoardMutation();
  const { mutateAsync: leaveBoard } = useِLeaveBoardMutation();

  return (
    <>
      <DropdownMenu {...props}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side={contentSide}
          align={contentAlign}
          sideOffset={10}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <Can I={Action.Update} this={subject("Board", board)}>
            <DropdownMenuItem onClick={() => setDialog("edit")}>
              <EditIcon />
              Edit
            </DropdownMenuItem>
          </Can>

          <DropdownMenuItem>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>

          <Can I={Action.Delete} this={subject("Board", board)}>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDialog("delete")}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </Can>

          <Can I={Action.Leave} this={subject("Board", board)}>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDialog("leave")}
            >
              <LogOutIcon />
              Leave
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>

      <BoardFormDialog
        open={dialog === "edit"}
        onOpenChange={(open) => setDialog(open ? "edit" : null)}
        board={board}
        onClose={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
        onAction={() => deleteBoard({ id: board.id })}
      />

      <ConfirmDialog
        open={dialog === "leave"}
        onOpenChange={(open) => setDialog(open ? "leave" : null)}
        onAction={() => leaveBoard({ id: board.id })}
      />
    </>
  );
}
