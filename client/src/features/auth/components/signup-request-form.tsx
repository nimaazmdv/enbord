import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { PasswordInput } from "@/shared/components/app-ui/password-input";
import { Button } from "@/shared/components/ui/button";
import { AsyncButton } from "@/shared/components/app-ui/async-button";
import { GoogleIcon } from "./icons/google.icon";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { handleFormError } from "@/shared/lib/handle-form-error";
import { useVerificationStore } from "../stores/verification.store";
import { signupSchema, type SignupInput } from "../schema";
import { useSignupRequestMutation } from "../api/mutations";

export function SignupRequestForm() {
  const data = useVerificationStore((state) => state.data);
  const setStep = useVerificationStore((state) => state.setStep);

  const form = useForm<SignupInput>({
    resolver: standardSchemaResolver(signupSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutateAsync: signupRequest } = useSignupRequestMutation();

  async function onSubmit(values: SignupInput) {
    try {
      await signupRequest({ input: values });
      setStep("verify");
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
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name:</FieldLabel>
              <Input
                {...field}
                type="text"
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="eg, John Doe"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email Address:</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@gmail.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password:</FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="passwordConfirm"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="passwordConfirm">
                Confirm Password:
              </FieldLabel>
              <PasswordInput
                {...field}
                id="passwordConfirm"
                aria-invalid={fieldState.invalid}
                placeholder="********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="grid gap-2">
        <AsyncButton
          label="Sign up"
          pendingLabel="Signing up"
          isPending={form.formState.isSubmitting}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            window.location.assign("http://localhost:8000/api/auth/google")
          }
        >
          <GoogleIcon />
          Google
        </Button>
      </div>
    </form>
  );
}
