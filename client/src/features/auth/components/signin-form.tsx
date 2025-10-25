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

import { useNavigate, useSearch } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { handleFormError } from "@/shared/lib/handle-form-error";
import { signinSchema, type SigninInput } from "../schema";
import { useSigninMutation } from "../api/mutations";

export function SigninForm() {
  const form = useForm<SigninInput>({
    resolver: standardSchemaResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signin } = useSigninMutation();

  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/signin" });

  async function onSubmit(values: SigninInput) {
    try {
      await signin({ input: values });
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
      <FieldGroup>
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
      </FieldGroup>

      <div className="grid gap-2">
        <AsyncButton
          label="Sign in"
          pendingLabel="Signing in"
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
