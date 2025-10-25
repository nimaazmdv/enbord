import { Field, FieldError } from "@/shared/components/ui/field";
import { DialogClose, DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { AsyncButton } from "@/shared/components/app-ui/async-button";
import { EmojiPickerPopover } from "@/shared/components/app-ui/emoji-picker-popover";
import { FileIcon } from "lucide-react";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { handleFormError } from "@/shared/lib/handle-form-error";
import { createBoardSchema, type CreateBoardInput } from "../schema";
import { updateBoardSchema, type UpdateBoardInput } from "../schema";
import {
  useCreateBoardMutation,
  useUpdateBoardMutation,
} from "../api/mutations";

import type { Board } from "@/shared/types/entity.types";

interface BoardFormProps {
  board?: Board;
  onSuccess?: () => void;
}

export function BoardForm({ board, onSuccess }: BoardFormProps) {
  const form = useForm<CreateBoardInput | UpdateBoardInput>({
    resolver: standardSchemaResolver(
      board ? updateBoardSchema : createBoardSchema,
    ),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (board) {
      form.setValue("name", board.name);
      form.setValue("icon", board.icon);
    }
  }, [board]);

  const { mutateAsync: createBoard } = useCreateBoardMutation();
  const { mutateAsync: updateBoard } = useUpdateBoardMutation();

  async function onSubmit(values: CreateBoardInput | UpdateBoardInput) {
    try {
      if (board) {
        await updateBoard({ id: board.id, input: values as UpdateBoardInput });
      } else {
        await createBoard({ input: values as CreateBoardInput });
      }

      onSuccess?.();
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
      <div className="flex items-start gap-1.5">
        <Controller
          control={form.control}
          name="icon"
          render={({ field }) => (
            <EmojiPickerPopover
              onEmojiSelect={({ emoji }) => {
                field.onChange(emoji);
              }}
            >
              <Button type="button" variant="outline" size="icon">
                {field.value ? <span>{field.value}</span> : <FileIcon />}
              </Button>
            </EmojiPickerPopover>
          )}
        />

        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Board name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <AsyncButton
          label={board ? "Edit" : "Create"}
          pendingLabel={board ? "Editing" : "Creating"}
          isPending={form.formState.isSubmitting}
        />
      </DialogFooter>
    </form>
  );
}
