# Inventory Management System

## Overview

This repository contains a full-stack inventory management application built with React on the frontend and Express on the backend. The application features a modern UI with shadcn/ui components, database integration via Drizzle ORM, and state management using React Context.

The system allows users to manage inventory items, track stock levels, and view statistics about their inventory. Currently, only the core inventory functionality is fully implemented, with placeholders for future features like suppliers, orders, and outputs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework**: React with TypeScript
- **Routing**: wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Animations**: Framer Motion for UI animations
- **HTTP Client**: TanStack Query for data fetching

The frontend is structured with a component-based architecture, separating UI components, page components, and context providers. The application follows a clean, responsive design that works well on both desktop and mobile devices.

### Backend

- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Authentication**: Not yet implemented, but schema exists
- **API Structure**: RESTful API with JSON responses

The backend follows a lightweight structure with routes and controllers separated for maintainability. The server handles API requests and provides data to the frontend.

### Data Layer

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (via Neon serverless)
- **Schema**: Simple users table defined in schema.ts

Currently, the application is using in-memory storage for demonstration purposes but is set up to use PostgreSQL with Drizzle ORM for production.

## Key Components

1. **Inventory Management**
   - Display of inventory items in a tabular format
   - Ability to add, edit, and delete inventory items
   - Filtering and searching functionality
   - Low stock warnings

2. **Dashboard/Statistics**
   - Overview of inventory metrics
   - Visual representations of inventory status

3. **Navigation**
   - Sidebar for navigation between main sections
   - Top navbar with search functionality

4. **UI Components**
   - Comprehensive set of shadcn/ui components for consistent UI
   - Modal dialogs for item creation/editing
   - Toast notifications for user feedback

## Data Flow

1. **User Interactions**
   - User interacts with the frontend components
   - Actions dispatched through context API methods
   - UI updates reactively

2. **API Communication**
   - Frontend makes API requests to backend endpoints
   - TanStack Query handles data fetching, caching, and state
   - Backend processes requests and returns JSON responses

3. **Data Persistence**
   - Backend uses Drizzle ORM to interact with the database
   - Currently using in-memory storage, will transition to PostgreSQL

## External Dependencies

### Frontend
- shadcn/ui components (based on Radix UI)
- TanStack React Query
- Framer Motion
- Tailwind CSS
- wouter (for routing)

### Backend
- Express.js
- Drizzle ORM
- @neondatabase/serverless (for PostgreSQL connection)

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Build Process**
   - Vite for frontend build
   - esbuild for backend transpilation

2. **Runtime Environment**
   - Node.js for server execution
   - Serving static assets from the build directory

3. **Database**
   - PostgreSQL database (via Replit's database module)
   - Connection established through environment variables

4. **Scaling**
   - Configured for auto-scaling via Replit deployment settings

## Development Workflow

1. **Local Development**
   - Run `npm run dev` for development with hot-reloading
   - Frontend served through Vite's development server
   - Backend runs concurrently with frontend

2. **Database Migrations**
   - Use Drizzle Kit for schema migrations (`npm run db:push`)

3. **Production Build**
   - `npm run build` generates optimized frontend and backend bundles
   - `npm run start` runs the production build