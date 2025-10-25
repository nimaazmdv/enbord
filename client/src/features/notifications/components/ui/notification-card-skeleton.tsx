import { Skeleton } from "@/shared/components/ui/skeleton";

export function NotificationCardSkeleton() {
  return (
    <div className="space-y-3 border-l px-4 py-2">
      <p className="text-muted-foreground">
        <Skeleton className="h-1 w-40" />
      </p>

      <div className="space-y-2">
        <Skeleton className="h-1 w-80" />
        <Skeleton className="h-1 w-80" />
        <Skeleton className="h-1 w-80" />
        <Skeleton className="h-1 w-60" />
      </div>
    </div>
  );
}
