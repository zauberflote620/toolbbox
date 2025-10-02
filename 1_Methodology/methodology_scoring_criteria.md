# Methodology Scoring Criteria & Evaluation Framework

This document defines the scoring criteria for evaluating shop reset methodologies, with emphasis on visual-aware factors and user-configurable constraints.

## Scoring Criteria Definition

### 1. Safety Accommodation (Weight: 15%)
**Definition:** How well the methodology accounts for safety constraints such as fragile item placement, emergency egress, and weight distribution.

**Scoring Scale (1-5):**
- 5: Explicitly addresses all safety constraints with clear guidelines
- 4: Addresses most safety constraints with some guidelines
- 3: Basic safety consideration with minimal guidelines
- 2: Limited safety consideration
- 1: No safety consideration

### 2. Visibility Accommodation (Weight: 15%)
**Definition:** How effectively the methodology handles visibility constraints such as sight lines, height restrictions, and visual accessibility.

**Scoring Scale (1-5):**
- 5: Comprehensive visibility planning with clear sight line management
- 4: Good visibility consideration with some sight line planning
- 3: Basic visibility awareness
- 2: Limited visibility consideration
- 1: No visibility planning

### 3. Lighting Fit (Weight: 10%)
**Definition:** How well the methodology adapts to lighting conditions, especially for dim POS areas requiring high contrast tactics.

**Scoring Scale (1-5):**
- 5: Explicit lighting-based placement strategies and contrast tactics
- 4: Good lighting awareness with some adaptation strategies
- 3: Basic lighting consideration
- 2: Limited lighting awareness
- 1: No lighting consideration

### 4. Journey Coherence (Weight: 20%)
**Definition:** How logically and intuitively the methodology guides customer flow and creates a coherent shopping experience.

**Scoring Scale (1-5):**
- 5: Creates highly intuitive, logical customer journey with clear flow
- 4: Good customer flow with mostly logical progression
- 3: Adequate customer journey with some logical gaps
- 2: Basic customer flow with limited coherence
- 1: Poor or confusing customer journey

### 5. Visual Legibility & Scannability (Weight: 15%)
**Definition:** How easily the methodology's artifacts can be read, understood, and acted upon by staff at a glance.

**Scoring Scale (1-5):**
- 5: Highly scannable artifacts with clear visual hierarchy and instant comprehension
- 4: Good visual clarity with mostly scannable artifacts
- 3: Adequate visual presentation with some clarity issues
- 2: Limited visual clarity, requires effort to understand
- 1: Poor visual presentation, difficult to scan

### 6. Layout-Preview Fidelity (Weight: 10%)
**Definition:** How accurately the methodology's visual artifacts predict and represent the actual physical layout.

**Scoring Scale (1-5):**
- 5: Visual artifacts precisely predict physical reality
- 4: Good correlation between visuals and physical layout
- 3: Adequate visual-to-physical translation
- 2: Limited visual-to-physical accuracy
- 1: Poor visual-to-physical correlation

### 7. Reusability/Parameterization (Weight: 10%)
**Definition:** How easily the methodology can be adapted and reused for different shop configurations and constraints.

**Scoring Scale (1-5):**
- 5: Highly parameterizable with clear configuration options
- 4: Good adaptability with some configuration flexibility
- 3: Moderate reusability with basic parameterization
- 2: Limited reusability, requires significant modification
- 1: Poor reusability, methodology-specific

### 8. Time-to-Execute (Weight: 3%)
**Definition:** How quickly the methodology can be implemented from planning to completion.

**Scoring Scale (1-5):**
- 5: Very fast execution (< 2 hours for small shop)
- 4: Fast execution (2-4 hours for small shop)
- 3: Moderate execution time (4-6 hours for small shop)
- 2: Slow execution (6-8 hours for small shop)
- 1: Very slow execution (> 8 hours for small shop)

### 9. Staff Cognitive Load (Weight: 2%)
**Definition:** How much mental effort and training is required for staff to understand and execute the methodology.

