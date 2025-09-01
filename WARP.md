# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**StorySpark** is a SaaS platform for AI-powered copywriting and social media content creation. Built with React 18 + TypeScript, it features comprehensive AI integration, user management, and a sophisticated admin system for managing copy generation across multiple platforms.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev  # Runs on localhost:8080 (configured in vite.config.ts)

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Environment Setup
```bash
# Copy environment example
cp .env.Example .env
# Configure Supabase credentials in .env
```

### Testing & Verification
```bash
# Test Supabase connection
node scripts/verify_supabase.mjs

# Insert waitlist entry (admin utility)
npm run waitlist:insert -- user@example.com
```

### Database Operations
```bash
# Check waitlist statistics
node scripts/check_waitlist_stats.mjs

# Verify Supabase configuration
node scripts/verify_supabase.mjs
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18.3.1, TypeScript, Tailwind CSS
- **Build Tool**: Vite with SWC
- **UI Framework**: shadcn/ui with Radix UI primitives
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM v6
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Integration**: Multi-provider system (OpenAI, Anthropic, Gemini, OpenRouter, Kilocode)
- **Styling**: Tailwind CSS with custom design system and CSS variables

### Key Architectural Patterns

#### 1. Route Structure
The app uses a comprehensive routing system with three main categories:
- **Public Routes**: Landing pages (`/`, `/blog/*`, `/waitlist`)
- **Protected Routes**: Main application (`/dashboard`, `/composer`, `/campaigns`, etc.)
- **Admin Routes**: Administrative interface (`/admin/*`) with role-based access

#### 2. Component Organization
```
src/
├── components/
│   ├── ui/           # shadcn/ui base components (50+ components)
│   ├── layout/       # AppLayout, Headers, Sidebars
│   ├── auth/         # Authentication providers and guards
│   ├── modals/       # All modal dialogs (20+ modals)
│   ├── floating/     # Floating UI components (copy button, etc.)
│   └── debug/        # Development debugging tools
├── pages/            # Route components
├── services/         # API and business logic services
├── hooks/            # Custom React hooks
├── lib/              # Utilities and configurations
└── data/             # Static data and constants
```

#### 3. Data Layer Architecture
- **Supabase Client**: Configured in `src/lib/supabase.ts` with auth, realtime, and RLS
- **Service Layer**: Abstracted API calls in `src/services/`
- **Auth Provider**: Context-based authentication with role management
- **Real-time Features**: Supabase subscriptions for live updates

#### 4. AI Integration System
The app features a sophisticated AI system with multiple providers:
- **Dynamic Configuration**: AI settings stored in `admin_llm_settings` table
- **Provider Fallback**: Automatic failover between AI providers
- **Service Architecture**: `copyGenerationService.ts` and `aiContingencyService.ts`
- **Admin Controls**: AI provider configuration via admin panel

### Design System

#### Color System
Built on HSL CSS variables with a primary orange theme:
- Primary: `hsl(22, 100%, 55%)` (Orange)
- Background gradients and consistent spacing
- Dark mode support via CSS variables

#### Component System
- All UI components from shadcn/ui
- Custom animations with Tailwind classes
- Consistent spacing and typography scales
- Responsive design patterns

## Development Patterns

### Authentication & Authorization
- **Supabase Auth**: Email/password and OAuth (Google)
- **Role-Based Access**: User roles stored in profiles table
- **Protected Routes**: `ProtectedRoute` component with admin checks
- **Session Management**: Persistent sessions with token refresh

### State Management Patterns
- **Server State**: React Query for API data caching
- **Local State**: React useState and useContext
- **Form State**: React Hook Form with Zod validation
- **Real-time Updates**: Supabase subscriptions

### API Integration
- **Service Layer**: All API calls abstracted into service files
- **Error Handling**: Consistent error boundaries and user feedback
- **Loading States**: Comprehensive loading UIs
- **Offline Support**: PWA configuration with service worker

### Testing Strategy
- **E2E Testing**: Playwright configuration (dependency installed)
- **Integration Tests**: Supabase connection verification scripts
- **Manual Testing**: Debug components and admin testing tools
- **Calendar Testing**: Dedicated test guide in `docs/CALENDAR_TEST_GUIDE.md`

## Key Services & Integrations

### Email Service
- **Provider**: Mailtrap API
- **Templates**: Dynamic template system with variable processing
- **Edge Functions**: Supabase proxy for email sending
- **Logging**: Comprehensive email audit trail

### AI Content Generation
- **Multi-Provider Support**: OpenAI, Anthropic, Gemini, OpenRouter, Kilocode
- **Dynamic Configuration**: Database-driven provider selection
- **Contingency System**: Automatic failover between providers
- **Usage Tracking**: Token consumption and provider performance metrics

### Calendar System
- **Drag & Drop**: React Beautiful DnD integration
- **Multi-View**: Month, week, and list views
- **Platform Integration**: Color-coded platform scheduling
- **Real-time Sync**: Live updates across user sessions

### Admin System
- **User Management**: Complete CRUD for users and roles
- **Content Management**: Templates, campaigns, and blog administration
- **Analytics Dashboard**: System-wide metrics and usage statistics
- **Security Controls**: Permissions, logs, and backup management

## Development Notes

### Environment Configuration
The app requires several environment variables for full functionality:
```bash
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anon key
VITE_SUPABASE_PROJECT_ID=   # Project identifier
VITE_MAILTRAP_API_TOKEN=    # Email service token
```

### Database Schema
- **RLS Enabled**: Row Level Security for data access control
- **Edge Functions**: Custom functions for email and AI operations
- **Real-time**: Subscriptions enabled for live features
- **Audit Trails**: Comprehensive logging for admin operations

### Performance Optimizations
- **Lazy Loading**: Route-based code splitting with React.lazy
- **Bundle Optimization**: Vite with SWC for fast builds
- **PWA**: Service worker with caching strategies
- **Image Optimization**: Responsive images and lazy loading

### Security Considerations
- **Authentication**: Supabase Auth with PKCE flow
- **Authorization**: Role-based access with RLS policies
- **API Security**: Service-role keys for backend operations
- **Input Validation**: Zod schemas for all form inputs

## Common Development Tasks

### Adding New Routes
1. Create page component in `src/pages/`
2. Add lazy import in `App.tsx`
3. Configure route with proper protection level
4. Update sidebar navigation if needed

### Adding New Components
1. Use shadcn/ui CLI: `npx shadcn-ui@latest add [component]`
2. Place business components in appropriate `src/components/` subdirectory
3. Follow existing patterns for props and styling

### Database Changes
1. Update via Supabase dashboard or migrations
2. Update TypeScript types if needed
3. Test with verification scripts
4. Update RLS policies for new tables

### AI Provider Integration
1. Add provider configuration to `admin_llm_settings` table
2. Update `aiContingencyService.ts` with new provider logic
3. Test through admin panel AI configuration
4. Monitor via system logs

### Debugging Tools
- **Auth Debug**: `/components/debug/AuthDebug.tsx` for auth issues
- **Route Debug**: Built-in route debugging components
- **Supabase Test**: Multiple diagnostic components for database connectivity
- **Admin Tools**: Comprehensive admin interface for system monitoring

This codebase follows modern React patterns with a focus on scalability, maintainability, and comprehensive feature sets for a production SaaS application.
