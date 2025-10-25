import { Field } from "@/shared/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/shared/components/ui/button";
import { AsyncButton } from "@/shared/components/app-ui/async-button";

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { handleFormError } from "@/shared/lib/handle-form-error";
import { otpSchema, type OtpInput } from "../schema";
import { useSignupVerifyMutation } from "../api/mutations";
import { useVerificationStore } from "../stores/verification.store";

export function SignupVerifyForm() {
  const form = useForm<OtpInput>({
    resolver: standardSchemaResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync: signupVerify } = useSignupVerifyMutation();

  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/signup" });

  const setStep = useVerificationStore((state) => state.setStep);

  async function onSubmit(values: OtpInput) {
    try {
      await signupVerify({ input: values });
      navigate({ to: search.redirect || "/app" });
    } catch (error) {
      handleFormError(error, form);
    }
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        control={form.control}
        name="otp"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <InputOTP {...field} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
              <InputOTPGroup className="w-full justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        )}
      />

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep("request")}
        >
          Back
        </Button>
        <AsyncButton
          label="Verify"
          pendingLabel="Verifying"
          isPending={form.formState.isSubmitting}
        />
      </div>
    </form>
  );
}
