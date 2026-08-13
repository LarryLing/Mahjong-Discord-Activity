import { DiscordSDK } from "@discord/embedded-app-sdk";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { env } from "@/env";
import type { User } from "@/types/discord";

import DiscordContext, { type DiscordContextType } from "./DiscordContext";

type DiscordProviderProps = {
  children: ReactNode;
};

const DiscordProvider = ({ children }: DiscordProviderProps) => {
  const discordSdkRef = useRef<DiscordSDK | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      setIsLoading(true);

      try {
        const discordSdk = new DiscordSDK(env.VITE_DISCORD_CLIENT_ID);
        await discordSdk.ready();
        discordSdkRef.current = discordSdk;

        const { code } = await discordSdkRef.current.commands.authorize({
          client_id: env.VITE_DISCORD_CLIENT_ID,
          response_type: "code",
          state: "",
          prompt: "none",
          scope: ["identify", "guilds", "applications.commands"],
        });

        const tokenResponse = await fetch("/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
          }),
        });

        const { access_token } = await tokenResponse.json();

        const authResult = await discordSdkRef.current.commands.authenticate({
          access_token,
        });

        if (!authResult) {
          throw new Error("Failed to retrieve auth result");
        }

        setUser(authResult.user);
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

    initializeSdk();
  }, []);

  const value: DiscordContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    discordSdkRef,
  };

  return (
    <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>
  );
};

export default DiscordProvider;
