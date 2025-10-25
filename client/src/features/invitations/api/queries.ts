import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { Invitation } from "@/shared/types/entity.types";

export const invitationsQueryOptions = (boardId: string) =>
  queryOptions({
    queryKey: ["invitations", { boardId }],
    queryFn: () =>
      api
        .get<{ invitations: Invitation[] }>(`boards/${boardId}/invitations`)
        .then((res) => res.data.invitations),
  });

export function useInvitationsQuery(boardId: string) {
  return useQuery(invitationsQueryOptions(boardId));
}
