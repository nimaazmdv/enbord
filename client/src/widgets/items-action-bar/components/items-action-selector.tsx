import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ClipboardListIcon, FileIcon, ListTodoIcon } from "lucide-react";

export function ItemsActionSelector({ children }: React.PropsWithChildren) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={15}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem>
          <ListTodoIcon />
          Tasklist
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ClipboardListIcon />
          Poll
        </DropdownMenuItem>

        <DropdownMenuItem>
          <FileIcon />
          File
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
