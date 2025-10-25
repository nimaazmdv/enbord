import { TextareaAutosize } from "@/shared/components/ui/textarea-autosize";
import { EmojiPickerPopover } from "@/shared/components/app-ui/emoji-picker-popover";
import { Button } from "@/shared/components/ui/button";
import { SmileyIcon } from "../icons/smiley.icon";
import { SendHorizontalIcon } from "../icons/send-horizontal.icon";

import { useRef } from "react";
import type { Emoji } from "frimousse";

interface NoteTextareaProps
  extends React.ComponentProps<typeof TextareaAutosize> {
  value?: string; // Retype as only string
  isSubmitting: boolean;
}

export function NoteTextarea({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  ...props
}: NoteTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const invalid = isSubmitting || !value?.toString().trim();

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        if (invalid) e.preventDefault();
      } else {
        e.preventDefault();
        onSubmit?.({} as React.FormEvent<HTMLTextAreaElement>); // Submit value
      }
    }
  }

  function handleEmojiSelect({ emoji }: Emoji) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value?.slice(0, start) + emoji + value?.slice(end);

    // Trigger react-hook-form onChange
    onChange?.({
      target: { value: newValue },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    // Restore focus and move caret after emoji
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

  return (
    <div className="relative w-full">
      <TextareaAutosize
        className="focus-visible:border-input scrollbar-none aria-invalid:border-input rounded-3xl px-9.5 py-2.5 focus-visible:ring-0"
        placeholder="Enter your note..."
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        maxRows={6}
        {...props}
        ref={textareaRef} // Put after props to be not lost
      />

      <EmojiPickerPopover
        onOpenChange={() => textareaRef.current?.focus()}
        onEmojiSelect={handleEmojiSelect}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute bottom-2 left-2 size-6.5"
        >
          <SmileyIcon className="size-5.5" />
        </Button>
      </EmojiPickerPopover>

      <Button
        type="submit"
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 bottom-2 size-6.5"
        disabled={invalid}
      >
        <SendHorizontalIcon className="size-4.5" />
      </Button>
    </div>
  );
}
