import type { Client } from "@colyseus/sdk";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import type { GetDiscordTokenRequestBody } from "@shared/api-contracts";
import type { User } from "@shared/types";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { env } from "@/env";
import { apiFetch } from "@/lib/apiFetch";

import AuthContext, { type AuthContextType } from "./AuthContext";

type AuthProviderProps = {
  colyseusClient: Client;
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

        const requestBody = { code } as GetDiscordTokenRequestBody;

        const { access_token, user_token, user } = await apiFetch(
          "/discord/token",
          requestBody
        );

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
