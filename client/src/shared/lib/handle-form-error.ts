import { toast } from "sonner";

import { AxiosError } from "axios";
import type { UseFormReturn } from "react-hook-form";
import type { ErrorResponse } from "../types/api.types";

export function handleFormError(error: unknown, form: UseFormReturn<any>) {
  if (error instanceof AxiosError && error.response) {
    const { code, message, details } = error.response.data as ErrorResponse;

    if (code === "common.validation_failed") {
      for (const [field, fieldError] of Object.entries(details!)) {
        form.setError(field, { message: fieldError.message });
      }
    } else {
      toast.error(message);
    }
  } else {
    toast.error("Something went wrong");
  }
}
