import {
  type ApiContract,
  type ApiRoute,
  apiContract,
} from "@shared/api-contracts";
import type { z } from "zod";

import { env } from "../env";

type ApiFetchOptions = {
  authToken?: string;
};

const getFullApiRoute = (apiRoute: ApiRoute) => {
  return `${env.COLYSEUS_CLIENT_URL}${apiRoute}`;
};

const apiFetch = async <R extends ApiRoute>(
  route: R,
  body: z.infer<ApiContract[R]["requestBodySchema"]>,
  options?: ApiFetchOptions,
): Promise<z.infer<ApiContract[R]["responseSchema"]>> => {
  const contract = apiContract[route];
  const {
    method,
    requestBodySchema,
    responseSchema,
    headers: contractHeaders,
    requiresAuth,
  } = contract;

  const parsedRequestBody = requestBodySchema.safeParse(body);
  if (!parsedRequestBody.success) {
    throw new Error(
      `Invalid request for ${route}: ${parsedRequestBody.error.message}`,
    );
  }

  const authorizationHeader: Record<string, string> = {};

  if (requiresAuth) {
    if (!options?.authToken) {
      throw new Error(`${route} requires auth but no authToken was provided`);
    }

    authorizationHeader.Authorization = `Bearer ${options.authToken}`;
  }

  const response = await fetch(getFullApiRoute(route), {
    method,
    headers: {
      ...contractHeaders,
      ...authorizationHeader,
    },
    body: JSON.stringify(parsedRequestBody.data),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  const raw = await response.json();
  const responseParsed = responseSchema.safeParse(raw);

  if (!responseParsed.success) {
    throw new Error(
      `Malformed response from ${route}: ${responseParsed.error.message}`,
    );
  }

  return responseParsed.data as z.infer<ApiContract[R]["responseSchema"]>;
};

export { apiFetch };
