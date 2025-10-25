import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { AbilityContext } from "@/shared/components/can";
import { ability } from "@/shared/api/ability";
import { Toaster } from "@/shared/components/ui/sonner";
import { Loader } from "@/shared/components/app-ui/loader";
import { queryClient } from "@/shared/lib/query-client";
import { useBootstrapAuth } from "@/features/auth";

import { routeTree } from "./routeTree.gen";

import "@fontsource-variable/geist/index.css";
import "./styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }

  interface StaticDataRouteOption {
    // Protected is assumed by default
    access?: "protected" | "public" | "guest-only";
  }
}

// Fetch auth state
function App() {
  const { isReady, isAuthenticated } = useBootstrapAuth();

  if (!isReady) {
    return (
      <div className="centered min-h-svh">
        <Loader />
      </div>
    );
  }

  return <RouterProvider router={router} context={{ isAuthenticated }} />;
}

// Render the application
createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AbilityContext value={ability}>
          <App />
          <Toaster richColors />
        </AbilityContext>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
