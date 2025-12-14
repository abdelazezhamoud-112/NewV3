# Dento Health Care - Dental Hospital Management System

## Overview

Dento Health Care is a comprehensive, bilingual (Arabic/English) dental hospital management system developed for Delta University's Faculty of Dentistry. The system provides full RTL (Right-to-Left) support for Arabic, role-based access control, and manages the complete lifecycle of dental care including patient management, appointments, treatments, medical records, payments, and clinic operations. It features a modern medical blue theme with professional UI patterns, smooth animations, and responsive design for all devices.

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

**Design System Decisions:**
- Material Design principles adapted for healthcare contexts
- Professional medical blue color scheme with 4 theme variants
- Dark mode support with automatic theme switching
- 12 unique colors for specialized clinic identification
- Consistent spacing system using Tailwind units (2, 4, 6, 8, 12, 16)
- Hover elevation effects for interactive elements
- Badge system for status indicators
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
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

**API Design:**
- RESTful API architecture with resource-based endpoints
- JSON request/response format
- Centralized error handling middleware
- Request logging and performance monitoring
- CORS configuration for cross-origin requests

**Data Layer:**
- Schema-first approach using Drizzle ORM schema definitions
- Zod schemas for runtime validation of API inputs
- Shared schema types between frontend and backend (in `/shared` directory)

### Database Architecture

**Database System:**
- **Primary Database**: PostgreSQL hosted on Neon (serverless PostgreSQL)
- **Connection**: HTTP-based connection using `@neondatabase/serverless` for edge compatibility
- **ORM**: Drizzle ORM with Neon HTTP adapter

**Schema Design:**
- `users`: User authentication and profile data (id, username, password, fullName, userType)
- `clinics`: Dental clinic information (id, name, address, contact, email)
- `doctors`: Doctor profiles with clinic assignments (id, name, specialization, contact, email, clinicId)
- `patients`: Patient records (id, fullName, age, phone, clinicId, assignedToUserId, status, createdAt)
- `appointments`: Appointment scheduling (id, patientId, doctorId, date, time, status, notes)
- `treatments`: Treatment records (id, patientId, doctorId, description, date, cost)
- `treatment_plans`: Multi-step treatment plans
- `reports`: Medical reports and documentation

**Key Architectural Decisions:**
- Foreign key constraints with appropriate cascade/restrict behaviors
- UUID primary keys (gen_random_uuid()) for distributed scalability
- Timestamp tracking for audit trails (createdAt fields)
- Soft delete patterns using status fields
- Relational integrity maintained through foreign key constraints

### Authentication & Authorization

**User Roles:**
1. **Patient**: Book appointments, view medical records, make payments
2. **Doctor**: Manage appointments, update medical records, create treatment plans
3. **Student**: Limited access for educational purposes
4. **Excellence/Admin**: Full system access, manage users and clinics

**Authentication Features:**
- Username/password authentication
- Session-based authentication with secure cookies
- Password strength validation
- Remember me functionality
- Failed login attempt tracking
- Session timeout management

### Core Feature Modules

**1. Appointment Management:**
- Real-time appointment scheduling with doctor availability
- Multiple appointment statuses (scheduled, confirmed, pending, cancelled)
- Reminder system with notifications
- Consultation fee tracking
- Cancellation and rescheduling workflows

**2. Medical Records:**
- Comprehensive patient medical history
- Treatment plan tracking with multi-step workflows
- Medical report generation and storage
- Alert system for critical medical conditions
- File attachments and image uploads

**3. Payment & Billing:**
- Invoice generation and tracking
- Multiple payment methods (credit card, digital wallet, bank transfer)
- Installment plans (1, 3, 6 months)
- Discount code system
- Payment history and statistics
- Financial reporting

**4. Clinic Management:**
- 12 specialized dental clinics plus Dentocad
- Clinic-specific doctor assignments
- Patient queue management
- Clinic statistics and performance metrics
- Working hours and contact information

**5. Search & Discovery:**
- Advanced multi-category search (doctors, clinics, articles)
- Search history tracking
- Symptom-based doctor recommendations
- Real-time search statistics
- Filter and sort capabilities

**6. Rating & Review System:**
- 5-star rating system for doctors
- Text reviews with verification badges
- Rating distribution charts
- Helpful vote counting
- Multi-sort options (newest, highest rated, most helpful)

**7. Notification System:**
- Type-based notifications (appointment, result, reminder, alert)
- Color-coded notification types
- Read/unread status tracking
- Notification filtering
- Real-time notification delivery

**8. Support System:**
- Ticket creation and tracking
- Priority levels (low, medium, high, critical)
- Status workflow (open, in-progress, escalated, resolved, closed)
- Response time tracking
- Category-based routing (technical, billing, appointment, general)

**9. AI Diagnosis (Planned):**
- Symptom analysis questionnaire
- Image-based diagnosis recommendations
- Clinic and doctor suggestions based on diagnosis
- Treatment recommendation engine

**10. Settings & Customization:**
- User profile management
- Notification preferences
- Theme customization (4 color schemes)
- Language switching (Arabic/English)
- Privacy controls
- Medical history settings

### Performance Optimizations

- React Query caching for reduced API calls
- Lazy loading of route components
- Optimized bundle splitting with Vite
- Image optimization and lazy loading
- Debounced search inputs
- Memoized expensive computations

### Testing & Quality Assurance

- TypeScript for compile-time type checking
- Data test IDs on key components for automated testing
- Zod validation for runtime type safety
- ESLint configuration for code quality

## External Dependencies

### Database & Storage
- **Neon (NeonDB)**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database ORM and query builder
- **Drizzle Kit**: Database migration tooling

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled component primitives (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, label, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, tooltip, etc.)
- **Shadcn UI**: Pre-styled components built on Radix UI
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets

### Form & Validation
- **React Hook Form**: Performant form state management
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form

### Data Fetching & State
- **TanStack Query (React Query)**: Server state management, caching, and synchronization
- **Axios**: HTTP client for API requests

### Styling & Animation
- **Tailwind CSS**: Utility-first CSS framework
- **Autoprefixer**: CSS vendor prefix automation
- **PostCSS**: CSS transformation tooling
- **Framer Motion**: Animation library for React
- **class-variance-authority**: Variant-based className utility
- **clsx**: Conditional className utility
- **tailwind-merge**: Tailwind class merging

### Date & Time
- **date-fns**: Modern date utility library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **TSX**: TypeScript execution for Node.js
- **ESBuild**: JavaScript bundler
- **Cross-env**: Cross-platform environment variable setting

### Charting & Visualization
- **Recharts**: React charting library for analytics dashboards

### Other Utilities
- **cmdk**: Command menu component
- **nanoid**: Unique ID generation
- **memoizee**: Function memoization for performance

### Replit-Specific Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Future/Alternative Backend (FastAPI - Currently Unused)
- **FastAPI**: Python-based API framework (in `/fastapi_backend` directory, not currently integrated)
- **Motor**: Async MongoDB driver
- **Pydantic**: Data validation for Python
- **MongoDB**: Alternative NoSQL database option (not currently used)