import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { NotificationsList } from "./notifications-list";
import { Button } from "@/shared/components/ui/button";
import { BellMinusIcon } from "lucide-react";

import { useClearNotificationsMutation } from "../api/mutations";

export function NotificationsDialog({
  children,
  ...props
}: React.ComponentProps<typeof Dialog>) {
  const { mutateAsync: clearNotifications } = useClearNotificationsMutation();

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Notifications
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => clearNotifications()}
            >
              <BellMinusIcon />
              Clear all
            </Button>
          </DialogTitle>
        </DialogHeader>

        <NotificationsList />
      </DialogContent>
    </Dialog>
  );
}
