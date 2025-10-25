import { useEffect } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/shared/api/socket";

import type { Board, BoardDetail } from "@/shared/types/entity.types";

export function useBoardsRealtimeHandlers() {
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleBoardUpdated({ board }: { board: Board }) {
      queryClient.setQueryData<Board[]>(
        ["boards"],
        (oldData) =>
          oldData && oldData.map((b) => (b.id === board.id ? board : b)),
      );

      queryClient.setQueryData<BoardDetail>(
        ["boards", board.id],
        (oldData) => oldData && { ...oldData, ...board },
      );
    }

    function handleBoardRemoved({ id }: { id: string }) {
      queryClient.setQueryData<Board[]>(
        ["boards"],
        (oldData) => oldData && oldData.filter((board) => board.id !== id),
      );

      queryClient.removeQueries({ queryKey: ["boards", id] });

      if (location.pathname.startsWith(`/app/boards/${id}`)) {
        navigate({ to: "/app" });
      }
    }

    function handleBoardIncreased({ id }: { id: string }) {
      queryClient.setQueryData<BoardDetail>(
        ["boards", id],
        (oldData) =>
          oldData && { ...oldData, membersCount: oldData.membersCount + 1 },
      );
    }

    function handleBoardDecreased({ id }: { id: string }) {
      queryClient.setQueryData<BoardDetail>(
        ["boards", id],
        (oldData) =>
          oldData && { ...oldData, membersCount: oldData.membersCount - 1 },
      );
    }

    socket.on("board:updated", handleBoardUpdated);
    socket.on("board:removed", handleBoardRemoved);
    socket.on("board:increased", handleBoardIncreased);
    socket.on("board:decreased", handleBoardDecreased);

    return () => {
      socket.off("board:updated", handleBoardUpdated);
      socket.off("board:removed", handleBoardRemoved);
      socket.off("board:increased", handleBoardIncreased);
      socket.off("board:decreased", handleBoardDecreased);
    };
  }, [socket, queryClient]);
}
