import type { Client } from "@colyseus/sdk";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type useDiscord from "@/hooks/useDiscord";

type RouterContext = {
  discord: ReturnType<typeof useDiscord>;
  colyseusClient: Client;
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
