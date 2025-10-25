import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1, "Please provide a name"),
  icon: z.emoji().nullable().optional(),
});

export const updateBoardSchema = createBoardSchema.partial();

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
