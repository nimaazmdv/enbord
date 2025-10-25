import { Button } from "@/shared/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";

import { useEffect } from "react";
import { useComposerStore } from "@/shared/stores/composer.store";

import type { Note } from "@/shared/types/entity.types";

export function NoteComposerStatus({ note }: { note: Note }) {
  const cancel = useComposerStore((state) => state.cancel);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        cancel();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [cancel]);

  return (
    <div className="flex items-center gap-3 border-t px-4 py-2 text-sm">
      <PencilIcon className="text-muted-foreground size-5" />

      <div className="flex w-full items-center gap-1">
        <p className="border-primary bg-primary/20 flex-1 truncate rounded-r-md border-l-2 p-2">
          {note.content}
        </p>
        <Button variant="ghost" size="icon-sm" onClick={() => cancel()}>
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