**Scoring Scale (1-5):**
- 5: Minimal cognitive load, intuitive for any staff member
- 4: Low cognitive load, easy to understand with brief training
- 3: Moderate cognitive load, requires some training
- 2: High cognitive load, requires significant training
- 1: Very high cognitive load, requires extensive training

## Default Weights Configuration

```yaml
scoring_weights:
  safety_accommodation: 0.15
  visibility_accommodation: 0.15
  lighting_fit: 0.10
  journey_coherence: 0.20
  visual_legibility: 0.15
  layout_preview_fidelity: 0.10
  reusability: 0.10
  time_to_execute: 0.03
  staff_cognitive_load: 0.02
```

## User Override Configuration Template

```yaml
# User can modify these weights based on their priorities
custom_scoring_weights:
  safety_accommodation: <PLACEHOLDER: 0.00-1.00, default 0.15>
  visibility_accommodation: <PLACEHOLDER: 0.00-1.00, default 0.15>
  lighting_fit: <PLACEHOLDER: 0.00-1.00, default 0.10>
  journey_coherence: <PLACEHOLDER: 0.00-1.00, default 0.20>
  visual_legibility: <PLACEHOLDER: 0.00-1.00, default 0.15>
  layout_preview_fidelity: <PLACEHOLDER: 0.00-1.00, default 0.10>
  reusability: <PLACEHOLDER: 0.00-1.00, default 0.10>
  time_to_execute: <PLACEHOLDER: 0.00-1.00, default 0.03>
  staff_cognitive_load: <PLACEHOLDER: 0.00-1.00, default 0.02>

# Note: Weights must sum to 1.00
```

## Methodology Evaluation Matrix

| Methodology | Safety | Visibility | Lighting | Journey | Visual Leg. | Layout Fid. | Reusability | Time | Cognitive | **Weighted Score** |
|-------------|--------|------------|----------|---------|-------------|-------------|-------------|------|-----------|-------------------|
| Journey-First | 3 | 4 | 3 | 5 | 4 | 4 | 4 | 3 | 3 | **3.75** |
| Category-First | 4 | 3 | 2 | 3 | 5 | 5 | 5 | 4 | 4 | **3.85** |
| Demand/Velocity-First | 3 | 3 | 4 | 3 | 3 | 3 | 3 | 5 | 4 | **3.30** |
| Theme/Story-First | 2 | 4 | 3 | 4 | 3 | 3 | 2 | 2 | 2 | **3.05** |
| Anchor-and-Spokes | 4 | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 4 | **4.25** |

## Scoring Rationale

### Journey-First (Score: 3.75)
**Strengths:** Excellent journey coherence and good visual legibility. Creates intuitive customer flow.
**Weaknesses:** Moderate safety consideration and execution time. Requires more planning effort.

### Category-First (Score: 3.85)
**Strengths:** High visual legibility, excellent layout fidelity, and strong reusability. Easy to execute and understand.
**Weaknesses:** Limited lighting adaptation and moderate journey coherence.

### Demand/Velocity-First (Score: 3.30)
**Strengths:** Fast execution and good lighting adaptation through data-driven placement.
**Weaknesses:** Lower visual legibility and limited reusability. Requires ongoing data analysis.

### Theme/Story-First (Score: 3.05)
**Strengths:** Good visibility accommodation and journey coherence through immersive experiences.
**Weaknesses:** Lower safety consideration, limited reusability, and high execution complexity.

### Anchor-and-Spokes (Score: 4.25)
**Strengths:** Excellent visibility accommodation, high visual legibility, balanced approach across all criteria.
**Weaknesses:** None significant; consistently strong performance across all metrics.

## Visual Scoring Summary

```
Methodology Performance Radar
     Safety
        |
Cognitive  \   / Visibility
Load        \ /
             X
Time        / \
           /   \
    Reusability  Lighting
```

**Winner: Anchor-and-Spokes Methodology (4.25/5.0)**

The Anchor-and-Spokes methodology emerges as the optimal choice due to its balanced performance across all criteria, particularly excelling in visibility accommodation and visual legibility while maintaining strong safety and reusability scores.
