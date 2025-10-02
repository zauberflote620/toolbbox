# Product Requirements Document: Professional VM Planogram System

## Executive Summary

### Product Vision
A simplified web application that transforms plain text analytics insights into professional planograms and execution materials, eliminating the need for complex integrations while maintaining industry-standard visual merchandising practices.

### Core Value Proposition
- **Input Simplicity**: Accept plain text analytics insights via copy-paste
- **Intelligence Layer**: Parse insights and apply VM principles automatically
- **Professional Output**: Generate planograms and execution materials ready for retail use
- **Zero Integration**: No external connections or complex setup required

### Target Users
- Retail store managers
- Visual merchandising teams
- District managers
- Operations coordinators

## Product Overview

### Problem Statement
Current planogram systems require complex integrations, specialized training, and expensive software licenses. Small to medium retailers need a solution that accepts their existing analytics insights and generates professional planograms without technical complexity.

### Solution
A web application that accepts plain text insights and generates comprehensive planogram packages including visual layouts, execution materials, and validation tools.

### Key Differentiators
1. **Text-first input** - Works with any analytics output
2. **Pre-loaded fixtures** - Uline catalog built-in
3. **VM intelligence** - Industry best practices automated
4. **Complete execution package** - From planning to validation

## User Stories & Requirements

### Primary User Flows

#### Flow 1: New Store Layout Creation
**As a** store manager
**I want to** create a new planogram from scratch
**So that** I can optimize my store layout based on current analytics

**Acceptance Criteria:**
- Input store dimensions and constraints
- Define zones and traffic patterns
- Add fixtures from Uline library
- Generate baseline layout

#### Flow 2: Analytics-Driven Reset
**As a** district manager
**I want to** input analytics insights as plain text
**So that** the system generates an optimized planogram automatically

**Example Input:**
```
Winter coats up 47%, scarves up 23%
Leather goods are highest margin items
Customers who buy coats usually buy accessories
Clear summer inventory, down 89%
```

**Acceptance Criteria:**
- Parse text insights into actionable rules
- Apply VM principles (eye level for bestsellers)
- Generate planogram with rationale
- Create execution materials

#### Flow 3: Execution & Validation
**As a** store associate
**I want to** receive clear execution instructions
**So that** I can implement the reset accurately

**Acceptance Criteria:**
- Print-ready pick lists by section
- Visual task cards with before/after images
- Safety and compliance checklists
- Manager validation dashboard

### Functional Requirements

#### Phase 1: Basic Infrastructure (Week 1)
- **FR1.1**: Web application with responsive design
- **FR1.2**: User authentication and session management
- **FR1.3**: Database setup for stores, layouts, and products
- **FR1.4**: Basic store layout builder interface
- **FR1.5**: Save/load functionality for store configurations

#### Phase 2: Fixture & Product Management (Week 2)
- **FR2.1**: Integrated Uline fixture library with SKUs and dimensions
- **FR2.2**: Custom fixture creation and editing tools
- **FR2.3**: Product database with categories and attributes
- **FR2.4**: Drag-and-drop fixture placement interface
- **FR2.5**: Product-to-fixture assignment with capacity validation

#### Phase 3: Intelligence Layer (Week 3)
- **FR3.1**: Natural language processing for analytics insights
- **FR3.2**: Rules engine for translating insights to placement decisions
- **FR3.3**: VM principles automation (eye level, stretch zone, adjacency)
- **FR3.4**: Traffic flow optimization algorithms
- **FR3.5**: Sight line analysis and optimization

#### Phase 4: Planogram Generation (Week 4)
- **FR4.1**: Overhead store layout views with measurements
- **FR4.2**: Elevation views showing height zones and product placement
- **FR4.3**: PDF generation for multiple paper sizes
- **FR4.4**: Annotation system for rationale and notes
- **FR4.5**: Version control and comparison tools

#### Phase 5: Execution Materials (Week 5)
- **FR5.1**: Automated pick list generation by section and team
- **FR5.2**: Visual task cards with step-by-step instructions
- **FR5.3**: Manager dashboard with progress tracking
- **FR5.4**: QA checklists with safety and compliance items
- **FR5.5**: Mobile-optimized interface for floor execution

### Non-Functional Requirements

#### Performance
- **NFR1**: Page load times under 3 seconds
- **NFR2**: PDF generation under 10 seconds
- **NFR3**: Support 50 concurrent users
- **NFR4**: 99.5% uptime during business hours

#### Security
- **NFR5**: HTTPS encryption for all communications
- **NFR6**: Role-based access control
- **NFR7**: Data encryption at rest
- **NFR8**: Session timeout after 30 minutes of inactivity

