import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

import type { PostNoteInput, EditNoteInput } from "../schema";
import type { Item } from "@/shared/types/entity.types";

export function usePostNoteMutation() {
  return useMutation({
    mutationFn: ({
      boardId,
      input,
    }: {
      boardId: string;
      input: PostNoteInput;
    }) =>
      api
        .post<{ item: Item }>(`/boards/${boardId}/notes`, input)
        .then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}

export function useEditNoteMutation() {
  return useMutation({
    mutationFn: ({ noteId, input }: { noteId: string; input: EditNoteInput }) =>
      api
        .patch<{ item: Item }>(`/notes/${noteId}`, input)
        .then((res) => res.data),

    onSuccess: () => {
      // Rely on realtime handlers
    },
  });
}
