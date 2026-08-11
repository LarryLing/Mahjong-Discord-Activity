import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type useDiscord from "@/hooks/useDiscord";

type RouterContext = {
  discord: ReturnType<typeof useDiscord>;
};

const RootComponent = () => {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
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
