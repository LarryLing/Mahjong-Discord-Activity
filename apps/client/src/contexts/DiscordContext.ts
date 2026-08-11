import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { createContext, type RefObject } from "react";
import type { User } from "@/types/discord";

export type DiscordContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  discordSdkRef: RefObject<DiscordSDK | null>;
};

const DiscordContext = createContext<DiscordContextType | null>(null);

export default DiscordContext;
