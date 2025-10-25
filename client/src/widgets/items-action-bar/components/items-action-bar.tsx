import { Button } from "@/shared/components/ui/button";
import { NoteForm, NoteComposerStatus } from "@/features/notes";
import { ItemsActionSelector } from "./items-action-selector";
import { PlusIcon } from "lucide-react";

import { useComposerStore } from "@/shared/stores/composer.store";

interface ItemsActionBarProps {
  boardId: string;
  onPost: () => void;
}

export function ItemsActionBar({ boardId, onPost }: ItemsActionBarProps) {
  const composer = useComposerStore((state) => state.composer);

  const showNoteComposerStatus =
    composer && composer.itemType === "NOTE" && composer.mode === "edit";

  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1 space-y-2">
        {showNoteComposerStatus && (
          <NoteComposerStatus note={composer!.item!.note!} />
        )}
        <NoteForm boardId={boardId} onPost={onPost} />
      </div>

      <ItemsActionSelector>
        <Button
          variant="outline"
          size="icon-lg"
          className="size-10.5 rounded-full"
        >
          <PlusIcon />
        </Button>
      </ItemsActionSelector>
    </div>
  );
}
