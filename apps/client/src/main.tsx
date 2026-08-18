import { Client } from "@colyseus/sdk";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDom from "react-dom/client";
import type { Config } from "../../server/src/app.config";

import { env } from "@/env";
import AuthProvider from "@/contexts/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { routeTree } from "@/routeTree.gen";
import "./index.css";

const colyseusClient = new Client<Config>("ws://localhost:3000");

const discordSdk = new DiscordSDK(env.VITE_DISCORD_CLIENT_ID);
await discordSdk.ready();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    auth: undefined!,
    colyseusClient,
    discordSdk,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();
  return (
    <RouterProvider
      context={{ auth, colyseusClient, discordSdk }}
      router={router}
    />
  );
};

const App = () => {
  return (
    <AuthProvider colyseusClient={colyseusClient} discordSdk={discordSdk}>
      <InnerApp />
    </AuthProvider>
  );
};

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDom.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
