import { z } from "zod";

export const postNoteSchema = z.object({
  content: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length, {
      error: "Please provide the note content",
    }),
});

export const editNoteSchema = postNoteSchema;

export type PostNoteInput = z.infer<typeof postNoteSchema>;
export type EditNoteInput = z.infer<typeof editNoteSchema>;