#### Usability
- **NFR9**: Mobile-responsive design (tablets and phones)
- **NFR10**: Accessibility compliance (WCAG 2.1 AA)
- **NFR11**: Browser support: Chrome, Firefox, Safari, Edge
- **NFR12**: Maximum 3 clicks to core functions

## Technical Architecture

### Technology Stack
- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.7
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local file system
- **Authentication**: Express sessions (MVP), Cloudflare SSO (future)
- **PDF Generation**: Puppeteer + React components

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   React + TS    │◄──►│   Node.js       │◄──►│   PostgreSQL    │
│   Tailwind CSS  │    │   Express       │    │   + Prisma      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PDF Engine    │    │   NLP Engine    │    │  Local Storage  │
│   Puppeteer     │    │   Custom Rules  │    │  File System    │
│   React to PDF  │    │   Text Parser   │    │   Assets        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Models

#### Store Entity
```typescript
interface Store {
  id: string
  name: string
  address: string
  dimensions: {
    width: number
    height: number
    ceilingHeight: number
  }
  constraints: {
    entryPoints: Point[]
    pillars: Rectangle[]
    utilities: Rectangle[]
    safetyRequirements: string[]
  }
  trafficPatterns: TrafficFlow[]
  createdAt: Date
  updatedAt: Date
}
```

#### Fixture Entity
```typescript
interface Fixture {
  id: string
  name: string
  ulineSKU?: string
  category: FixtureCategory
  dimensions: {
    width: number
    depth: number
    height: number
  }
  capacity: {
    units: number
    weight: number
  }
  placement: {
    storeId: string
    x: number
    y: number
    rotation: number
  }
  vmZone: 'eye' | 'reach' | 'stretch' | 'stoop'
}
```

#### Product Entity
```typescript
interface Product {
  id: string
  name: string
  category: ProductCategory
  attributes: {
    margin: number
    velocity: number
    seasonality: string
    size: 'small' | 'medium' | 'large'
    weight: number
  }
  placement: {
    fixtureId: string
    position: number
    facings: number
  }
  analytics: {
    salesTrend: number
    crossSells: string[]
    placement: PlacementRule[]
  }
}
```

#### Planogram Entity
```typescript
interface Planogram {
  id: string
  storeId: string
  version: number
  status: 'draft' | 'approved' | 'executed'
  analytics: {
    insights: string[]
    parsedRules: PlacementRule[]
  }
  layout: {
    fixtures: Fixture[]
    products: Product[]
    flow: TrafficFlow
  }
  execution: {
    pickLists: PickList[]
    taskCards: TaskCard[]
    checklist: ValidationItem[]
  }
  createdAt: Date
  approvedAt?: Date
  executedAt?: Date
}
```

## API Specifications

### Core Endpoints

#### Store Management
```typescript
// Create new store
POST /api/stores
Body: CreateStoreRequest
Response: Store

// Get store details
GET /api/stores/:id
Response: Store

// Update store configuration
PUT /api/stores/:id
Body: UpdateStoreRequest
Response: Store
```

#### Fixture Library
```typescript
// Get Uline fixtures by category
GET /api/fixtures/uline?category={category}
Response: Fixture[]

// Search fixtures
GET /api/fixtures/search?q={query}
Response: Fixture[]

// Create custom fixture
POST /api/fixtures/custom
Body: CreateFixtureRequest
Response: Fixture
```

#### Analytics Processing
```typescript
// Parse analytics text
POST /api/analytics/parse
Body: { text: string, storeId: string }
Response: ParsedAnalytics

// Generate planogram from insights
POST /api/planograms/generate
Body: GeneratePlanogramRequest
Response: Planogram
```

#### Execution Materials
```typescript
// Generate pick lists
GET /api/planograms/:id/picklists
Response: PickList[]

// Generate task cards
GET /api/planograms/:id/taskcards
Response: TaskCard[]

// Generate PDF planogram
GET /api/planograms/:id/pdf?format={format}
Response: Binary PDF
```

### Natural Language Processing

#### Text Parsing Rules
```typescript
interface AnalyticsParser {
  patterns: {
    salesTrend: RegExp[]      // "up 47%", "down 23%", "increased by"
    profitability: RegExp[]   // "highest margin", "most profitable"
    relationships: RegExp[]   // "customers who buy X also buy Y"
    seasonality: RegExp[]     // "summer inventory", "winter coats"
    urgency: RegExp[]         // "clear", "liquidate", "promote"
  }

  extractInsights(text: string): PlacementRule[]

  applyVMRules(rules: PlacementRule[]): FixturePlacement[]
}
```

