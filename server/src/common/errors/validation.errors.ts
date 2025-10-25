import { ErrorsObject } from "../types/error.types";

export const ValidationErrors = {
  EMAIL_REQUIRED: {
    context: { code: "validation.email_required" },
    message: "Please provide an email address",
  },

  EMAIL_INVALID: {
    context: { code: "validation.email_invalid" },
    message: "Provided email address is invalid",
  },

  PASSWORD_REQUIRED: {
    context: { code: "validation.password_required" },
    message: "Please provide a password",
  },

  PASSWORD_WEAK: {
    context: { code: "validation.password_weak" },
    message: "Passwords must contain at least 8 characters",
  },

  OTP_REQUIRED: {
    context: { code: "validation.otp_required" },
    message: "Please provide the otp sent to your email",
  },

  OTP_INVALID: {
    context: { code: "validation.otp_invalid" },
    message: "Otps consist of 6 digits",
  },

  NAME_REQUIRED: {
    context: { code: "validation.name_required" },
    message: "Please provide a name",
  },

  CONTENT_REQUIRED: {
    context: { code: "validation.content_required" },
    message: "Please provide some content",
  },
} satisfies ErrorsObject;
