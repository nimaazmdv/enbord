import { ErrorsObject } from "src/common/types/error.types";

export const AuthErrors = {
  // Signup flow
  ALREADY_REGISTERED: {
    code: "auth.already_registered",
    message: "Provided email address is already registered",
  },

  USER_NOT_FOUND: {
    code: "auth.user_not_found",
    message: "There is no user associated to this email address",
  },

  INVALID_OTP: {
    code: "auth.invalid_otp",
    message: "Provided otp is incorrect or expired",
  },

  TOO_MANY_OTP_ATTEMPTS: {
    code: "too_many_otp_attempts",
    message: "Too many incorrect otp attempts, Please request a new code",
  },

  // Signin flow
  NOT_REGISTERED: {
    code: "auth.not_registered",
    message: "Provided email address is not registered or verified",
  },

  MISSING_LOCAL_ACCOUNT: {
    code: "auth.missing_local_account",
    message: "Provided email address is registered passwordless",
  },

  WRONG_PASSWORD: {
    code: "auth.incorrect_password",
    message: "Provided password is incorrect",
  },

  // Guard/Refresh flow
  MISSING_TOKEN: {
    code: "auth.missing_token",
    message: "This endpoint requires a token",
  },

  EXPIRED_TOKEN: {
    code: "auth.expired_token",
    message: "Provided token is expired",
  },

  INVALID_TOKEN: {
    code: "auth.invalid_token",
    message: "Provided token is invalid",
  },

  VOID_TOKEN: {
    code: "auth.void_token",
    message: "Provided token is not associated with any user",
  },

  // Refresh flow
  MISSING_SESSION: {
    code: "auth.missing_session",
    message: "Provided token is not associated to any session",
  },

  REVOKED_SESSION: {
    code: "auth.revoked_session",
    message: "Provided token is associated to a revoked session",
  },

  EXPIRED_SESSION: {
    code: "auth.expired_session",
    message: "Provided token is associated with an expired session",
  },

  MISMATCH_IN_SESSION: {
    code: "auth.mismatch_in_session",
    message: "Provided token is not matched to its associated session's token",
  },
} satisfies ErrorsObject;
