import { useEffect } from "react";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { socket } from "@/shared/api/socket";

import type { Item } from "@/shared/types/entity.types";

type QueryData = InfiniteData<{ items: Item[]; nextCursor: string }>;

export function useItemsRealtimeHandlers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleItemCreated({ item }: { item: Item }) {
      queryClient.setQueryData<QueryData>(
        ["items", { boardId: item.boardId }],
        (oldData) =>
          oldData && {
            ...oldData,
            pages: oldData.pages.map((page, index) =>
              index === 0 ? { ...page, items: [item, ...page.items] } : page,
            ),
          },
      );
    }

    function handleItemUpdated({ item }: { item: Item }) {
      queryClient.setQueryData<QueryData>(
        ["items", { boardId: item.boardId }],
        (oldData) =>
          oldData && {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((it) => (it.id === item.id ? item : it)),
            })),
          },
      );
    }

    function handleItemRemoved({
      id,
      boardId,
    }: {
      id: string;
      boardId: string;
    }) {
      queryClient.setQueryData<QueryData>(
        ["items", { boardId }],
        (oldData) =>
          oldData && {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.filter((item) => item.id !== id),
            })),
          },
      );
    }

    socket.on("item:created", handleItemCreated);
    socket.on("item:updated", handleItemUpdated);
    socket.on("item:removed", handleItemRemoved);

    return () => {
      socket.off("item:created", handleItemCreated);
      socket.off("item:updated", handleItemUpdated);
      socket.off("item:removed", handleItemRemoved);
    };
  }, [socket, queryClient]);
}
