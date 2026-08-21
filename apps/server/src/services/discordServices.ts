import { JWT } from "@colyseus/auth";

import { getDiscordTokenResponseDataSchema } from "@mahjong/shared/api/getDiscordToken";

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
    }
  );

  if (!accessTokenResponse.ok) {
    return err({ reason: "AccessTokenHTTPError" as const });
  }

  const { access_token } = await accessTokenResponse.json();

  if (!access_token) {
    return err({ reason: "InvalidAccessTokenResponse" as const });
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

  const { id, global_name, username, avatar } = await userResponse.json();

  if (!(id && username)) {
    return err({ reason: "InvalidUserResponse" as const });
  }

  const user = { id, username: global_name ?? username, avatar };

  const userToken = await JWT.sign(user);

  const parsedResponseData = getDiscordTokenResponseDataSchema.safeParse({
    access_token,
    user_token: userToken,
    user,
  });

  if (!parsedResponseData.success) {
    return err({ reason: "InvalidResponseData" as const });
  }

  return ok(parsedResponseData.data);
};

export { getDiscordTokenService };
