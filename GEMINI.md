# Regras Centrais

- A partir de agora, eu devo responder apenas em português e pensar em português para que você possa ver tudo o que eu planejo e estou fazendo. Esta será uma regra central.

# Project: StorySpark

## Project Overview

StorySpark is a SaaS platform built with React, TypeScript, and Vite, designed for AI-powered copywriting. It leverages Supabase for its backend, including database, authentication, and storage. The frontend is styled with Tailwind CSS and uses shadcn/ui for components. The project is well-structured, with a clear separation of concerns between UI components, pages, hooks, and services.

## Building and Running

To get the project running locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080`.

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Lint the code:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **Styling:** Tailwind CSS is used for styling, with a custom theme defined in `tailwind.config.ts`.
*   **Components:** Reusable UI components are located in `src/components`.
*   **State Management:** The project uses a combination of React's Context API and is prepared for TanStack Query (`@tanstack/react-query`).
*   **Routing:** React Router DOM v6 is used for routing, with routes defined in the `src/App.tsx` file.
*   **Backend:** Supabase is used for the backend. The Supabase client is initialized in `src/lib/supabase.ts`.
*   **PWA:** The project is configured as a Progressive Web App (PWA) using the `vite-plugin-pwa` plugin.