import { ErrorsObject } from "src/common/types/error.types";

export const MembershipErrors = {
  READ_FORBIDDEN: {
    code: "membership.read_forbidden",
    message: "You cannot see members from this board board",
  },

  UPDATE_FORBIDDEN: {
    code: "membership.update_forbidden",
    message: "You cannot update the target member",
  },

  REMOVE_FORBIDDEN: {
    code: "membership.remove_forbidden",
    message: "You cannot remove the target member",
  },

  LEAVE_FORBIDDEN: {
    code: "membership.leave_forbidden",
    message: "You cannot leave the target board",
  },
} satisfies ErrorsObject;
