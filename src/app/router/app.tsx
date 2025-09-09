import { lazy } from "react";
import { RouteObject, Outlet } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

// App routes - authentication required
export const appRoutes: RouteObject[] = [
  {
    path: "",
    element: (
      <ProtectedRoute>
        <AppLayout><Outlet /></AppLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const { Component } = await import("../../pages/Dashboard");
          return { Component };
        },
      },
      {
        path: "composer",
        lazy: async () => { const { Component } = await import("../../pages/Composer"); return { Component }; },
      },
      {
        path: "campaigns",
        lazy: async () => { const { Component } = await import("../../pages/Campaigns"); return { Component }; },
      },
      {
        path: "calendar",
        lazy: async () => { const { Component } = await import("../../pages/Calendar"); return { Component }; },
      },
      {
        path: "analytics",
        lazy: async () => { const { Component } = await import("../../pages/Analytics"); return { Component }; },
      },
      {
        path: "personas",
        lazy: async () => { const { Component } = await import("../../pages/Personas"); return { Component }; },
      },
      {
        path: "settings",
        lazy: async () => { const { Component } = await import("../../pages/Settings"); return { Component }; },
      },
      {
        path: "brand-voices",
        lazy: async () => { const { Component } = await import("../../pages/BrandVoices"); return { Component }; },
      },
      {
        path: "templates",
        lazy: async () => { const { Component } = await import("../../pages/Templates"); return { Component }; },
      },
      {
        path: "integrations",
        lazy: async () => { const { Component } = await import("../../pages/Integrations"); return { Component }; },
      },
      {
        path: "team",
        lazy: async () => { const { Component } = await import("../../pages/Team"); return { Component }; },
      },
      {
        path: "billing",
        lazy: async () => { const { Component } = await import("../../pages/Billing"); return { Component }; },
      },
      {
        path: "voices",
        lazy: async () => { const { Component } = await import("../../pages/Voices"); return { Component }; },
      },
      {
        path: "import-data",
        lazy: async () => { const { Component } = await import("../../pages/ImportData"); return { Component }; },
      },
      {
        path: "copies-history",
        lazy: async () => { const { Component } = await import("../../pages/CopiesHistory"); return { Component }; },
      },
      // Specialized pages
      {
        path: "email-marketing",
        lazy: async () => { const { Component } = await import("../../pages/EmailMarketing"); return { Component }; },
      },
      {
        path: "social-scheduler",
        lazy: async () => { const { Component } = await import("../../pages/SocialScheduler"); return { Component }; },
      },
      {
        path: "landing-pages",
        lazy: async () => { const { Component } = await import("../../pages/LandingPages"); return { Component }; },
      },
      {
        path: "push-whatsapp",
        lazy: async () => { const { Component } = await import("../../pages/PushWhatsApp"); return { Component }; },
      },
      {
        path: "funnels",
        lazy: async () => { const { Component } = await import("../../pages/Funnels"); return { Component }; },
      },
      {
        path: "ab-tests",
        lazy: async () => { const { Component } = await import("../../pages/ABTests"); return { Component }; },
      },
      {
        path: "call-scripts",
        lazy: async () => { const { Component } = await import("../../pages/CallScripts"); return { Component }; },
      },
      {
        path: "content-library",
        lazy: async () => { const { Component } = await import("../../pages/ContentLibrary"); return { Component }; },
      },
      {
        path: "ai-ideas",
        lazy: async () => { const { Component } = await import("../../pages/AIIdeas"); return { Component }; },
      },
      {
        path: "trending-hooks",
        lazy: async () => { const { Component } = await import("../../pages/TrendingHooks"); return { Component }; },
      },
      {
        path: "hooks",
        lazy: async () => { const { Component } = await import("../../pages/Hooks"); return { Component }; },
      },
      {
        path: "crm",
        lazy: async () => { const { Component } = await import("../../pages/CRM"); return { Component }; },
      },
      {
        path: "feedback",
        lazy: async () => { const { Component } = await import("../../pages/Feedback"); return { Component }; },
      },
    ]
  },
];
