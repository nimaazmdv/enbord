import { create } from "zustand";
import type { Item } from "@/shared/types/entity.types";

type Mode = "create" | "edit";
type ItemType = Item["type"];

interface Composer {
  mode: Mode;
  itemType: ItemType;
  item?: Item; // For edit mode
}

interface ComposerStore {
  composer?: Composer | null;
  startCreate: (itemType: ItemType) => void;
  startEdit: (itemType: ItemType, item: Item) => void;
  cancel: () => void;
}

export const useComposerStore = create<ComposerStore>((set) => ({
  startCreate: (itemType) => set({ composer: { mode: "create", itemType } }),

  startEdit: (itemType, item) =>
    set({ composer: { mode: "edit", itemType, item } }),

  cancel: () => set({ composer: null }),
}));
