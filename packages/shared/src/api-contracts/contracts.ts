import type { z } from "zod";

import {
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseSchema,
} from "./getDiscordToken.js";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RouteContract = {
  method: HttpMethod;
  requestBodySchema: z.ZodTypeAny;
  responseSchema: z.ZodTypeAny;
  headers: Record<string, string>;
  requiresAuth: boolean;
};

const apiContract = {
  "/discord/token": {
    method: "POST",
    requestBodySchema: getDiscordTokenRequestBodySchema,
    responseSchema: getDiscordTokenResponseSchema,
    headers: {
      "Content-Type": "application/json",
    },
    requiresAuth: false,
  },
} as const satisfies Record<string, RouteContract>;

type ApiContract = typeof apiContract;
type ApiRoute = keyof ApiContract;

export { type ApiContract, type ApiRoute, apiContract, type RouteContract };
