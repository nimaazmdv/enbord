import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { AsyncButton } from "@/shared/components/app-ui/async-button";

import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { handleFormError } from "@/shared/lib/handle-form-error";
import { createInvitationSchema, type CreateInvitationInput } from "../schema";
import { useInviteMemberMutation } from "../api/mutations";

export function InviteMemberForm({ boardId }: { boardId: string }) {
  const form = useForm<CreateInvitationInput>({
    resolver: standardSchemaResolver(createInvitationSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: inviteMember } = useInviteMemberMutation();

  async function onSubmit(values: CreateInvitationInput) {
    try {
      await inviteMember({ boardId, input: values });
      form.reset();
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
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email Address:</FieldLabel>
            <div className="flex gap-2">
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@gmail.com"
              />
              <AsyncButton
                label="Send"
                pendingLabel="Sending"
                isPending={form.formState.isSubmitting}
              />
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
