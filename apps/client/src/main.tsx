import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDom from "react-dom/client";

import AuthProvider from "@/contexts/AuthProvider";
import ThemeProvider from "@/contexts/ThemeProvider";
import useAuth from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { routeTree } from "@/routeTree.gen";
import "./index.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
  context: {
    theme: { theme: "dark", setTheme: () => null },
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const auth = useAuth();
  const theme = useTheme();

  return <RouterProvider context={{ theme, auth }} router={router} />;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
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
