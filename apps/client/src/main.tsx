import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import useDiscord from "@/hooks/useDiscord";
import DiscordProvider from "@/contexts/DiscordProvider";
import "./index.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    discord: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const discord = useDiscord();
  return <RouterProvider router={router} context={{ discord }} />;
};

const App = () => {
  return (
    <DiscordProvider>
      <InnerApp />
    </DiscordProvider>
  );
};

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
