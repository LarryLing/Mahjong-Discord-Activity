import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type useAuth from "@/hooks/useAuth";
import type useTheme from "@/hooks/useTheme";

type RouterContext = {
  theme: ReturnType<typeof useTheme>;
  auth: ReturnType<typeof useAuth>;
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
