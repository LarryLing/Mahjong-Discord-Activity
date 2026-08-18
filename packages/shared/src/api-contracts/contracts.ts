import type { z } from "zod";

import {
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseDataSchema,
} from "./getDiscordToken.js";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RouteContract = {
  method: HttpMethod;
  requestBodySchema: z.ZodTypeAny;
  responseDataSchema: z.ZodTypeAny;
};

const apiContract = {
  "/discord/token": {
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
  type ApiResponse,
  type ApiContract,
  type ApiRoute,
  apiContract,
  type RouteContract,
};
