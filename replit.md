# Isabel Cunha RH - HR Consultancy Platform

## Overview

This is a full-stack web application for Isabel Cunha RH, a strategic HR consultancy firm based in Santa Catarina, Brazil. The platform serves as both a company website and a job portal, connecting candidates and companies through professional HR services. The application features user authentication, job management, talent banking, and contact functionality.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

- **Frontend**: React 18 with TypeScript, using Vite for build tooling
- **Backend**: Node.js with Express.js, TypeScript-based API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Authentication**: Session-based with bcrypt for password hashing

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components with TypeScript interfaces
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling System**: Tailwind CSS with custom brand colors (Isabel Orange, Isabel Blue)
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Backend Architecture
- **API Design**: RESTful endpoints organized by feature areas
- **Database Layer**: Drizzle ORM with PostgreSQL, providing type-safe queries
- **Authentication**: Session-based authentication with bcrypt password hashing
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging middleware for API requests

### Database Schema
The application uses PostgreSQL with the following main entities:
- **usuarios**: Base user table with email, password, and user type (candidato/empresa)
- **candidatos**: Extended profile for job candidates
- **empresas**: Extended profile for companies
- **vagas**: Job postings created by companies
- **candidaturas**: Job applications linking candidates to jobs
- **bancoTalentos**: Talent bank for potential candidates
- **contatos**: Contact form submissions

## Data Flow

1. **User Registration/Login**: Users can register as either candidates or companies
2. **Candidate Flow**: Candidates can view jobs, apply to positions, and manage their profiles
3. **Company Flow**: Companies can post jobs, view applications, and manage job listings
4. **Talent Banking**: Potential candidates can register interest without full registration
5. **Contact System**: General inquiries are captured through contact forms

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Database**: Drizzle ORM, Neon Database serverless driver
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Utilities**: date-fns for date handling, bcrypt for password hashing
- **Build Tools**: Vite, esbuild, TypeScript

### Development Tools
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code formatting and linting
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Build Process
- **Development**: `npm run dev` - Runs both client and server in development mode
- **Production Build**: `npm run build` - Builds client assets and bundles server code
- **Start**: `npm run start` - Runs the production server

### Environment Configuration
- **Database**: Configured for PostgreSQL via DATABASE_URL environment variable
- **Port Configuration**: Server runs on port 5000, exposed as port 80 externally
- **Asset Serving**: Static assets served from dist/public in production

### Replit-Specific Features
- **Auto-scaling deployment**: Configured for Replit's autoscale deployment target
- **Development tooling**: Cartographer integration for development workflow
- **Error handling**: Runtime error overlay for development

The application uses a dual-mode approach where Vite handles client-side development with HMR, while the Express server handles API routes and serves the built client in production.

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
- June 26, 2025. Updated "Quem Somos" page photo and added Instagram icon to navigation
- June 26, 2025. Updated WhatsApp button styling and text on contact page
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```