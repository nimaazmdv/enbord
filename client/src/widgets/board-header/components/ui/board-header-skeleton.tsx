import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MoreVerticalIcon } from "lucide-react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export function BoardHeaderSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <div className="flex items-center gap-2">
          {!isMobile && <Skeleton className="size-8" />}
          <div className="space-y-2">
            <Skeleton className="h-2 w-15" />
            <Skeleton className="h-1 w-18" />
          </div>
        </div>
      </div>

      <MoreVerticalIcon className="text-accent size-5" />
    </div>
  );
}
