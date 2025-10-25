import { ErrorsObject } from "src/common/types/error.types";

export const ItemErrors = {
  READ_ALL_FORBIDDEN: {
    code: "item.read_all_forbidden",
    message: "You cannot read items from the target board",
  },

  READ_FORBIDDEN: {
    code: "item.read_forbidden",
    message: "You cannot read the target item",
  },

  DELETE_FORBIDDEN: {
    code: "item.delete_forbidden",
    message: "You cannot delete the target item",
  },
} satisfies ErrorsObject;
