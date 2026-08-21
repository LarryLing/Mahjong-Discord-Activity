import { z } from "zod";

import { userSchema } from "../types/user.js";

const GET_DISCORD_TOKEN_ROUTE = "/discord/token" as const;

const getDiscordTokenRequestBodySchema = z.object({
  code: z.string().min(1),
});

type GetDiscordTokenRequestBody = z.infer<
  typeof getDiscordTokenRequestBodySchema
>;

const getDiscordTokenResponseDataSchema = z.object({
  access_token: z.string().min(1),
  user_token: z.string().min(1),
  user: userSchema,
});

type GetDiscordTokenResponseData = z.infer<
  typeof getDiscordTokenResponseDataSchema
>;

export {
  GET_DISCORD_TOKEN_ROUTE,
  type GetDiscordTokenRequestBody,
  type GetDiscordTokenResponseData,
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseDataSchema,
};
