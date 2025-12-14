# Dento Health Care - Dental Hospital Management System

## Overview

Dento Health Care is a comprehensive, bilingual (Arabic/English) dental hospital management system developed for Delta University's Faculty of Dentistry. The system provides full RTL (Right-to-Left) support, role-based access control, and manages 12+ specialized dental clinics with features including appointment booking, medical records, payment processing, AI-assisted diagnosis, and real-time analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **Framework**: React 18 with TypeScript for type safety and modern component patterns
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query v5 (React Query) for server state management and caching
- **Form Management**: React Hook Form with Zod validation schemas for type-safe forms

**UI/UX Framework:**
- **Component Library**: Shadcn UI (Radix UI primitives) providing accessible, unstyled components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Animations**: Framer Motion for smooth page transitions and interactive elements
- **Icons**: Lucide React for consistent iconography
- **Typography**: Cairo and IBM Plex Sans Arabic fonts for proper Arabic text rendering
- **Charts**: Recharts for interactive data visualizations

**Design System:**
- Material Design principles adapted for healthcare contexts
- Professional medical blue color scheme with 4 theme variants
- Dark mode support with automatic theme switching
- 12 unique colors for specialized clinic identification
- Consistent spacing system using Tailwind units (2, 4, 6, 8, 12, 16)
- Hover elevation effects for interactive elements
- Badge system for status indicators (active, pending, completed, etc.)
- Full RTL layout support for Arabic interface

**Responsive Design:**
- Mobile-first approach with breakpoints at 768px (tablet) and 1024px (desktop)
- Collapsible sidebar (280px fixed width on desktop)
- Touch-friendly interactions for mobile devices
- Adaptive navigation (sidebar on desktop, bottom navigation on mobile)

### Backend Architecture

**Server Technology:**
- **Framework**: Express.js with TypeScript for type-safe API endpoints
- **Runtime**: Node.js with ESM module support
- **Database ORM**: Drizzle ORM for type-safe database queries and migrations
- **Database**: PostgreSQL (Neon serverless) for production data storage
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Authentication**: bcrypt for password hashing

**API Structure:**
- RESTful API design with resource-based routing
- CRUD operations for: users, patients, doctors, appointments, clinics, treatments, reports, treatment plans
- Input validation using Drizzle Zod schemas
- Error handling with appropriate HTTP status codes
- Request logging middleware for API monitoring

**Database Schema:**
Key entities managed by the system:
- **Users**: Authentication and role-based access (patient, doctor, student, graduate)
- **Clinics**: 12+ specialized dental clinics with metadata
- **Doctors**: Staff management with clinic assignments and specializations
- **Patients**: Patient records with clinic assignments and user associations
- **Appointments**: Scheduling with status tracking (confirmed, pending, cancelled)
- **Treatments**: Treatment records with pricing and status
- **Reports**: Medical reports with type categorization
- **Treatment Plans**: Multi-step treatment plans with progress tracking

### Key Architectural Decisions

**Bilingual Support:**
- **Problem**: Support both Arabic and English interfaces with RTL/LTR layouts
- **Solution**: LanguageContext provider with localStorage persistence, dual-language content throughout the application
- **Rationale**: Arabic is the primary language for Delta University, but English support enables international users

**Role-Based Access Control:**
- **Problem**: Different user types (patients, doctors, students, graduates) require different access levels
- **Solution**: User type stored in database schema with conditional UI rendering based on role
- **Rationale**: Medical systems require strict access control for patient privacy and workflow optimization

**Component Architecture:**
- **Problem**: Need reusable, maintainable UI components across 30+ pages
- **Solution**: Shadcn UI component library with custom styling and Tailwind CSS
- **Rationale**: Provides accessible components while maintaining design flexibility and type safety

**Server-Side State Management:**
- **Problem**: Complex data fetching with caching requirements
- **Solution**: TanStack Query v5 with custom query functions and cache configuration
- **Rationale**: Reduces unnecessary API calls, provides optimistic updates, and simplifies loading states

**Form Validation:**
- **Problem**: Ensure data integrity for medical records and appointments
- **Solution**: React Hook Form with Zod schemas matching database validation
- **Rationale**: Type-safe validation with excellent DX and runtime safety

**Real-Time Features:**
- **Problem**: Doctors need live updates on appointments and patient queue
- **Solution**: Polling-based updates with TanStack Query refetch intervals
- **Alternative Considered**: WebSockets were considered but polling provides simpler implementation for current scale
- **Trade-off**: Slightly higher server load vs. simpler architecture

## External Dependencies

### Third-Party Services

**Database:**
- **Neon Serverless PostgreSQL**: Production database hosting
- **Connection**: Via `@neondatabase/serverless` driver with HTTP connections
- **Configuration**: DATABASE_URL environment variable required

**Development Tools:**
- **Replit Integration**: Development environment with runtime error modal, cartographer, and dev banner plugins
- **Vite Plugins**: Custom Replit plugins for enhanced development experience

### Key NPM Packages

**UI Components (Radix UI):**
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Popover, Radio Group, Select, Separator, Slider, Switch, Tabs, Toast, Tooltip
- All components are accessible, keyboard-navigable, and screen-reader friendly

**Utilities:**
- `clsx` and `tailwind-merge`: Dynamic className composition
- `class-variance-authority`: Type-safe component variants
- `date-fns`: Date manipulation and formatting
- `axios`: HTTP client for API requests
- `zod`: Runtime type validation
- `bcrypt`: Password hashing

**Animation:**
- `framer-motion`: Page transitions, hover effects, and interactive animations

**State Management:**
- `@tanstack/react-query`: Server state caching and synchronization

**Forms:**
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Zod integration for forms

### Environment Configuration

**Required Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string (Neon serverless)
- `NODE_ENV`: Development/production mode

**Build Configuration:**
- TypeScript with strict mode enabled
- ESNext module resolution
- Path aliases: `@/` for client source, `@shared/` for shared types
- Incremental compilation with build info caching

### Future Integrations (Planned)

**FastAPI Backend:**
- Python-based microservice for AI features
- MongoDB integration for unstructured medical data
- Models defined in `fastapi_backend/` directory

**AI/ML Features:**
- Image analysis for dental X-rays
- Chatbot with symptom-to-clinic mapping
- Intelligent appointment suggestions

**External APIs:**
- WhatsApp integration for appointment reminders
- SMS gateway for notifications
- Payment gateway integration (credit card, digital wallets)
- Insurance provider APIs