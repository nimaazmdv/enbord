import { ValidationError } from "class-validator";
import { CommonErrors } from "../errors/common.errors";

export function formatValidationErrors(errors: ValidationError[]) {
  const details = {};

  for (const error of errors) {
    const field = error.property;
    const constraints = error.constraints;

    if (constraints) {
      // Grab the last failed constraint
      const [type, message] = Object.entries(constraints).at(-1)!;
      const code = error.contexts?.[type]?.code;

      details[field] = { code, message };
    }
  }

  return CommonErrors.VALIDATION_FAILED(details);
}
