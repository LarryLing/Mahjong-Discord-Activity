import * as z from "zod";

const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  avatar: z.string().optional().nullish(),
});

type User = z.infer<typeof userSchema>;

export { type User, userSchema };
