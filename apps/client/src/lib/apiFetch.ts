import { Client } from "@colyseus/sdk";
import {
  type ApiContract,
  type ApiRoute,
  apiContract,
} from "@mahjong/shared/api-contracts";
import type { z } from "zod";

const apiFetch = async <R extends ApiRoute>(
  client: Client,
  route: R,
  body: z.infer<ApiContract[R]["requestBodySchema"]>,
): Promise<z.infer<ApiContract[R]["responseDataSchema"]>> => {
  const contract = apiContract[route];
  const { requestBodySchema, responseDataSchema } = contract;

  const parsedRequestBody = requestBodySchema.safeParse(body);
  if (!parsedRequestBody.success) {
    throw new Error(
      `Invalid request for ${route}: ${parsedRequestBody.error.message}`,
    );
  }

  const { raw, data } = await client.http.post(route, {
    body,
  });

  if (!raw.ok) {
    const { message } = data;
    throw new Error(message);
  }

  const responseParsed = responseDataSchema.safeParse(data);

  if (!responseParsed.success) {
    throw new Error(
      `Malformed response from ${route}: ${responseParsed.error.message}`,
    );
  }

  return responseParsed.data as z.infer<ApiContract[R]["responseDataSchema"]>;
};

export { apiFetch };
