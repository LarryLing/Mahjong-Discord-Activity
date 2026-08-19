import type { Client } from "@colyseus/sdk";
import type { DiscordSDK } from "@discord/embedded-app-sdk";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
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
      <div className="p-2 flex gap-2 text-lg">
        <Link
          activeOptions={{ exact: true }}
          activeProps={{
            className: "font-bold",
          }}
          to="/"
        >
          Home
        </Link>{" "}
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
