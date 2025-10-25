import { ItemBubbleSkeleton } from "./item-bubble-skeleton";

export function ItemsWindowSkeleton() {
  return (
    <div className="grid gap-2 overflow-hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <ItemBubbleSkeleton key={index} />
      ))}
    </div>
  );
}
