import { InvitationNotification } from "./invitation-notification";

import { formatRelative } from "@/shared/lib/time";
import type { Notification } from "@/shared/types/entity.types";

interface NotificationCardProps {
  notification: Notification;
  nowTs: number;
}

export function NotificationCard({
  notification,
  nowTs,
}: NotificationCardProps) {
  return (
    <div className="space-y-1 border-l px-4 py-2 text-sm">
      <p className="text-muted-foreground">
        {notification.type === "INVITATION_RECEIVED" ? "Invitation" : "General"}{" "}
        • {formatRelative(notification.createdAt, nowTs)}
      </p>
      {notification.type === "INVITATION_RECEIVED" ? (
        <InvitationNotification notification={notification} />
      ) : null}
    </div>
  );
}
