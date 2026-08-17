import type { Client } from "@colyseus/sdk";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { type ReactNode, useEffect, useState } from "react";

import { env } from "@/env";
import type { User } from "@/types/auth";

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

  useEffect(() => {
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

        const {
          data: { access_token, user_token, user },
        } = await colyseusClient.http.post("/discord/token", {
          headers: {
            accept: "application/json",
          },
          body: JSON.stringify({
            code,
          }),
        });

        if (!(access_token && user_token)) {
          throw new Error("Failed to retrieve tokens");
        }

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
        console.error("Failed to initialize Discord SDK", e);
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
