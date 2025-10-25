import { Button } from "@/shared/components/ui/button";

import { formatSmartAbsolute } from "@/shared/lib/time";
import { useRespondInvitationMutation } from "../api/mutations";

import type { Notification } from "@/shared/types/entity.types";

export function InvitationNotification({
  notification,
}: {
  notification: Notification;
}) {
  const { mutateAsync: respondInvitation } = useRespondInvitationMutation();

  return (
    <div className="space-y-3">
      <p>
        <span className="font-semibold">{notification.payload.senderName}</span>{" "}
        has invited you to the board{" "}
        <span className="font-semibold">{notification.payload.boardName}</span>
      </p>

      {notification.invitation.status === "PENDING" ? (
        <div className="flex gap-1.5">
          <Button
            onClick={() =>
              respondInvitation({
                id: notification.invitationId!,
                response: "reject",
              })
            }
            variant="outline"
            size="sm"
          >
            Reject
          </Button>
          <Button
            onClick={() =>
              respondInvitation({
                id: notification.invitationId!,
                response: "accept",
              })
            }
            size="sm"
          >
            Accept
          </Button>
        </div>
      ) : (
        <p className="text-muted-foreground">
          {notification.invitation.status === "ACCEPTED"
            ? "Accepted"
            : "Rejected"}{" "}
          at{" "}
          {formatSmartAbsolute(notification.invitation.respondedAt!, {
            time: true,
          })}
        </p>
      )}
    </div>
  );
}
