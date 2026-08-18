import * as z from "zod";

import { userSchema } from "../types/user.js";

const getDiscordTokenRequestBodySchema = z.object({
  code: z.string().min(1),
});

type GetDiscordTokenRequestBody = z.infer<
  typeof getDiscordTokenRequestBodySchema
>;

const getDiscordTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  user_token: z.string().min(1),
  user: userSchema,
});

type GetDiscordTokenResponse = z.infer<typeof getDiscordTokenResponseSchema>;

export {
  type GetDiscordTokenRequestBody,
  type GetDiscordTokenResponse,
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseSchema,
};
