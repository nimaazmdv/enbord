import type { Note } from "@/shared/types/entity.types";

export function Note({ note }: { note: Note }) {
  return <div>{note.content}</div>;
}