#### VM Principles Engine
```typescript
interface VMPrinciplesEngine {
  // Eye level placement for bestsellers
  optimizeEyeLevel(products: Product[]): PlacementRule[]

  // Stretch zone for premium items
  optimizeStretchZone(products: Product[]): PlacementRule[]

  // Traffic flow optimization
  optimizeTrafficFlow(layout: StoreLayout): TrafficFlow

  // Cross-merchandising rules
  applyCrossMerchandising(relationships: ProductRelationship[]): PlacementRule[]
}
```

## User Interface Specifications

### Design System

#### Color Palette
- **Primary**: #2563eb (Blue 600)
- **Secondary**: #059669 (Emerald 600)
- **Accent**: #dc2626 (Red 600)
- **Neutral**: #374151 (Gray 700)
- **Background**: #f9fafb (Gray 50)

#### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **Code**: Fira Code

#### Components
- **Buttons**: Rounded corners, hover states, disabled states
- **Forms**: Inline validation, clear error states
- **Cards**: Subtle shadows, clear hierarchy
- **Navigation**: Breadcrumbs, clear active states

### Page Layouts

#### Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Header Navigation                                           │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│ │   Stores    │ │ Planograms  │ │  Analytics  │           │
│ │   (3 Active)│ │ (2 Pending) │ │ (5 Insights)│           │
│ └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ Recent Activity                                             │
│ • Store #123 planogram approved                            │
│ • New analytics insights for Store #456                    │
│ • Execution completed for Store #789                       │
└─────────────────────────────────────────────────────────────┘
```

#### Planogram Builder
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────┐ ┌─────────────────────────────────────────┐ │
│ │             │ │                                         │ │
│ │   Fixture   │ │         Store Layout Canvas             │ │
│ │   Library   │ │                                         │ │
│ │             │ │         (Drag & Drop Interface)         │ │
│ │   • Shelves │ │                                         │ │
│ │   • Racks   │ │                                         │ │
│ │   • Tables  │ │                                         │ │
│ │   • Custom  │ │                                         │ │
│ │             │ │                                         │ │
│ └─────────────┘ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Analytics Input                                         │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Paste your analytics insights here:                 │ │ │
│ │ │ "Winter coats up 47%, scarves up 23%"              │ │ │
│ │ │ "Leather goods are highest margin items"           │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ [Parse Insights] [Generate Layout]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Interface
```
┌─────────────────┐
│ ☰ Planogram App │
├─────────────────┤
│ Pick List #1    │
│ ┌─────────────┐ │
│ │ Section A   │ │
│ │ □ Item 1    │ │
│ │ □ Item 2    │ │
│ │ ☑ Item 3    │ │
│ └─────────────┘ │
│                 │
│ Task Card #3    │
│ ┌─────────────┐ │
│ │ Move coats  │ │
│ │ to eye level│ │
│ │ [Photo]     │ │
│ │ [Complete]  │ │
│ └─────────────┘ │
└─────────────────┘
```

## Success Metrics & KPIs

### Primary Metrics
- **User Adoption**: 80% of target retailers actively using within 6 months
- **Time to Value**: Users create first planogram within 30 minutes
- **Accuracy**: 90% of generated planograms require minimal manual adjustment
- **Execution Success**: 85% of resets completed without major issues

### Secondary Metrics
- **User Satisfaction**: NPS score above 50
- **Feature Utilization**: 70% of users use analytics parsing feature
- **Performance**: Page load times under 3 seconds consistently
- **PDF Generation**: Under 10 seconds for standard planogram

### Business Metrics
- **Customer Retention**: 80% renewal rate after first year
- **Feature Adoption**: 60% of users use execution materials feature
- **Support Burden**: Under 2 support tickets per user per month
- **Revenue Impact**: 15% increase in VM efficiency for clients

## Risk Assessment & Mitigation

### Technical Risks
- **NLP Accuracy**: Risk of misinterpreting analytics text
  - Mitigation: Extensive pattern library, user validation step
- **PDF Generation Performance**: Large planograms may be slow
  - Mitigation: Background processing, progress indicators
- **Uline Data Integration**: Fixture library may become outdated
  - Mitigation: Automated sync process, fallback to custom fixtures

### Business Risks
- **User Adoption**: Users may prefer existing tools
  - Mitigation: Free trial period, extensive onboarding support
- **Competition**: Existing planogram software vendors
  - Mitigation: Focus on simplicity differentiator, rapid iteration
- **Scalability**: System may not handle enterprise customers
  - Mitigation: Cloud-native architecture, performance monitoring

### Operational Risks
- **Data Loss**: Critical planogram data could be lost
  - Mitigation: Automated backups, version control system
- **Security Breach**: Retail data is sensitive
  - Mitigation: Security audits, encryption, access controls

## Implementation Timeline

### Phase 1: Foundation (Week 1)
**Days 1-2**: Project setup and infrastructure
- Initialize React + TypeScript project
- Set up PostgreSQL database
- Configure authentication system

**Days 3-4**: Core UI framework
- Implement design system components
- Create responsive layouts
- Set up routing and navigation

**Days 5-7**: Basic store management
- Store creation and editing forms
- Database schema implementation
- Save/load functionality testing

### Phase 2: Fixture & Product Management (Week 2)
**Days 8-9**: Uline fixture integration
- Import Uline catalog data
- Create fixture search and filter UI
- Implement fixture preview system

**Days 10-11**: Layout builder interface
- Drag-and-drop functionality
- Grid snapping and measurement tools
- Fixture placement validation

**Days 12-14**: Product management
- Product database setup
- Category management system
- Product-to-fixture assignment interface

### Phase 3: Intelligence Layer (Week 3)
**Days 15-16**: Text parsing engine
- NLP pattern development
- Analytics insight extraction
- Rule generation algorithms

**Days 17-18**: VM principles implementation
- Eye level optimization logic
- Traffic flow analysis
- Cross-merchandising rules

**Days 19-21**: Integration and testing
- Connect parsing to layout generation
- End-to-end workflow testing
- Performance optimization

### Phase 4: Planogram Generation (Week 4)
**Days 22-23**: Visual planogram rendering
- Overhead view generation
- Elevation view implementation
- Measurement and annotation system

**Days 24-25**: PDF generation system
- React component to PDF pipeline
- Multiple format support
- Print optimization

**Days 26-28**: Version control and collaboration
- Planogram versioning system
- Approval workflow implementation
- Change tracking and comparison

### Phase 5: Execution Materials (Week 5)
**Days 29-30**: Pick list generation
- Automated list creation by section
- Team assignment algorithms
- Mobile-optimized display

**Days 31-32**: Task card system
- Visual instruction cards
- Progress tracking
- Photo integration for validation

**Days 33-35**: Final integration and launch prep
- Manager dashboard completion
- QA checklist implementation
- User acceptance testing

## Future Enhancements

### Version 2.0 Features
- **AI-Powered Optimization**: Machine learning for layout optimization
- **3D Planogram Views**: WebGL-based 3D visualization
- **Inventory Integration**: Real-time stock level consideration
- **Performance Analytics**: Track reset success metrics
- **Collaborative Features**: Team comments and approval workflows

### Integration Opportunities
- **POS System Integration**: Real sales data input
- **Inventory Management**: Stock level awareness
- **Workforce Management**: Staff scheduling for resets
- **Customer Analytics**: Heat mapping and behavior data

### Mobile App Extension
- **Offline Capability**: Work without internet connection
- **Camera Integration**: Before/after photo capture
- **Barcode Scanning**: Product verification during execution
- **Voice Commands**: Hands-free task completion

## Appendices

### Appendix A: Uline Fixture Categories
- Shelving Units (Wire, Steel, Plastic)
- Display Racks (Clothing, Accessories, Books)
- Tables and Pedestals (Various heights and sizes)
- Storage Solutions (Bins, Baskets, Containers)
- Specialized Fixtures (Jewelry, Electronics, Food)

### Appendix B: VM Principles Reference
- **Eye Level Rules**: 60-72 inches height for bestsellers
- **Stretch Zone**: 72+ inches for premium/aspirational items
- **Reach Zone**: 48-60 inches for everyday items
- **Stoop Zone**: Below 48 inches for bulk/value items
- **Traffic Patterns**: Right-hand traffic flow preference
- **Sight Lines**: Clear views to key merchandise

### Appendix C: Example Analytics Inputs
```
"Seasonal Analysis Q4 2024:
- Winter outerwear sales increased 45% vs last year
- Accessories (scarves, gloves) up 32%
- Boot sales strongest in first two weeks of December
- Summer clearance items down 78%, need to liquidate
- Leather goods showing highest profit margins at 65%
- Customer flow analysis shows 70% enter from main entrance
- Cross-sell opportunity: 85% of coat buyers also purchase accessories"
```

### Appendix D: Technical Dependencies
```json
{
  "frontend": {
    "react": "^19.1.0",
    "typescript": "^5.0.0",
    "vite": "^6.3.5",
    "tailwindcss": "^4.1.7",
    "@radix-ui/react-*": "^2.1.6"
  },
  "backend": {
    "node": "^20.0.0",
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "puppeteer": "^21.0.0"
  },
  "database": {
    "postgresql": "^14.0.0"
  },
  "infrastructure": {
    "aws-s3": "^3.0.0",
    "docker": "^24.0.0"
  }
}
```

This PRD provides the comprehensive technical and business foundation needed to develop the Professional VM Planogram System, ensuring alignment between the vision and implementation while maintaining focus on the core differentiators of simplicity, intelligence, and professional output quality.