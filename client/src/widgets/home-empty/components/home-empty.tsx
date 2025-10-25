import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { Button } from "@/shared/components/ui/button";
import { InboxIcon } from "lucide-react";

import { BoardFormDialog } from "@/features/boards";

export function HomeEmpty() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <InboxIcon />
        </EmptyMedia>
        <EmptyTitle>Nothing important yet</EmptyTitle>
        <EmptyDescription>
          Your assigned tasks and important notes will appear here as you start
          collaborating. Start by creating a board
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <BoardFormDialog>
          <Button>Create Board</Button>
        </BoardFormDialog>
      </EmptyContent>
    </Empty>
  );
}
