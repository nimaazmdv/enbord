import { ErrorsObject } from "src/common/types/error.types";

export const NoteErrors = {
  CREATE_FORBIDDEN: {
    code: "note.create_forbidden",
    message: "You cannot create items in the target board",
  },

  UPDATE_FORBIDDEN: {
    code: "note.update_forbidden",
    message: "You cannot update the target note",
  },
} satisfies ErrorsObject;
