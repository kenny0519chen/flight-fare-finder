import type { User } from "@supabase/supabase-js";

/** Route id of the layout route that guards signed-in pages (see src/router.tsx). */
export const AUTHENTICATED_ROUTE_ID = "authenticated";

/** Data returned by the guard's loader, read with useRouteLoaderData(AUTHENTICATED_ROUTE_ID). */
export type AuthenticatedData = { user: User };
