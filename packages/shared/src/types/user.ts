import * as z from "zod";

export const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().optional().nullish(),
});

export type UserType = z.infer<typeof userSchema>;
