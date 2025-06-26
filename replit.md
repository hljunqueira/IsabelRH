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
4. **Admin Flow**: Isabel can manage all users, create services, proposals, and view comprehensive analytics
5. **Talent Banking**: Potential candidates can register interest without full registration
6. **Contact System**: General inquiries are captured through contact forms

## Administrative Features

The platform now includes a comprehensive administrative dashboard for Isabel Cunha:

### Dashboard Analytics
- Real-time statistics for candidates, companies, jobs, and services
- Financial tracking with revenue estimation
- Service status monitoring (pending, in progress, completed)
- Proposal management with approval workflows

### User Management
- Complete oversight of all registered candidates and companies
- User profile management and deletion capabilities
- Activity tracking and engagement metrics

### Service Management
- Create and manage consultancy services (recruitment, selection, HR consulting, training, evaluation)
- Track service progress with status updates
- Set pricing and manage service delivery timelines
- Service portfolio management with detailed descriptions

### Proposal System
- Create commercial proposals for potential clients
- Set proposed values and delivery timelines
- Approval workflow management (approve/reject proposals)
- Proposal tracking and follow-up system

### Reporting & Analytics
- Monthly, quarterly, and annual performance reports
- Revenue tracking and financial analytics
- Success rate calculations and business metrics
- Comprehensive business intelligence dashboard

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
- June 26, 2025. Replaced generic user icon with Isabel Cunha's professional photo as logo on login page, matching Navigation component styling
- June 26, 2025. Created comprehensive administrative dashboard with user management, service tracking, proposal system, and business analytics
- June 26, 2025. Integrated admin login into main login page and added test users for easy system testing
- June 26, 2025. Enhanced company area with extensive profile fields (25+ fields including corporate data, mission/vision, benefits)
- June 26, 2025. Improved job posting modal with comprehensive details (area, level, contract type, benefits, responsibilities)
- June 26, 2025. Added advanced candidate management system with application tracking and status management
- June 26, 2025. Consolidated candidate profile into single unified interface removing redundancy between "Meu Perfil" and "Perfil Completo"
- June 26, 2025. Added avatar upload functionality for candidates and logo upload for companies
- June 26, 2025. Enhanced database schema with photo/logo storage and advanced job/candidate tracking fields
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```