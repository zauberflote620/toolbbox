---
description: Create comprehensive implementation plan for a feature
argument-hint: feature name or description
allowed-tools:
  - Write
  - Read
  - Grep
  - LS
---

# Plan Feature Command

Planning feature: $ARGUMENTS

## Feature Planning Template

### 1. Feature Overview
- **Name**: Clear, descriptive feature name
- **Purpose**: What problem does this solve?
- **Users**: Who will use this feature?
- **Impact**: How does this improve the product?

### 2. Technical Architecture

#### Frontend Components
```
├── FeatureContainer/
│   ├── FeatureContainer.tsx
│   ├── FeatureContainer.test.tsx
│   └── FeatureContainer.module.css
├── SubComponents/
│   ├── ComponentA.tsx
│   └── ComponentB.tsx
└── hooks/
    └── useFeatureLogic.ts
```

#### Backend Structure
```
├── routes/
│   └── featureRoutes.ts
├── controllers/
│   └── featureController.ts
├── services/
│   └── featureService.ts
└── models/
    └── featureModel.ts
```

#### Database Schema
```sql
-- New tables or modifications needed
CREATE TABLE feature_data (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  ...
);
```

### 3. Implementation Steps

#### Phase 1: Foundation (MVP)
1. Set up database schema
2. Create basic API endpoints
3. Build core UI components
4. Add basic functionality
5. Write unit tests

#### Phase 2: Enhancement
1. Add advanced features
2. Improve error handling
3. Optimize performance
4. Add comprehensive tests
5. Update documentation

#### Phase 3: Polish
1. Improve UX/UI
2. Add analytics
3. Performance optimization
4. Security hardening
5. Deploy and monitor

### 4. API Design

```typescript
// Endpoint definitions
GET    /api/feature          // List items
GET    /api/feature/:id      // Get single item
POST   /api/feature          // Create item
PUT    /api/feature/:id      // Update item
DELETE /api/feature/:id      // Delete item

// Request/Response schemas
interface CreateFeatureRequest {
  name: string;
  description: string;
  // ...
}

interface FeatureResponse {
  id: string;
  name: string;
  createdAt: Date;
  // ...
}
```

### 5. State Management

```typescript
// Redux/Zustand/Context structure
interface FeatureState {
  items: Feature[];
  loading: boolean;
  error: Error | null;
  // ...
}

// Actions
- FETCH_FEATURES
- CREATE_FEATURE
- UPDATE_FEATURE
- DELETE_FEATURE
```

### 6. Testing Strategy

- **Unit Tests**: All utilities and services
- **Integration Tests**: API endpoints
- **Component Tests**: UI components
- **E2E Tests**: Critical user flows

### 7. Deployment Plan

1. Database migrations
2. Environment variables
3. Feature flags (if needed)
4. Rollback strategy
5. Monitoring setup

### 8. Success Criteria

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Documentation complete
- [ ] Stakeholder approval

Always consider scalability and maintainability in the design.