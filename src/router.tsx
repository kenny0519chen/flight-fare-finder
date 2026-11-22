import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Link,
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  useRouteError,
  type LoaderFunction,
} from "react-router";

import { AUTHENTICATED_ROUTE_ID, type AuthenticatedData } from "@/lib/auth-route";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "@/pages/Landing";
import AuthPage from "@/pages/Auth";
import DashboardPage from "@/pages/Dashboard";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollRestoration />
      <Outlet />
    </QueryClientProvider>
  );
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "react_router_root_error_element" });
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/** Guards /app: only signed-in users get through, everyone else goes to /sign-in. */
const requireUser: LoaderFunction = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect("/sign-in");
  return { user: data.user } satisfies AuthenticatedData;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    // Rendered while the first navigation's loaders (the auth check) run.
    hydrateFallbackElement: null,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/sign-in", element: <AuthPage mode="signin" /> },
      { path: "/sign-up", element: <AuthPage mode="signup" /> },
      {
        id: AUTHENTICATED_ROUTE_ID,
        loader: requireUser,
        element: <Outlet />,
        children: [{ path: "/app", element: <DashboardPage /> }],
      },
      // Old URLs from the TanStack Start version.
      { path: "/auth", element: <Navigate to="/sign-in" replace /> },
      { path: "/dashboard", element: <Navigate to="/app" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
