import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { Notification } from "@/shared/types/entity.types";

export const notificationsQueryOptions = queryOptions({
  queryKey: ["notifications"],
  queryFn: () =>
    api
      .get<{ notifications: Notification[] }>("/notifications")
      .then((res) => res.data.notifications),
});

export function useNotificationsQuery() {
  return useQuery(notificationsQueryOptions);
}
