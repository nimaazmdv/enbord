import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { InviteMemberForm } from "./invite-member-form";
import { InvitationHistory } from "./invitation-history";

interface ManageInvitationsDialogProps
  extends React.ComponentProps<typeof Dialog> {
  boardId: string;
}

export function ManageInvitationsDialog({
  boardId,
  children,
  ...props
}: ManageInvitationsDialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-110">
        <DialogHeader>
          <DialogTitle>Invitations Center</DialogTitle>
          <DialogDescription>
            Invitees receive a notification and may accept or reject your
            invitation
          </DialogDescription>
        </DialogHeader>

        <InviteMemberForm boardId={boardId} />
        <InvitationHistory boardId={boardId} />
      </DialogContent>
    </Dialog>
  );
}
