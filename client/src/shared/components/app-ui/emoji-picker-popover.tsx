import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "@/shared/components/ui/emoji-picker";

import { useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

import type { Emoji } from "frimousse";

interface EmojiPickerPopoverProps extends React.ComponentProps<typeof Popover> {
  sideOffset?: number;
  onEmojiSelect: (emoji: Emoji) => void;
}

export function EmojiPickerPopover({
  sideOffset,
  onEmojiSelect,
  children,
  ...props
}: EmojiPickerPopoverProps) {
  const canHover = useMediaQuery({ query: "(hover: hover)" });
  const [open, setOpen] = useState(false);

  // Handle hover interface on desktop
  const closeTimeoutRef = useRef<NodeJS.Timeout>(null);

  function handleMouseEnter() {
    if (!canHover) return;

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setOpen(true);
  }

  function handleMouseLeave() {
    if (!canHover) return;

    closeTimeoutRef.current = setTimeout(() => setOpen(false), 200);
  }

  // Handle click interface on mobile
  function handleClick() {
    if (canHover) return;
    setOpen((prev) => !prev);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={(e) => e.stopPropagation()}
        className="p-0"
        align="start"
        sideOffset={sideOffset}
        asChild
      >
        <EmojiPicker className="h-[300px]" onEmojiSelect={onEmojiSelect}>
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
