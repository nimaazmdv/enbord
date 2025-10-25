import { Skeleton } from "@/shared/components/ui/skeleton";
import { EllipsisIcon } from "lucide-react";

export function InvitationRowSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-full" />
        <Skeleton className="h-1 w-30" />
      </div>

      <div className="size-6">
        <EllipsisIcon className="text-accent size-4" />
      </div>
    </div>
  );
}
