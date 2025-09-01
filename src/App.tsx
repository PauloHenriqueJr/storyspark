import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppWrapper } from "@/components/layout/AppWrapper";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

// Lazy load pages for better performance
import React, { Suspense } from 'react';
import { LazyLoadWrapper } from "@/components/performance/LazyLoadWrapper";

// Landing and Public Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import LandingWaitlist from "./pages/LandingWaitlist";

// Blog Pages
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

// Lazy load main app pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Composer = React.lazy(() => import('./pages/Composer'));
const Campaigns = React.lazy(() => import('./pages/Campaigns'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Personas = React.lazy(() => import('./pages/Personas'));
const Settings = React.lazy(() => import('./pages/Settings'));
const BrandVoices = React.lazy(() => import('./pages/BrandVoices'));
const Templates = React.lazy(() => import('./pages/Templates'));
const Integrations = React.lazy(() => import('./pages/Integrations'));
const Team = React.lazy(() => import('./pages/Team'));
const Billing = React.lazy(() => import('./pages/Billing'));
const Voices = React.lazy(() => import('./pages/Voices'));

// Lazy load specialized pages
const AdminSeedInserter = React.lazy(() => import('./components/AdminSeedInserter'));
const TestCalendar = React.lazy(() => import('./pages/TestCalendar'));
const EmailMarketing = React.lazy(() => import('./pages/EmailMarketing'));
const SocialScheduler = React.lazy(() => import('./pages/SocialScheduler'));
const LandingPages = React.lazy(() => import('./pages/LandingPages'));
const PushWhatsApp = React.lazy(() => import('./pages/PushWhatsApp'));
const Funnels = React.lazy(() => import('./pages/Funnels'));
const ABTests = React.lazy(() => import('./pages/ABTests'));
const CallScripts = React.lazy(() => import('./pages/CallScripts'));
const ContentLibrary = React.lazy(() => import('./pages/ContentLibrary'));
const AIIdeas = React.lazy(() => import('./pages/AIIdeas'));
const TrendingHooks = React.lazy(() => import('./pages/TrendingHooks'));
const CRM = React.lazy(() => import('./pages/CRM'));
const Feedback = React.lazy(() => import('./pages/Feedback'));
const TestUploadPage = React.lazy(() => import('./pages/TestUploadPage'));

// Lazy load admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminManagers = React.lazy(() => import('./pages/admin/AdminManagers'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminBlog = React.lazy(() => import('./pages/admin/AdminBlog'));
const AdminCampaigns = React.lazy(() => import('./pages/admin/AdminCampaigns'));
const AdminTemplates = React.lazy(() => import('./pages/admin/AdminTemplates'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminLogs = React.lazy(() => import('./pages/admin/AdminLogs'));
const AdminIntegrations = React.lazy(() => import('./pages/admin/AdminIntegrations'));
const AdminBillingGlobal = React.lazy(() => import('./pages/admin/AdminBillingGlobal'));
const AdminSecurity = React.lazy(() => import('./pages/admin/AdminSecurity'));
const AdminPermissions = React.lazy(() => import('@/pages/admin/AdminPermissions'));
const AdminTest = React.lazy(() => import('@/pages/admin/AdminTest'));
const AdminBackup = React.lazy(() => import('./pages/admin/AdminBackup'));
const AdminWaitlist = React.lazy(() => import('./pages/admin/AdminWaitlist'));
const AdminJobs = React.lazy(() => import('./pages/admin/AdminJobs'));
const AdminEmailTemplates = React.lazy(() => import('./pages/admin/AdminEmailTemplates'));

// Calendar Wrapper Component
const CalendarWrapper = () => {
  const [scheduleModalHandler, setScheduleModalHandler] = React.useState<((copyContent: string, platform: string, copyType: string) => void) | null>(null);

  const handleOpenScheduleModal = (copyContent: string, platform: string, copyType: string) => {
    if (scheduleModalHandler) {
      scheduleModalHandler(copyContent, platform, copyType);
    }
  };

  return (
    <AppLayout onOpenScheduleModal={handleOpenScheduleModal}>
      <LazyLoadWrapper>
        <Calendar onScheduleModalReady={setScheduleModalHandler} />
      </LazyLoadWrapper>
    </AppLayout>
  );
};

const App = () => (
  <AppWrapper>
    <OnboardingModal />
    
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/waitlist" element={<LandingWaitlist />} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      
      {/* Test Routes */}
      <Route path="/test-calendar" element={<TestCalendar />} />
      <Route path="/test-upload" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <TestUploadPage />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      
  {/* Auth Routes - Apenas /auth */}
  <Route path="/auth" element={<Auth />} />
  <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected App Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Dashboard />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/composer" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Composer />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/campaigns" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Campaigns />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <CalendarWrapper />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Analytics />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/personas" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Personas />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Settings />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/brand-voices" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <BrandVoices />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/templates" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Templates />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/integrations" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Integrations />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Team />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Billing />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/voices" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Voices />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Specialized Pages Routes - continue with lazy loading */}
      <Route path="/email-marketing" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <EmailMarketing />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/social-scheduler" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <SocialScheduler />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/landing-pages" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <LandingPages />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/push-whatsapp" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <PushWhatsApp />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/funnels" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Funnels />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/ab-tests" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <ABTests />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/call-scripts" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <CallScripts />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/content-library" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <ContentLibrary />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/ai-ideas" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AIIdeas />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/trending-hooks" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <TrendingHooks />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/crm" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <CRM />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <Feedback />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminDashboard />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminUsers />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/managers" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminManagers />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminSettings />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/blog" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminBlog />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/campaigns" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminCampaigns />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/templates" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminTemplates />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminAnalytics />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/logs" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminLogs />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/integrations" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminIntegrations />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/billing" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminBillingGlobal />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/security" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminSecurity />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/permissions" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminPermissions />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/backup" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminBackup />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/waitlist" element={
                <ProtectedRoute adminOnly={true}>
                  <AppLayout>
                    <LazyLoadWrapper>
                      <AdminWaitlist />
                    </LazyLoadWrapper>
                  </AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
        <ProtectedRoute adminOnly={true}>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminJobs />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/email-templates" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminEmailTemplates />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Temporary route for seed insertion */}
      <Route path="/admin/seed-inserter" element={
        <ProtectedRoute>
          <AppLayout>
            <LazyLoadWrapper>
              <AdminSeedInserter />
            </LazyLoadWrapper>
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppWrapper>
);

export default App;
