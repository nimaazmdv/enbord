import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { ConfirmDialog } from "@/shared/components/app-ui/confirm-dialog";
import { Can, Action, subject } from "@/shared/components/can";
import { CopyIcon, PencilIcon, TrashIcon } from "lucide-react";

import { useState } from "react";
import { useComposerStore } from "@/shared/stores/composer.store";
import { useCopy } from "@/shared/hooks/use-copy";
import { useِDeleteItemMutation } from "@/features/items";

import type { Item } from "@/shared/types/entity.types";

interface ItemContextMenuProps
  extends React.ComponentProps<typeof ContextMenu> {
  item: Item;
}

export function ItemContextMenu({
  item,
  children,
  ...props
}: ItemContextMenuProps) {
  const [dialog, setDialog] = useState<"delete" | null>(null);

  const startEdit = useComposerStore((state) => state.startEdit);
  const { copy } = useCopy();
  const { mutateAsync: deleteItem } = useِDeleteItemMutation();

  return (
    <>
      <ContextMenu {...props}>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-50">
          <Can I={Action.Update} this={subject("Item", item)}>
            <ContextMenuItem
              onClick={() => startEdit(item.type, item)}
              {...props}
            >
              <PencilIcon />
              Edit
            </ContextMenuItem>
          </Can>

          {item.type === "NOTE" && (
            <ContextMenuItem
              onClick={() =>
                copy(item.note!.content, { toast: "Copied to the clipboard" })
              }
            >
              <CopyIcon />
              Copy
            </ContextMenuItem>
          )}

          <Can I={Action.Delete} this={subject("Item", item)}>
            <ContextMenuItem
              variant="destructive"
              onClick={() => setDialog("delete")}
            >
              <TrashIcon />
              Delete
            </ContextMenuItem>
          </Can>
        </ContextMenuContent>
      </ContextMenu>

      <ConfirmDialog
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
        onAction={() => deleteItem({ id: item.id })}
      />
    </>
  );
}
