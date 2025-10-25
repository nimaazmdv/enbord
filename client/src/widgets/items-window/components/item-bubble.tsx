import { Note } from "@/features/notes";
import { ItemContextMenu } from "./item-context-menu";

import { useState } from "react";
import { formatAbsolute } from "@/shared/lib/time";
import { cn } from "@/shared/lib/utils";

import type { Item } from "@/shared/types/entity.types";

export function ItemBubble({ item }: { item: Item }) {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  let Content;
  switch (item.type) {
    case "NOTE":
      Content = <Note note={item.note!} />;
      break;
    default:
      throw new Error("Invalid item type");
  }

  return (
    <ItemContextMenu onOpenChange={setContextMenuOpen} item={item}>
      <div className={cn(contextMenuOpen && "bg-secondary/20")}>
        <div className="bg-secondary/30 text-secondary-foreground grid w-fit max-w-prose gap-1 rounded-md border p-3 text-sm break-words break-all whitespace-pre-wrap">
          {Content}
          <div className="text-muted-foreground justify-self-end text-xs">
            {formatAbsolute(item.updatedAt, "full")}
          </div>
        </div>
      </div>
    </ItemContextMenu>
  );
}
