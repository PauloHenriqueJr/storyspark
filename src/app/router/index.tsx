import { createBrowserRouter, type RouteObject, Outlet, Navigate } from "react-router-dom";
import { useEffect } from "react";
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

const isLocalHost = (host: string) => {
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "[::1]" ||
    /^[0-9.]+$/.test(host)
  );
};

const getHostMode = (): HostMode => {
  if (typeof window === "undefined") return "landing";
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith("admin.")) return "admin";
  if (host.startsWith("app.")) return "app";
  if (isLocalHost(host)) return "app";
  return "landing";
};

const buildSubdomainUrl = (target: "app" | "admin") => {
  const { protocol, hostname, port, pathname, search, hash } = window.location;
  const baseHost = hostname.replace(/^(app|admin)\./, "");
  const targetHost = hostname.startsWith(`${target}.`) ? hostname : `${target}.${baseHost}`;
  const portSuffix = port ? `:${port}` : "";
  return `${protocol}//${targetHost}${portSuffix}${pathname}${search}${hash}`;
};

const SubdomainRedirect = ({ target }: { target: "app" | "admin" }) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const targetUrl = buildSubdomainUrl(target);
    if (window.location.href !== targetUrl) {
      window.location.replace(targetUrl);
    }
  }, [target]);

  return <div>Redirecionando...</div>;
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

  const redirectRoutes: RouteObject[] = [
    ...(mode !== "app"
      ? [
          {
            path: "dashboard/*",
            element: <SubdomainRedirect target="app" />,
          },
        ]
      : []),
    ...(mode !== "admin"
      ? [
          {
            path: "admin/*",
            element: <SubdomainRedirect target="admin" />,
          },
        ]
      : []),
  ];

  return [
    rootRoute,
    ...publicOther,
    ...(mode === "app" ? appRoutes : []),
    ...(mode === "admin" ? adminRoutes : []),
    ...redirectRoutes,
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
