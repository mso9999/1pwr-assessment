# 1PWR Leadership Adaptive Assessment

## Purpose
A comprehensive adaptive assessment tool that baselines Matt's (CEO, 1PWR Africa) knowledge and cognitive abilities across all domains relevant to leading a minigrid company operating in Lesotho, Benin, and Zambia.

## Architecture
Single-file React JSX app (`src/App.jsx`) designed to render in Claude's Cowork artifact viewer.

### Key Constraints
- **Single file**: Everything in one `.jsx` file — no separate CSS, no separate data files
- **No localStorage**: Claude artifacts don't support browser storage APIs. All state is in React `useState`.
- **Available libraries**: React, recharts, lodash, lucide-react, d3, Tailwind (utility classes only)
- **Export/Import**: JSON file download/upload for multi-session persistence (since no localStorage)

## Domain Taxonomy (45 domains, 11 categories)

### Categories
| Key | Category | Color |
|-----|----------|-------|
| POWER | Power & Energy | #f59e0b |
| STEM | STEM Foundations | #3b82f6 |
| SOFTWARE | Software & Data | #8b5cf6 |
| BUSINESS | Business & Finance | #10b981 |
| OPS | Operations | #ef4444 |
| LEGAL | Governance & Legal | #6366f1 |
| COMM | Communication | #ec4899 |
| LANG | Languages | #14b8a6 |
| REASONING | Analytical Reasoning | #f97316 |
| HUMANITIES | Humanities & Knowledge | #78716c |
| PSYCH | Psychology & Self | #a855f7 |

### Domains
See the DOMAINS object in App.jsx for the full list. Includes: electrical, solar, battery, minigrid, physics, math, statistics, chemistry, software, data, iot, cloud, projfinance, accounting, strategy, sales, projmgmt, procurement, safety, assetmgmt, governance, legal, ethics, contracts, writing, leadership, negotiation, crosscultural, english, french, sesotho, logic, quantitative, systems, fluid_intel, african_hist, world_hist, economics, environment, literature, music, philosophy, ego, selfcontrol, emotional_iq, cognitive_bias, personality

## Question Format
Questions are stored in array `Q` as tuples:
```
[domainKey, difficultyLevel(1-5), questionText, [option1, option2, option3, option4], correctIndex, explanation]
```

Difficulty levels:
- 1 = Foundational (anyone should know)
- 2 = Intermediate (educated professional)
- 3 = Proficient (working knowledge in the field)
- 4 = Advanced (deep expertise)
- 5 = Expert (specialist-level mastery)

## Adaptive Algorithm
- Each domain starts at difficulty 3
- Correct answer → difficulty +1 (cap at 5)
- Incorrect → difficulty -1 (floor at 1)
- Ability estimate: weighted score across difficulty levels attempted
- Questions are selected by: least-attempted domain first, then current difficulty, then nearby difficulties

## Matt's Context
- **Role**: CEO of 1PWR Africa (minigrid company)
- **Education**: MIT alum
- **Countries**: Lesotho, Benin, Zambia
- **Languages**: English (native), French (limited), Sesotho (basic/rudimentary)
- **Tech skills**: Python, Node.js, TypeScript, React, embedded C, Rust, KiCad
- **Repos**: 20+ covering customer care, asset management, grid planning, IoT mesh, smart meters, financial modeling, procurement, SMS comms, RC aircraft, cryptography
- **Key interests**: hardware + software integration, energy access, AI-augmented operations

## Current State
- Initial question bank: ~200 questions across most domains
- NEED: Expand to 500+ questions with better coverage of all 45 domains
- NEED: Ensure every domain has questions at all 5 difficulty levels (minimum 2 per level)
- NEED: Fix any incorrect answers or explanations
- NEED: Add more fluid intelligence puzzles, cognitive bias scenarios, and personality assessment items
- NEED: Polish UI — better results analytics, per-session tracking, progress over time

## Quality Standards for Questions
- Questions must be factually accurate
- Difficulty must genuinely progress (L1=obvious, L5=specialist)
- Distractors must be plausible, not silly
- Explanations should teach, not just confirm
- Psychology/personality questions use scenarios, not self-report
- Language questions (French, Sesotho) should include business/energy vocabulary relevant to 1PWR operations
- All questions should have exactly 4 options
