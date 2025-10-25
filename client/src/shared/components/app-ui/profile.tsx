import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { User } from "../../types/entity.types";

export function Profile({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-8 rounded-lg">
        <AvatarImage />
        <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <div className="truncate text-sm font-semibold">{user.name}</div>
        <div className="truncate text-xs">{user.email}</div>
      </div>
    </div>
  );
}
