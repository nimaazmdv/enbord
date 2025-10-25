import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { InvitationDropdownMenu } from "./invitation-dropdown-menu";
import { EllipsisIcon } from "lucide-react";

import type { Invitation } from "@/shared/types/entity.types";

export function InvitationRow({ invitation }: { invitation: Invitation }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Avatar className="size-7">
          <AvatarFallback>{invitation.receiver.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          {invitation.receiver.email} ({invitation.status.toLowerCase()})
        </div>
      </div>

      <InvitationDropdownMenu invitation={invitation}>
        <Button variant="ghost" size="icon-sm">
          <EllipsisIcon />
        </Button>
      </InvitationDropdownMenu>
    </div>
  );
}
