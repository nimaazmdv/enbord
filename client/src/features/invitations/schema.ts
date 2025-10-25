import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z
    .string()
    .min(1, "Please provide an email address")
    .pipe(z.email("Provided email address is invalid")),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
