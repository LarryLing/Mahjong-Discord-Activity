import { z } from "zod";
import { Request, Response } from "express";

import HttpCodes from "../constants/http.js";
import { tryCatch } from "../lib/result.js";
import { getDiscordTokenService } from "../services/discordServices.js";

const bodySchema = z.object({ code: z.string() });

const getDiscordToken = async (req: Request, res: Response) => {
  const parsed = bodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(HttpCodes.BAD_REQUEST)
      .json({ message: "Invalid request body" });
  }

  const { code } = parsed.data;

  const [error, result] = await tryCatch(getDiscordTokenService(code));

  if (error == null) {
    return res.status(HttpCodes.OK).json(result);
  }

  const { reason } = error;

  switch (reason) {
    case "AccessTokenHTTPError": {
      return res
        .status(HttpCodes.BAD_REQUEST)
        .json({ message: "Invalid or expired authorization code" });
    }
    case "ParseAccessTokenResponseError": {
      return res
        .status(HttpCodes.BAD_GATEWAY)
        .json({ message: "Unexpected response from Discord" });
    }
    case "UserHTTPError": {
      return res
        .status(HttpCodes.BAD_GATEWAY)
        .json({ message: "Failed to fetch Discord user" });
    }
    case "ParseUserResponseError": {
      return res
        .status(HttpCodes.BAD_GATEWAY)
        .json({ message: "Unexpected response from Discord" });
    }
    case "UnexpectedError": {
      return res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong" });
    }
    default: {
      throw new Error(`Unhandled error: ${reason satisfies never}`);
    }
  }
};

export { getDiscordToken };
