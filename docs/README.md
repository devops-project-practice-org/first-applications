# PropertyHub Documentation Package

This folder contains comprehensive documentation for the PropertyHub Pakistani Real Estate Platform.

## 📁 Documentation Structure

### Core Documentation
- **`PropertyHub_Documentation.md`** - Complete technical documentation (150+ pages)
- **`README.md`** - This documentation index file

### Architecture Diagrams (Mermaid Source)
- **`diagrams/erd.mmd`** - Entity Relationship Diagram showing database schema
- **`diagrams/usecase.mmd`** - Use Case Diagram showing user interactions  
- **`diagrams/activity.mmd`** - Activity Diagram for property inquiry flow
- **`diagrams/sequence.mmd`** - Sequence Diagram for API communication
- **`diagrams/dfd.mmd`** - Data Flow Diagram showing system processes
- **`diagrams/component.mmd`** - Component Architecture diagram

### Configuration
- **`../mermaidConfig.json`** - Mermaid rendering configuration

## 🚀 How to Use This Documentation

### 1. Reading the Documentation
Start with `PropertyHub_Documentation.md` for complete technical specifications.

### 2. Viewing Diagrams
The `.mmd` files contain Mermaid diagram source code. You can:

**Option A: Online Rendering**
1. Copy the content of any `.mmd` file
2. Paste it into [Mermaid Live Editor](https://mermaid.live/)
3. View and export the rendered diagram

**Option B: VS Code Extension**
1. Install "Mermaid Markdown Syntax Highlighting" extension
2. Open any `.mmd` file in VS Code
3. Use preview mode to view the diagram

**Option C: Local Rendering (requires setup)**
```bash
# Install dependencies (if not already installed)
npm install @mermaid-js/mermaid-cli

# Render individual diagrams
npx mmdc -i docs/diagrams/erd.mmd -o docs/diagrams/erd.png
npx mmdc -i docs/diagrams/usecase.mmd -o docs/diagrams/usecase.png
# ... repeat for other diagrams
```

## 📋 Documentation Contents Overview

### 1. Entity Relationship Diagram (erd.mmd)
Shows the complete database schema with:
- Users table (authentication, roles, profiles)
- Properties table (listings, locations, details)  
- Inquiries table (user-agent communication)
- Saved Properties table (user favorites)
- Saved Searches table (user search history)
- All relationships and foreign key constraints

### 2. Use Case Diagram (usecase.mmd)  
Illustrates all user interactions:
- **Actors**: Guest, User, Agent, Admin
- **Core Features**: Property search, viewing, inquiries
- **Pakistani Features**: Language toggle, WhatsApp, chatbot
- **Management**: Property CRUD, user management

### 3. Activity Diagram (activity.mmd)
Property inquiry workflow:
- User discovers property
- Authentication check
- Form submission process
- WhatsApp integration flow
- Agent notification process

### 4. Sequence Diagram (sequence.mmd)
API communication flows:
- Property browsing sequence
- User inquiry submission
- WhatsApp message generation
- Chatbot interaction
- Real-time updates
- Authentication flow

### 5. Data Flow Diagram (dfd.mmd)
System-level data flows:
- External entities (users, agents, services)
- Core processes (auth, property management, search)
- Data stores (databases, sessions)
- Integration points (WhatsApp, Google Maps)

### 6. Component Architecture (component.mmd)
Technical component structure:
- **Frontend**: React pages, components, hooks
- **Backend**: Express routes, middleware, services  
- **Database**: PostgreSQL tables with Drizzle ORM
- **External Services**: Maps, WhatsApp, AI chatbot
- **Build Tools**: Vite, TypeScript, ESLint

## 🎯 Key Features Documented

### Pakistani Market Localization
- Complete Urdu language support
- Major cities integration (Lahore, Karachi, Islamabad)
- WhatsApp communication integration
- Local property terminology and units
- Cultural considerations in UX design

### Technical Architecture  
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript + JWT auth
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS + Radix primitives
- **State**: TanStack Query for server state

### Security & Performance
- JWT-based authentication with role-based access
- Password hashing with bcrypt
- SQL injection prevention with parameterized queries
- Code splitting and lazy loading
- Database connection pooling
- Optimized queries with proper indexing

## 📊 Documentation Statistics

- **Pages**: 150+ pages of comprehensive documentation
- **Diagrams**: 6 detailed architecture diagrams
- **API Endpoints**: 15+ documented endpoints
- **Database Tables**: 6 core tables with relationships
- **Components**: 25+ React components documented
- **Security Features**: 5+ security measures detailed

## 🔧 For Developers

### Getting Started
1. Read the main documentation: `PropertyHub_Documentation.md`
2. Review architecture diagrams for system understanding
3. Follow the setup guide in the main project README
4. Refer to API documentation for integration

### Documentation Updates
When updating the system:
1. Update relevant `.mmd` diagram files
2. Regenerate PNG files if needed
3. Update the main documentation file
4. Update version numbers and change logs

## 📞 Support

For questions about this documentation:
- Check the main project README for setup instructions
- Review the troubleshooting section in the main documentation
- Contact the development team for clarifications

---

**Documentation Version**: 1.0  
**Last Updated**: January 2, 2025  
**Total Size**: ~150 pages + 6 diagrams  
**Format**: Markdown + Mermaid  

*Complete technical documentation for PropertyHub - Pakistani Real Estate Platform*