# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Rules: 
1. always Plan-execute-critique/revise/blind-validate-refine
2. NEVER use CODE snippets for PLANS. WORDS only. 
3. NO EMOJIS. NO CO AUTHORSHIPS. NO ATTRIBUTIONS. 

## Overview

The Shop Reset Toolbox is a comprehensive retail planning toolkit built around the **Anchor-and-Spokes** methodology. It consists of documentation, templates, and a React web application for visual planning and AI-assisted shop layout optimization.

## Architecture

### Directory Structure
- `1_Methodology/` - Methodology research, scoring criteria, and decision records
- `2_Configuration/` - Constraint intake forms and parameterization models
- `3_Artifacts/` - Template files for visual artifacts (maps, cards)
- `4_Process/` - Process guides including validation loops and re-run procedures
- `INDEX.md` - Main overview and artifact index
- `Your Tiny, Beginner-Friendly Shop Reset Kit.md` - Complete React app code and setup guide

### Core Methodology
The toolbox implements the **Anchor-and-Spokes** approach:
- **Anchors**: Key products or displays positioned in high-traffic zones
- **Spokes**: Complementary products clustered around anchors
- Creates natural points of interest that guide customer flow
- Selected after evaluating 5 methodologies across 9 criteria (scored 4.25/5.0)

### React Application
Embedded within the documentation is a complete React app for visual planning:
- **Technology Stack**: React 19.1.0, Vite 6.3.5, Tailwind CSS 4.1.7
- **Key Components**: AI client integration, visual priority system, responsive design
- **Data Structure**: JSON-based shop plans with sections and prioritized items
- **AI Integration**: OpenAI API support with intelligent fallback to mock data

## Development Commands

### For the React Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### File Structure for React App
When implementing the React application, create this structure:
```
shop-reset-kit/
├── public/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── aiClient.js
│   ├── main.jsx
│   └── plan.json
├── index.html
├── package.json
└── vite.config.js
```

## Key Features

### Configuration System
- `constraints.yaml` - Physical layout constraints and safety rules
- `config.yaml` - Reset goals and parameterization knobs
- Template-based approach with placeholder replacement

### Visual Artifacts
- **Anchor & Spoke Map** - Primary visual layout plan
- **Product Relationship Cards** - Detailed merchandising guides
- Generated as PDF/PNG outputs for printing and distribution

### Process Flow
1. **Configure** - Update YAML files with constraints and goals
2. **Generate** - Run generation script to create visual artifacts
3. **Execute** - Print guides, reset floor, validate with QA checklist

## Important Notes

- This is primarily a documentation and planning toolkit, not a traditional software project
- The React application code is embedded within markdown documentation
- Focus on the **Anchor-and-Spokes** methodology when making suggestions
- All placeholders use format `<PLACEHOLDER: description>`
- Generation scripts and automation are referenced but not implemented
- Visual-first approach emphasizes clarity and ease of execution