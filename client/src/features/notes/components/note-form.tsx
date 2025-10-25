import { Field } from "@/shared/components/ui/field";
import { NoteTextarea } from "./ui/note-textarea";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { toast } from "sonner";
import { useComposerStore } from "@/shared/stores/composer.store";
import { postNoteSchema, type PostNoteInput } from "../schema";
import { editNoteSchema, type EditNoteInput } from "../schema";
import { usePostNoteMutation, useEditNoteMutation } from "../api/mutations";

interface NoteFormProps {
  boardId: string;
  onPost: () => void;
}

export function NoteForm({ boardId, onPost }: NoteFormProps) {
  const composer = useComposerStore((state) => state.composer);
  const cancel = useComposerStore((state) => state.cancel);
  const isOnEdit =
    composer && composer.itemType === "NOTE" && composer.mode === "edit";

  const form = useForm<PostNoteInput | EditNoteInput>({
    resolver: standardSchemaResolver(
      isOnEdit ? editNoteSchema : postNoteSchema,
    ),
    defaultValues: {
      content: composer?.item?.note?.content || "",
    },
  });

  useEffect(() => {
    form.setValue("content", composer?.item?.note?.content || "");
  }, [composer]);

  const { mutateAsync: postNote } = usePostNoteMutation();
  const { mutateAsync: editNote } = useEditNoteMutation();

  async function onSubmit(values: PostNoteInput | EditNoteInput) {
    try {
      if (isOnEdit) {
        await editNote({
          noteId: composer!.item!.note!.id,
          input: values as EditNoteInput,
        });
        cancel();
      } else {
        await postNote({ boardId, input: values as PostNoteInput });
        onPost();
      }

      form.reset();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <NoteTextarea
              {...field}
              id="content"
              aria-invalid={fieldState.invalid}
              onSubmit={form.handleSubmit(onSubmit)}
              isSubmitting={form.formState.isSubmitting}
            />
          </Field>
        )}
      />
    </form>
  );
}
