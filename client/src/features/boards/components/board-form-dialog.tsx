import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { BoardForm } from "./board-form";

import { useState } from "react";
import type { Board } from "@/shared/types/entity.types";

interface BoardFormDialogProps extends React.ComponentProps<typeof Dialog> {
  board?: Board;
  onClose?: () => void;
}

export function BoardFormDialog({
  board,
  onClose,
  children,
  ...props
}: BoardFormDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-100">
        <DialogHeader>
          <DialogTitle>{board ? "Edit board" : "Create new board"}</DialogTitle>
          <DialogDescription>
            {board
              ? "Edit your board for a new feel"
              : "What kind of board do you want to create?"}
          </DialogDescription>
        </DialogHeader>

        <BoardForm
          board={board}
          onSuccess={() => {
            setOpen(false);
            onClose?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
