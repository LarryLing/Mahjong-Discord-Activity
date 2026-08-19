import type { z } from "zod";

import {
  GET_DISCORD_TOKEN_ROUTE,
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseDataSchema,
} from "@mahjong/shared/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RouteContract = {
  method: HttpMethod;
  requestBodySchema: z.ZodTypeAny;
  responseDataSchema: z.ZodTypeAny;
};

const apiContract = {
  [GET_DISCORD_TOKEN_ROUTE]: {
    method: "POST",
    requestBodySchema: getDiscordTokenRequestBodySchema,
    responseDataSchema: getDiscordTokenResponseDataSchema,
  },
} as const satisfies Record<string, RouteContract>;

type ApiResponse<T> = {
  message: string;
  data: T;
};

type ApiContract = typeof apiContract;
type ApiRoute = keyof ApiContract;

export {
  type ApiContract,
  type ApiResponse,
  type ApiRoute,
  apiContract,
  type RouteContract,
};
