---
description: Implement UI components with MonsterOS styling and characters
argument-hint: component name or UI feature
allowed-tools:
  - Write
  - Edit
  - MultiEdit
  - Read
  - Bash(pnpm*)
---

# Implement UI Command

Implementing UI for: $ARGUMENTS

## MonsterOS Design System

### 1. Color Palette

```css
/* Light Mode */
:root {
  --primary: #E22237;        /* Vibrant red - headers, CTAs */
  --secondary: #FFC2D1;      /* Soft pink - accents */
  --bg-primary: #FFFFFF;     /* White background */
  --bg-secondary: #FFC2D1;   /* Pink section backgrounds */
  --text-primary: #2D3748;   /* Dark gray text */
  --text-secondary: #4A5568; /* Medium gray */
}

/* Dark Mode */
[data-theme="dark"] {
  --primary: #E22237;        /* Keep vibrant red */
  --bg-primary: #17246D;     /* Deep blue */
  --bg-secondary: #181B1C;   /* Dark background */
  --bg-divider: #8B8374;     /* Section divider */
  --text-primary: #FFFFFF;   /* White text */
  --text-secondary: #E2E8F0; /* Light gray */
}

/* Character-Specific Colors */
.neo { --character-color: #3B82F6; }        /* Blue - The Linguist */
.razz { --character-color: #EC4899; }       /* Red/Pink - The Operator */
.questor { --character-color: #F59E0B; }    /* Yellow-Orange - The Synthesizer */
.retro { --character-color: #10B981; }      /* Green - The Seeker */
.graphia { --character-color: #60A5FA; }    /* Soft Blue - The Librarian */
.configaro { --character-color: #F97316; }  /* Gold/Orange - The Architect */
.owl { --character-color: #7C2D12; }        /* Burgundy - The Orchestrator */
.quark { --character-color: #6B7280; }      /* Gray - The Conduit */
.hippo { --character-color: #8B5CF6; }      /* Purple - The Core */
```

### 2. Typography

```css
/* Import MonsterOS fonts */
@font-face {
  font-family: 'Cadiz';
  src: url('/app/assets/fonts/Cadiz-Black.otf') format('opentype');
  font-weight: 900;
  font-style: normal;
}

@font-face {
  font-family: 'Cadiz';
  src: url('/app/assets/fonts/Cadiz-Regular.otf') format('opentype');
  font-weight: 400;
  font-style: normal;
}

/* Typography Classes */
.heading-1 {
  font-family: 'Cadiz', system-ui;
  font-weight: 900;
  font-size: 2.5rem;
  color: var(--primary);
}

.body-text {
  font-family: 'Cadiz', system-ui;
  font-weight: 400;
  font-size: 1rem;
  color: var(--text-primary);
}
```

### 3. Character Assets

```typescript
// Character avatar imports
import neoAvatar from '@/app/assets/characters/neo.png';
import razzAvatar from '@/app/assets/characters/razz.png';
import questorAvatar from '@/app/assets/characters/questor.png';
// ... etc

const CHARACTERS = {
  neo: {
    name: 'Neo',
    title: 'The Linguist',
    avatar: neoAvatar,
    color: '#3B82F6',
    description: 'NLP & Entity Processing'
  },
  razz: {
    name: 'Razz',
    title: 'The Operator',
    avatar: razzAvatar,
    color: '#EC4899',
    description: 'Task Execution'
  },
  // ... other characters
};
```

### 4. Component Patterns

#### Character Card Component
```typescript
import { Character } from '@phosphor-icons/react';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: keyof typeof CHARACTERS;
  isActive?: boolean;
  onClick?: () => void;
}

export function CharacterCard({ character, isActive, onClick }: CharacterCardProps) {
  const char = CHARACTERS[character];
  
  return (
    <div 
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      style={{ '--character-color': char.color } as React.CSSProperties}
      onClick={onClick}
    >
      <img src={char.avatar} alt={char.name} className={styles.avatar} />
      <h3 className={styles.name}>{char.name}</h3>
      <p className={styles.title}>{char.title}</p>
      <p className={styles.description}>{char.description}</p>
    </div>
  );
}
```

#### Glassmorphism Panel
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.glass-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
```

### 5. Animation Guidelines

```css
/* Standard transitions */
.interactive-element {
  transition: all 0.2s ease-out;
}

/* Character entrance animations */
@keyframes character-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.character-card {
  animation: character-enter 0.4s ease-out;
}
```

### 6. Layout Patterns

```typescript
// Main layout with alternating sections
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <section className="bg-[var(--bg-primary)] py-16">
        {/* Content */}
      </section>
      <section className="bg-[var(--bg-secondary)] py-16">
        {/* Alternating background */}
      </section>
    </div>
  );
}
```

### 7. Accessibility with MonsterOS Style

```typescript
// Always include proper ARIA labels
<button
  className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
  aria-label={`Select ${character.name} - ${character.title}`}
>
  <User size={24} weight="bold" /> {/* Phosphor icon */}
  <span>Select Character</span>
</button>
```

### 8. Component Structure

```
feature/
├── components/
│   ├── characters/
│   │   ├── CharacterCard.tsx
│   │   ├── CharacterSelector.tsx
│   │   └── CharacterDialog.tsx
│   ├── ui/
│   │   ├── GlassPanel.tsx
│   │   ├── MonsterButton.tsx
│   │   └── ThemeToggle.tsx
│   └── layout/
│       ├── AlternatingSection.tsx
│       └── MonsterHeader.tsx
├── styles/
│   ├── characters.module.css
│   └── glassmorphism.module.css
└── assets/
    └── character-data.ts
```

### 9. Testing with Visual Regression

```typescript
// Include visual regression tests for UI
describe('CharacterCard Visual Tests', () => {
  it('matches character card appearance', async () => {
    const { container } = render(<CharacterCard character="neo" />);
    expect(await container).toMatchSnapshot();
  });
  
  it('maintains brand colors', () => {
    const styles = getComputedStyle(document.documentElement);
    expect(styles.getPropertyValue('--primary')).toBe('#E22237');
  });
});
```

### 10. MonsterOS-Specific Guidelines

- **Character Integration**: Always show which character/agent is active
- **Glassmorphism**: Use for floating panels, modals, and overlays
- **Color Consistency**: Never deviate from the brand palette
- **Font Usage**: Cadiz Black for emphasis, Cadiz Regular for body
- **Accessibility**: Maintain 4.5:1 contrast ratios minimum
- **Icons**: Only @phosphor-icons/react, choose weights that match Cadiz font
- **Animations**: Subtle, professional, 200-300ms duration
- **Dark Mode**: Always implement both light and dark themes

Remember: The UI should feel professional yet approachable, reflecting MonsterOS's educational and innovative nature!