import { Can, Action, subject } from "@/shared/components/can";
import { BoardHeader, BoardHeaderSkeleton } from "@/widgets/board-header";
import { ItemsWindow, ItemsWindowSkeleton } from "@/widgets/items-window";
import { ItemsActionBar } from "@/widgets/items-action-bar";

import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import {
  updateAbility,
  useAbilityRealtimeHandlers,
} from "@/shared/api/ability";
import {
  boardQueryOptions,
  useBoardsRealtimeHandlers,
} from "@/features/boards";
import { itemsInfiniteQueryOptions } from "@/features/items";

export const Route = createFileRoute("/app/boards/$boardId")({
  loader: async ({ context: { queryClient }, params: { boardId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(boardQueryOptions(boardId)),
      queryClient.ensureInfiniteQueryData(itemsInfiniteQueryOptions(boardId)),
      updateAbility(boardId),
    ]);
  },

  component: RouteComponent,
  pendingComponent: PendingComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();

  useBoardsRealtimeHandlers();
  useAbilityRealtimeHandlers(boardId);

  const itemsWindowRef = useRef<{ scrollToBottom: () => void }>(null);

  return (
    <div className="flex h-svh flex-col gap-4 pb-4">
      <BoardHeader id={boardId} />
      <ItemsWindow boardId={boardId} ref={itemsWindowRef} />

      <Can I={Action.Create} this={subject("Item", { boardId })}>
        <ItemsActionBar
          boardId={boardId}
          onPost={() => itemsWindowRef.current?.scrollToBottom()}
        />
      </Can>
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="flex h-svh flex-col gap-4 pb-4">
      <BoardHeaderSkeleton />
      <ItemsWindowSkeleton />
    </div>
  );
}
