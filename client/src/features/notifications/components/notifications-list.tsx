import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { NotificationCard } from "./notification-card";
import { NotificationCardSkeleton } from "./ui/notification-card-skeleton";

import { useEffect, useState } from "react";
import { useNotificationsRealtimeHandlers } from "../api/realtime";
import { useNotificationsQuery } from "../api/queries";

export function NotificationsList() {
  useNotificationsRealtimeHandlers();
  const { data: notifications, isPending, error } = useNotificationsQuery();

  // Set the timer for notifications timestamps
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNowTs(Date.now()), 60000);
    return () => clearInterval(interval);
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <NotificationCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (error) throw error;

  if (!notifications.length) {
    return (
      <Empty className="md:p-8">
        <EmptyHeader>
          <EmptyTitle className="text-base">You're all caught up</EmptyTitle>
          <EmptyDescription>
            You will notified about invitations, mentions, task assigned, ...
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ScrollArea className="h-full max-h-100">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            nowTs={nowTs}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
