import { lazy } from "react";
import { RouteObject, Outlet } from "react-router-dom";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

// Admin routes - admin authentication required
export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <AppLayout><Outlet /></AppLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminDashboard"); return { Component }; },
      },
      {
        path: "users",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminUsers"); return { Component }; },
      },
      {
        path: "managers",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminManagers"); return { Component }; },
      },
      {
        path: "settings",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminSettings"); return { Component }; },
      },
      {
        path: "blog",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminBlog"); return { Component }; },
      },
      {
        path: "campaigns",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminCampaigns"); return { Component }; },
      },
      {
        path: "templates",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminTemplates"); return { Component }; },
      },
      {
        path: "analytics",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminAnalytics"); return { Component }; },
      },
      {
        path: "logs",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminLogs"); return { Component }; },
      },
      {
        path: "integrations",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminIntegrations"); return { Component }; },
      },
      {
        path: "billing",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminBillingGlobal"); return { Component }; },
      },
      {
        path: "security",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminSecurity"); return { Component }; },
      },
      {
        path: "permissions",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminPermissions"); return { Component }; },
      },
      {
        path: "backup",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminBackup"); return { Component }; },
      },
      {
        path: "waitlist",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminWaitlist"); return { Component }; },
      },
      {
        path: "jobs",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminJobs"); return { Component }; },
      },
      {
        path: "email-templates",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminEmailTemplates"); return { Component }; },
      },
      {
        path: "plans",
        lazy: async () => { const { Component } = await import("../../pages/AdminPlans"); return { Component }; },
      },
      {
        path: "feature-flags",
        lazy: async () => { const { Component } = await import("../../pages/admin/AdminFeatureFlags"); return { Component }; },
      },
    ]
  },
];

