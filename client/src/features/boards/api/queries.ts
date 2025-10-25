import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { Board, BoardDetail } from "@/shared/types/entity.types";

export const boardsQueryOptions = queryOptions({
  queryKey: ["boards"],
  queryFn: () =>
    api.get<{ boards: Board[] }>("/boards").then((res) => res.data.boards),
});

export const boardQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["boards", id],
    queryFn: () =>
      api
        .get<{ board: BoardDetail }>(`/boards/${id}`)
        .then((res) => res.data.board),
  });

export function useBoardsQuery() {
  return useQuery(boardsQueryOptions);
}

export function useBoardSuspenseQuery(id: string) {
  return useSuspenseQuery(boardQueryOptions(id));
}
