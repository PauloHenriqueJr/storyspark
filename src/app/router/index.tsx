import { createBrowserRouter, type RouteObject, Outlet } from "react-router-dom";
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

// Combine all routes
const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout><Outlet /></RootLayout>,
    children: [
      ...publicRoutes,
      ...appRoutes,
      ...adminRoutes,
    ],
  },
  {
    path: "*",
    element: <RootLayout><div>Página não encontrada</div></RootLayout>,
  }
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  }
});
