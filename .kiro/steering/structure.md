# StorySpark Project Structure

## Source Code Organization

### Main Directories
```
src/
├── components/          # Reusable React components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks
├── services/           # Business logic and API calls
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── integrations/       # External service integrations
├── contexts/           # React context providers
└── assets/             # Static images and resources
```

## Component Architecture

### UI Components (`src/components/ui/`)
- Base components from Shadcn/ui (Button, Input, Card, etc.)
- Consistent styling with Tailwind CSS
- Radix UI primitives for accessibility

### Feature Components (`src/components/`)
```
layout/          # App layout components (Header, Sidebar, Footer)
modals/          # Modal dialogs for various features
auth/            # Authentication-related components
analytics/       # Analytics and chart components
calendar/        # Calendar functionality
search/          # Global search components
templates/       # Template management components
```

## Page Structure (`src/pages/`)

### Public Routes
- `Index.tsx` - Landing page
- `Modern.tsx` - Alternative landing page
- `Blog.tsx` - Blog listing
- `Auth.tsx` - Authentication page

### Protected Routes (Client Dashboard)
- `Dashboard.tsx` - Main dashboard
- `Composer.tsx` - AI copy editor
- `Campaigns.tsx` - Campaign management
- `Analytics.tsx` - Performance analytics
- `Personas.tsx` - Persona management
- `Templates.tsx` - Template library

### Admin Routes (`src/pages/admin/`)
- Role-based access control
- Super admin functionality
- System management pages

## Routing Conventions

### Route Structure
```
/                    # Public landing page
/dashboard          # Client dashboard
/admin/*            # Admin-only routes
/auth               # Authentication
```

### Route Protection
- Public routes: No authentication required
- Protected routes: Require user authentication
- Admin routes: Require admin role permissions

## Import Conventions
- Use `@/` alias for all src/ imports
- Relative imports only for same-directory files
- Group imports: external libraries, internal modules, relative imports

## File Naming
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.tsx`)
- Services: camelCase with `Service` suffix (e.g., `authService.ts`)
- Types: camelCase (e.g., `userTypes.ts`)

## State Management Patterns
- Local state: useState for component-level state
- Global state: React Context for app-wide state
- Server state: React Query for API data caching
- Form state: React Hook Form with Zod validation