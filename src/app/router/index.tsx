import { createBrowserRouter, type RouteObject, Outlet, Navigate } from "react-router-dom";
import { publicRoutes } from "./public";
import { appRoutes } from "./app";
import { adminRoutes } from "./admin";
import { RouteTracker } from "@/components/RouteTracker";

// Root layout component that includes RouteTracker
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <RouteTracker />
    {children}
  </>
);

type HostMode = "landing" | "app" | "admin";

const getHostMode = (): HostMode => {
  if (typeof window === "undefined") return "landing";
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("admin.")) return "admin";
  if (host.startsWith("app.")) return "app";
  return "landing";
};

const buildRoutesForMode = (mode: HostMode): RouteObject[] => {
  const publicRoot = publicRoutes.find((route) => route.path === "/");
  const publicOther = publicRoutes.filter((route) => route.path !== "/");

  const rootRoute: RouteObject =
    mode === "landing" && publicRoot
      ? publicRoot
      : {
          path: "/",
          element: (
            <Navigate
              to={mode === "admin" ? "/admin" : "/dashboard"}
              replace
            />
          ),
        };

  return [
    rootRoute,
    ...publicOther,
    ...(mode === "app" ? appRoutes : []),
    ...(mode === "admin" ? adminRoutes : []),
  ];
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <RootLayout>
        <Outlet />
      </RootLayout>
    ),
    children: buildRoutesForMode(getHostMode()),
  },
  {
    path: "*",
    element: (
      <RootLayout>
        <div>Página não encontrada</div>
      </RootLayout>
    ),
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  }
});
