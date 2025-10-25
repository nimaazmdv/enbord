import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { CreateInvitationInput } from "../schema";
import type { Invitation } from "@/shared/types/entity.types";

export function useInviteMemberMutation() {
  return useMutation({
    mutationFn: ({
      boardId,
      input,
    }: {
      boardId: string;
      input: CreateInvitationInput;
    }) =>
      api
        .post<{
          invitation: Invitation;
        }>(`boards/${boardId}/invitations`, input)
        .then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}

export function useDeleteInvitationMutation() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => api.delete(`/invitations/${id}`),
    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}
