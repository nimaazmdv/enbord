import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/shared/api/socket";

import type { Notification } from "@/shared/types/entity.types";

export function useNotificationsRealtimeHandlers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    function handleNotificationReceived({
      notification,
    }: {
      notification: Notification;
    }) {
      queryClient.setQueryData<Notification[]>(["notifications"], (oldData) =>
        oldData ? [...oldData, notification] : [notification],
      );
    }

    socket.on("notification:received", handleNotificationReceived);

    return () => {
      socket.off("notification:received", handleNotificationReceived);
    };
  }, [socket, queryClient]);
}
