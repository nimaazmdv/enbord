import { ErrorsObject } from "src/common/types/error.types";

export const BoardErrors = {
  READ_FORBIDDEN: {
    code: "board.read_forbidden",
    message: "You cannot read the target board",
  },

  UPDATE_FORBIDDEN: {
    code: "board.update_forbidden",
    message: "You cannot update the target board",
  },

  DELETE_FORBIDDEN: {
    code: "board.delete_forbidden",
    message: "You cannot delete the target board",
  },
} satisfies ErrorsObject;
