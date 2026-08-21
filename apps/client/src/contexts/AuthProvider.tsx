import type { Client } from "@colyseus/sdk";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { type ReactNode, useEffect, useRef, useState } from "react";

import {
  GET_DISCORD_TOKEN_ROUTE,
  getDiscordTokenRequestBodySchema,
  getDiscordTokenResponseDataSchema,
} from "@mahjong/shared/api/getDiscordToken";
import type { User } from "@mahjong/shared/types/user";

import { env } from "@/env";

import type { Config } from "../../../server/src/app.config";
import AuthContext, { type AuthContextType } from "./AuthContext";

type AuthProviderProps = {
  colyseusClient: Client<Config>;
  discordSdk: DiscordSDK;
  children: ReactNode;
};

const AuthProvider = ({
  colyseusClient,
  discordSdk,
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInitialized = useRef<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect callback should only invoke once
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const initialize = async () => {
      setIsLoading(true);

      try {
        const { code } = await discordSdk.commands.authorize({
          client_id: env.VITE_DISCORD_CLIENT_ID,
          response_type: "code",
          state: "",
          prompt: "none",
          scope: ["identify", "guilds", "applications.commands"],
        });

        const parsedRequestBody = getDiscordTokenRequestBodySchema.safeParse({
          code,
        });

        if (!parsedRequestBody.success) {
          throw new Error(
            `Invalid request for ${GET_DISCORD_TOKEN_ROUTE}: ${parsedRequestBody.error.message}`
          );
        }

        const { data } = await colyseusClient.http.post(
          GET_DISCORD_TOKEN_ROUTE,
          {
            body: parsedRequestBody.data,
          }
        );

        const parsedResponse =
          getDiscordTokenResponseDataSchema.safeParse(data);

        if (!parsedResponse.success) {
          throw new Error(
            `Malformed response from ${GET_DISCORD_TOKEN_ROUTE}: ${parsedResponse.error.message}`
          );
        }

        const { access_token, user_token, user } = parsedResponse.data;

        await discordSdk.commands.authenticate({
          access_token,
        });

        colyseusClient.auth.token = user_token;

        setUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
