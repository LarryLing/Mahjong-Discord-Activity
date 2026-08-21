import { createEndpoint } from "colyseus";

import {
  GET_DISCORD_TOKEN_ROUTE,
  getDiscordTokenRequestBodySchema,
} from "@mahjong/shared/api/getDiscordToken";

import HttpCodes from "../constants/http.js";
import { tryCatch } from "../lib/result.js";
import { getDiscordTokenService } from "../services/discordServices.js";

const getDiscordToken = createEndpoint(
  GET_DISCORD_TOKEN_ROUTE,
  {
    method: "POST",
    body: getDiscordTokenRequestBodySchema,
  },
  async (ctx) => {
    const { code } = ctx.body;

    const [error, result] = await tryCatch(getDiscordTokenService(code));

    if (error == null) {
      ctx.setStatus(HttpCodes.OK);
      return ctx.json(result);
    }

    const { reason } = error;

    switch (reason) {
      case "AccessTokenHTTPError": {
        return ctx.error(HttpCodes.BAD_REQUEST, {
          message: "Invalid or expired authorization code",
        });
      }
      case "InvalidAccessTokenResponse": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Invalid response from Discord",
        });
      }
      case "UserHTTPError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Failed to fetch Discord user",
        });
      }
      case "InvalidUserResponse": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Invalid response from Discord",
        });
      }
      case "InvalidResponseData": {
        return ctx.error(HttpCodes.INTERNAL_SERVER_ERROR, {
          message: "Invalid response data",
        });
      }
      case "UnexpectedError": {
        return ctx.error(HttpCodes.INTERNAL_SERVER_ERROR, {
          message: "Something went wrong",
        });
      }
      default: {
        throw new Error(`Unhandled error: ${reason satisfies never}`);
      }
    }
  }
);

export { getDiscordToken };
