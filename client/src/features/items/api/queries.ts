import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { Item } from "@/shared/types/entity.types";

export const itemsInfiniteQueryOptions = (boardId: string) =>
  infiniteQueryOptions({
    queryKey: ["items", { boardId }],
    queryFn: ({ pageParam }) =>
      api
        .get<{
          items: Item[];
          nextCursor: string;
        }>(`/boards/${boardId}/items?cursor=${pageParam}`)
        .then((res) => res.data),

    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

export function useItemsSuspenseInfiniteQuery(boardId: string) {
  return useSuspenseInfiniteQuery(itemsInfiniteQueryOptions(boardId));
}
