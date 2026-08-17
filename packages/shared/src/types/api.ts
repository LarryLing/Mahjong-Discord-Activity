import * as z from "zod";

import { userSchema } from "./user.js";

export const getDiscordTokenRequestSchema = z.object({
  code: z.string().min(1),
});

export type GetDiscordTokenRequestType = z.infer<
  typeof getDiscordTokenRequestSchema
>;

export const getDiscordTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  user_token: z.string().min(1),
  user: userSchema,
});

export type GetDiscordTokenResponseType = z.infer<
  typeof getDiscordTokenResponseSchema
>;
