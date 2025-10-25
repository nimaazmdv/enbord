import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { InvitationRow } from "./invitation-row";
import { InvitationRowSkeleton } from "./ui/invitation-row-skeleton";

import { useInvitationsRealtimeHandlers } from "../api/realtime";
import { useInvitationsQuery } from "../api/queries";

export function InvitationHistory({ boardId }: { boardId: string }) {
  useInvitationsRealtimeHandlers();
  const { data: invitations, isPending, error } = useInvitationsQuery(boardId);

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <InvitationRowSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) throw error;

  if (!invitations.length) return;

  return (
    <>
      <Separator />
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Sent:</p>
        <ScrollArea className="h-full max-h-50">
          <div className="space-y-2 pr-3">
            {invitations.map((invitation) => (
              <InvitationRow key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
