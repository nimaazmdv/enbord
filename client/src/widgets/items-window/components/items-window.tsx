import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ItemBubble } from "./item-bubble";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  useItemsSuspenseInfiniteQuery,
  useItemsRealtimeHandlers,
} from "@/features/items";

interface ItemsWindowProps {
  boardId: string;
  ref?: React.RefObject<{ scrollToBottom: () => void } | null>;
}

export function ItemsWindow({ boardId, ref }: ItemsWindowProps) {
  useItemsRealtimeHandlers();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useItemsSuspenseInfiniteQuery(boardId);

  const { ref: sentinelRef, inView } = useInView();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(null);

  // Get the actual viewport from the scroll area
  function getViewport() {
    return scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
  }

  // Exposed to parent for updating scroll position after a new item is added
  function scrollToBottom() {
    const viewport = getViewport();
    if (!viewport) return;

    setTimeout(() => {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
    }, 0);
  }

  useImperativeHandle(ref, () => ({ scrollToBottom }));

  // Scroll to bottom on initial render
  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    viewport.scrollTop = viewport.scrollHeight;
  }, []);

  // Fetch more items if topmost item is reached
  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    if (inView && hasNextPage && !isFetchingNextPage) {
      // Store scroll height before fetching more items
      prevScrollHeightRef.current = viewport.scrollHeight;
      fetchNextPage();
    }
  }, [inView]);

  // Calculate the new scroll height after fetching more items
  useLayoutEffect(() => {
    const viewport = getViewport();
    const prevScrollHeight = prevScrollHeightRef.current;
    if (!viewport || !prevScrollHeight) return;

    viewport.scrollTop += viewport.scrollHeight - prevScrollHeight;
    prevScrollHeightRef.current = null;
  }, [data]);

  const items = data.pages.flatMap((page) => page.items).reverse();

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="grid h-full flex-1 content-end overflow-hidden"
    >
      <div className="grid gap-2">
        <div ref={sentinelRef}></div>
        {items.map((item) => (
          <ItemBubble key={item.id} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
}
