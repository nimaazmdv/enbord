import { useEffect } from "react";
import { createPrismaAbility } from "@casl/prisma";
import { api } from "./client";
import { socket } from "./socket";

export const ability = createPrismaAbility([]);

export async function updateAbility(boardId?: string) {
  const res = boardId
    ? await api.get(`/ability?boardId=${boardId}`)
    : await api.get("/ability");

  ability.update(res.data.rules);
}

export function resetAbility() {
  ability.update([]);
}

export function useAbilityRealtimeHandlers(currentBoardId: string) {
  useEffect(() => {
    function handleAbilityStaled({ boardId }: { boardId: string }) {
      if (currentBoardId === boardId) {
        updateAbility(boardId);
      }
    }

    socket.on("ability:staled", handleAbilityStaled);

    return () => {
      socket.off("ability:staled", handleAbilityStaled);
    };
  }, [socket, currentBoardId]);
}
