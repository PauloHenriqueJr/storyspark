# StorySpark Technical Stack

## Build System & Framework
- **Build Tool**: Vite 5.4.19 with React SWC plugin for fast development
- **Framework**: React 18.3.1 with TypeScript 5.8.3 (strict mode enabled)
- **Package Manager**: npm (package-lock.json present)

## Core Technologies
- **UI Framework**: Tailwind CSS 3.4.17 with CSS variables for theming
- **Component Library**: Shadcn/ui built on Radix UI primitives
- **Routing**: React Router DOM 6.30.1 with v7 future flags enabled
- **State Management**: React Context + React Query 5.85.5 for server state
- **Animations**: Framer Motion 12.23.12
- **Icons**: Lucide React 0.462.0
- **Forms**: React Hook Form + Zod validation

## Backend Integration
- **Database**: Supabase (PostgreSQL) - integration in progress
- **Authentication**: Supabase Auth
- **Real-time**: Supabase subscriptions
- **File Storage**: Supabase Storage

## Development Tools
- **Linting**: ESLint 9.32.0 with TypeScript rules
- **Testing**: Playwright 1.55.0 for E2E testing
- **PWA**: Vite Plugin PWA with service worker and manifest
- **Type Checking**: Strict TypeScript with noImplicitAny, noUnusedLocals

## Common Commands
```bash
# Development
npm run dev              # Start dev server on localhost:8080
npm run build           # Production build
npm run build:dev       # Development build
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## Key Conventions
- Use `@/` alias for src/ imports (configured in vite.config.ts)
- CSS variables for theming (light/dark mode support)
- Strict TypeScript - avoid `any`, use `unknown` for uncertain types
- Component co-location in feature folders
- Custom hooks prefixed with `use`
- Service layer for business logic separation