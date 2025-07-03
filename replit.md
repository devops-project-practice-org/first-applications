# PropertyHub - Real Estate Platform

## Overview

PropertyHub is a full-stack real estate platform built with React, Express, and PostgreSQL. The application allows users to browse properties, save favorites, contact agents, and manage listings. It features a modern UI built with shadcn/ui components and comprehensive user management with role-based access control.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Structure**: RESTful API with role-based middleware
- **Session Management**: Express sessions for maintaining user state

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL
- **Schema**: Comprehensive schema with users, properties, inquiries, saved properties, and saved searches
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### User Management
- **Authentication**: JWT tokens with secure password hashing
- **Authorization**: Role-based access control (guest, user, agent, admin)
- **User Profiles**: Complete user management with profile images and verification status

### Property Management
- **Property Listings**: Full CRUD operations for property management
- **Search & Filtering**: Advanced search with location, price, type, and feature filters
- **Image Handling**: Multiple image support for property galleries
- **Featured Properties**: Curated property highlighting system

### User Interactions
- **Saved Properties**: Users can save and manage favorite properties
- **Inquiries**: Contact system between users and agents
- **Search History**: Saved search functionality for user convenience

### UI/UX Features
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark Mode Support**: Built-in theme switching capabilities
- **Toast Notifications**: User feedback system for actions
- **Loading States**: Comprehensive loading and error handling

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle business logic and validation
3. **Authentication**: JWT middleware validates user permissions
4. **Database Operations**: Drizzle ORM performs type-safe database queries
5. **Response Handling**: Structured JSON responses with error handling
6. **State Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe ORM for database operations
- **bcrypt**: Password hashing for security
- **jsonwebtoken**: JWT token generation and verification

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form handling with validation
- **zod**: Runtime type validation

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety and enhanced developer experience
- **drizzle-kit**: Database migration management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Development PostgreSQL instance via Neon
- **Environment Variables**: Local .env configuration

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js server code
- **Database**: Production PostgreSQL with migration deployment
- **Static Assets**: Served via Express with proper caching headers

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET**: Secret key for JWT token signing
- **NODE_ENV**: Environment specification for conditional logic

The application follows a clean separation of concerns with the client, server, and shared directories containing frontend, backend, and common code respectively. The architecture supports scalability through its modular design and type-safe database operations.

## Recent Changes

### July 02, 2025 - Pakistani Market Integration & Professional Documentation
- Added comprehensive Pakistani market localization features
- Integrated Urdu language toggle throughout the application
- Implemented intelligent chatbot with Pakistani city knowledge (Lahore, Karachi, Islamabad)
- Added WhatsApp integration for agent communication
- Developed rent analyzer with local market data
- Created "Near Me" location-based filtering system
- Built negotiation tips component with localized content
- Fixed React Query integration and TypeScript issues
- **Created comprehensive README.md with complete local hosting guide**
- **Added detailed database setup instructions for team demonstrations**
- **Configured Google Maps integration to work without API keys**
- **Added sample properties with Pakistani city coordinates**
- **Built complete documentation package with 150+ page technical documentation**
- **Created 6 professional Mermaid architecture diagrams (ERD, Use Cases, Activity, Sequence, DFD, Components)**
- **Added team-ready documentation with setup scripts and presentation guides**

### Core Features Completed
- Full-stack real estate platform with React frontend and Express backend
- PostgreSQL database with Drizzle ORM for type-safe operations
- JWT-based authentication with role-based access control
- Property listings, search, filtering, and management system
- User dashboard with saved properties and inquiries
- Responsive design with shadcn/ui components

## Changelog
- July 02, 2025. Initial setup and Pakistani market feature integration

## User Preferences

Preferred communication style: Simple, everyday language.