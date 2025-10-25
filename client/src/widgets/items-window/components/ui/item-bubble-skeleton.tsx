import { Skeleton } from "@/shared/components/ui/skeleton";

export function ItemBubbleSkeleton() {
  return (
    <div className="grid w-fit gap-2 rounded-md border p-3">
      <div className="space-y-2">
        <Skeleton className="h-1 w-30" />
        <Skeleton className="h-1 w-30" />
        <Skeleton className="h-1 w-30" />
        <Skeleton className="h-1 w-30" />
        <Skeleton className="h-1 w-16" />
      </div>
      <Skeleton className="h-1 w-20 justify-self-end" />
    </div>
  );
}
