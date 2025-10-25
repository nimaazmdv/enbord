import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { api } from "@/shared/api/client";

import type { CreateBoardInput, UpdateBoardInput } from "../schema";
import type { Board } from "@/shared/types/entity.types";

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ input }: { input: CreateBoardInput }) =>
      api.post<{ board: Board }>("/boards", input).then((res) => res.data),

    onSuccess: ({ board }) => {
      queryClient.setQueryData<Board[]>(["boards"], (oldData) =>
        oldData ? [...oldData, board] : [board],
      );

      navigate({
        to: "/app/boards/$boardId",
        params: { boardId: board.id },
      });
    },
  });
}

export function useUpdateBoardMutation() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBoardInput }) =>
      api
        .patch<{ board: Board }>(`/boards/${id}`, input)
        .then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}

export function useِDeleteBoardMutation() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`/boards/${id}`).then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}

export function useِLeaveBoardMutation() {
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`/boards/${id}/members/me`).then((res) => res.data),

    onSuccess: (_, { id }) => {
      queryClient.setQueryData<Board[]>(
        ["boards"],
        (oldData) => oldData && oldData.filter((board) => board.id !== id),
      );

      queryClient.removeQueries({ queryKey: ["boards", id] });

      if (location.pathname.startsWith(`/app/boards/${id}`)) {
        navigate({ to: "/app" });
      }
    },
  });
}
