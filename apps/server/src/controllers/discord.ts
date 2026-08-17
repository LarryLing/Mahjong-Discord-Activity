import { createEndpoint } from "colyseus";
import { z } from "zod";

import HttpCodes from "../constants/http.js";
import { tryCatch } from "../lib/result.js";
import { getDiscordTokenService } from "../services/discord.js";

const getDiscordToken = createEndpoint(
  "/discord/token",
  {
    method: "POST",
    body: z.object({ code: z.string() }),
  },
  async (ctx) => {
    const { code } = ctx.body;

    const [error, result] = await tryCatch(getDiscordTokenService(code));

    if (error == null) {
      ctx.setStatus(HttpCodes.OK);
      return result;
    }

    const { reason } = error;

    switch (reason) {
      case "AccessTokenHTTPError": {
        return ctx.error(HttpCodes.BAD_REQUEST, {
          message: "Invalid or expired authorization code",
        });
      }
      case "ParseAccessTokenResponseError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Unexpected response from Discord",
        });
      }
      case "UserHTTPError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Failed to fetch Discord user",
        });
      }
      case "ParseUserResponseError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
          message: "Unexpected response from Discord",
        });
      }
      case "UnexpectedError": {
        return ctx.error(HttpCodes.BAD_GATEWAY, {
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
