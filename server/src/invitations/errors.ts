import { ErrorsObject } from "src/common/types/error.types";

export const InvitationErrors = {
  INVITE_FORBIDDEN: {
    code: "invitation.invite_forbidden",
    message: "You cannot invite members to the target board",
  },

  READ_FORBIDDEN: {
    code: "invitation.read_forbidden",
    message: "You cannot read invitations of the target board",
  },

  USER_NOT_EXISTS: {
    code: "invitation.user_not_exists",
    message: "Provided email address is not associated with any user",
  },

  ALREADY_MEMBER: {
    code: "invitation.already_member",
    message: "Target user is already a board member",
  },

  ALREADY_SENT: {
    code: "invitation.already_sent",
    message: "Target user already has a pending invitation",
  },

  RESPOND_FORBIDDEN: {
    code: "invitation.respond_forbidden",
    message: "You cannot respond to the target invitation",
  },

  ALREADY_RESPONDED: {
    code: "invitation.already_responded",
    message: "Target invitation is already responded",
  },

  DELETE_FORBIDDEN: {
    code: "invitation.delete_forbidden",
    message: "You cannot delete the target invitation",
  },
} satisfies ErrorsObject;
