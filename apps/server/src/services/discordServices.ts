import { JWT } from "@colyseus/auth";
import type { GetDiscordTokenResponseData } from "@mahjong/shared/api-contracts";
import type { User } from "@mahjong/shared/types";

import { env } from "../env.js";
import { err, ok } from "../lib/result.js";

const getDiscordTokenService = async (code: string) => {
  const accessTokenResponse = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      }),
    },
  );

  if (!accessTokenResponse.ok) {
    return err({ reason: "AccessTokenHTTPError" as const });
  }

  const { access_token } = await accessTokenResponse.json();

  if (!access_token) {
    return err({ reason: "ParseAccessTokenResponseError" as const });
  }

  const userResponse = await fetch("https://discord.com/api/users/@me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!userResponse.ok) {
    return err({ reason: "UserHTTPError" as const });
  }

  const { id, username, avatar } = await userResponse.json();

  if (!(id && username && avatar)) {
    return err({ reason: "ParseUserResponseError" as const });
  }

  const user = { id, username, avatar } as User;

  const userToken = await JWT.sign(user);

  return ok({
    access_token,
    user_token: userToken,
    user,
  } as GetDiscordTokenResponseData);
};

export { getDiscordTokenService };
