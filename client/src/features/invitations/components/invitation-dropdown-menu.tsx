import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ClockIcon, InfoIcon, RedoIcon, TrashIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { formatSmartAbsolute } from "@/shared/lib/time";
import {
  useDeleteInvitationMutation,
  useInviteMemberMutation,
} from "../api/mutations";

import type { Invitation } from "@/shared/types/entity.types";

interface InvitationDropdownMenuProps
  extends React.ComponentProps<typeof DropdownMenu> {
  invitation: Invitation;
}

export function InvitationDropdownMenu({
  invitation,
  children,
  ...props
}: InvitationDropdownMenuProps) {
  const { mutateAsync: inviteMember } = useInviteMemberMutation();
  const { mutateAsync: deleteInvitation } = useDeleteInvitationMutation();

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="text-muted-foreground px-2 py-1.5 text-sm">
          <div className="flex items-center gap-2">
            <InfoIcon className="size-4" />
            <p>
              Sent by {invitation.sender?.name ?? "Deleted user"} at{" "}
              {formatSmartAbsolute(invitation.createdAt, { time: true })}
            </p>
          </div>

          {invitation.status !== "PENDING" && (
            <div
              className={cn(
                "flex items-center gap-2",
                invitation.status === "ACCEPTED"
                  ? "text-success"
                  : "text-destructive",
              )}
            >
              <ClockIcon className="size-4" />
              <p>
                {invitation.status === "ACCEPTED" ? "Accepted" : "Rejected"} at{" "}
                {formatSmartAbsolute(invitation.respondedAt!, { time: true })}
              </p>
            </div>
          )}
        </div>

        {invitation.status !== "PENDING" && <DropdownMenuSeparator />}

        {invitation.status === "REJECTED" && (
          <DropdownMenuItem
            onClick={() =>
              inviteMember({
                boardId: invitation.boardId,
                input: { email: invitation.receiver.email },
              })
            }
          >
            <RedoIcon />
            Resend
          </DropdownMenuItem>
        )}

        {invitation.status !== "PENDING" && (
          <DropdownMenuItem
            onClick={() => deleteInvitation({ id: invitation.id })}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
