import React, { lazy, Suspense } from "react";

// Loading component
const Loading = () => <div>Carregando...</div>;

// Wrapper for lazy components
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
);

// Public routes - no authentication required
const Index = lazy(() => import("../../pages/Index").then(m => ({ default: m.Component })));
const Auth = lazy(() => import("../../pages/Auth").then(m => ({ default: m.Component })));
const AuthCallback = lazy(() => import("../../pages/AuthCallback").then(m => ({ default: m.Component })));
const LandingWaitlist = lazy(() => import("../../pages/LandingWaitlist").then(m => ({ default: m.Component })));
const WaitlistAB = lazy(() => import("../../pages/WaitlistAB").then(m => ({ default: m.Component })));
const Success = lazy(() => import("../../pages/Success").then(m => ({ default: m.Component })));
const Blog = lazy(() => import("../../pages/Blog").then(m => ({ default: m.Component })));
const BlogPost = lazy(() => import("../../pages/BlogPost").then(m => ({ default: m.Component })));
const NotFound = lazy(() => import("../../pages/NotFound").then(m => ({ default: m.Component })));

export const publicRoutes = [
  {
    path: "/",
    element: (
      <LazyWrapper>
        <Index />
      </LazyWrapper>
    ),
  },
  {
    path: "/auth",
    element: (
      <LazyWrapper>
        <Auth />
      </LazyWrapper>
    ),
  },
  {
    path: "/auth/callback",
    element: (
      <LazyWrapper>
        <AuthCallback />
      </LazyWrapper>
    ),
  },
  {
    path: "/waitlist",
    element: (
      <LazyWrapper>
        <LandingWaitlist />
      </LazyWrapper>
    ),
  },
  {
    path: "/waitlist-ab",
    element: (
      <LazyWrapper>
        <WaitlistAB />
      </LazyWrapper>
    ),
  },
  {
    path: "/success",
    element: (
      <LazyWrapper>
        <Success />
      </LazyWrapper>
    ),
  },
  {
    path: "/blog",
    element: (
      <LazyWrapper>
        <Blog />
      </LazyWrapper>
    ),
  },
  {
    path: "/blog/:slug",
    element: (
      <LazyWrapper>
        <BlogPost />
      </LazyWrapper>
    ),
  },
];
