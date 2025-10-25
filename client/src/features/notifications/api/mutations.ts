import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/shared/api/client";

import type { Board, Notification } from "@/shared/types/entity.types";

export function useRespondInvitationMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({
      id,
      response,
    }: {
      id: string;
      response: "accept" | "reject";
    }) =>
      api
        .patch<{
          notification: Notification;
          board?: Board;
        }>(`/invitations/${id}/${response}`)
        .then((res) => res.data),

    onSuccess: ({ notification, board }) => {
      queryClient.setQueryData<Notification[]>(
        ["notifications"],
        (oldData) =>
          oldData &&
          oldData.map((notif) =>
            notif.id === notification.id ? notification : notif,
          ),
      );

      if (board) {
        queryClient.setQueryData<Board[]>(["boards"], (oldData) =>
          oldData ? [...oldData, board] : [board],
        );

        navigate({
          to: "/app/boards/$boardId",
          params: { boardId: board.id },
        });
      }
    },
  });
}

export function useClearNotificationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete("/notifications").then((res) => res.data),
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(
        ["notifications"],
        (oldData) =>
          oldData && oldData.filter((notification) => notification.needsAction),
      );
    },
  });
}
