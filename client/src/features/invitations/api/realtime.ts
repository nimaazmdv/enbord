import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/shared/api/socket";

import type { Invitation } from "@/shared/types/entity.types";

export function useInvitationsRealtimeHandlers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleInvitationCreated({
      invitation,
    }: {
      invitation: Invitation;
    }) {
      queryClient.setQueryData<Invitation[]>(
        ["invitations", { boardId: invitation.boardId }],
        (oldData) => (oldData ? [...oldData, invitation] : [invitation]),
      );
    }

    function handleInvitationResponded({
      invitation,
    }: {
      invitation: Invitation;
    }) {
      queryClient.setQueryData<Invitation[]>(
        ["invitations", { boardId: invitation.boardId }],
        (oldData) =>
          oldData &&
          oldData.map((inv) =>
            inv.id === invitation.id ? { ...inv, ...invitation } : inv,
          ),
      );
    }

    function handleInvitationRemoved({
      id,
      boardId,
    }: {
      id: string;
      boardId: string;
    }) {
      queryClient.setQueryData<Invitation[]>(
        ["invitations", { boardId }],
        (oldData) =>
          oldData && oldData.filter((invitation) => invitation.id !== id),
      );
    }

    socket.on("invitation:created", handleInvitationCreated);
    socket.on("invitation:responded", handleInvitationResponded);
    socket.on("invitation:removed", handleInvitationRemoved);

    return () => {
      socket.off("invitation:created", handleInvitationCreated);
      socket.off("invitation:responded", handleInvitationResponded);
      socket.off("invitation:removed", handleInvitationRemoved);
    };
  }, [socket, queryClient]);
}
