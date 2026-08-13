import { Client } from "@colyseus/sdk";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDom from "react-dom/client";

import DiscordProvider from "@/contexts/DiscordProvider";
import useDiscord from "@/hooks/useDiscord";
import { routeTree } from "@/routeTree.gen";
import "./index.css";

const colyseusClient = new Client("ws://localhost:3000");

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    discord: undefined!,
    colyseusClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const discord = useDiscord();
  return <RouterProvider context={{ discord }} router={router} />;
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
  const root = ReactDom.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
