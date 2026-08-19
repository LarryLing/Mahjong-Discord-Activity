import * as z from "zod";

const userSchema = z.object({
  id: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().optional().nullish(),
});

type User = z.infer<typeof userSchema>;

export { type User, userSchema };
