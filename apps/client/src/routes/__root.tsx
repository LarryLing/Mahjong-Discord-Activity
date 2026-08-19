import type { Client } from "@colyseus/sdk";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type useAuth from "@/hooks/useAuth";
import type useTheme from "@/hooks/useTheme";

type RouterContext = {
  theme: ReturnType<typeof useTheme>;
  auth: ReturnType<typeof useAuth>;
  colyseusClient: Client;
  discordSdk: DiscordSDK;
};

const RootComponent = () => {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
