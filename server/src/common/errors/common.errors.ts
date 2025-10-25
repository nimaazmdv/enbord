import { ErrorsObject } from "../types/error.types";

export const CommonErrors = {
  VALIDATION_FAILED: (details: Record<string, any>) => ({
    code: "common.validation_failed",
    message: "Some of the provided fields are invalid",
    details,
  }),

  NOT_FOUND: (resource: string) => ({
    code: `${resource}.not_found`,
    message: `Target ${resource} was not found`,
  }),
} satisfies ErrorsObject;
