# 1PWR Leadership Adaptive Assessment

## Purpose
A comprehensive adaptive assessment that baselines **Matt’s** (CEO, 1PWR Africa) knowledge, reasoning, and judgment across domains relevant to leading a minigrid company in Lesotho, Benin, and Zambia—and **feeds a loop**: assess → diagnose gaps → tailored learning → **periodic retesting** to track and steer effectiveness.

**This file is the single source of truth** for project context and evolving intent. Revise it when direction changes; use `SESSION_LOG.md` as the chronological record to reconcile into this file.

---

## User-stated intent (authoritative)

### Who sees the data
- Assessment **data and its analysis** are **strictly between Matt and his AI agents**—not a public or broadcast analytics pipeline.

### What “success” looks like
1. Matt’s **knowledge and capabilities have been assessed**.
2. **Core deficits** tied to **professional work** are **categorized and prioritized** for action.
3. That feeds a **tailored learning program**.
4. **Effectiveness** of that program is **tracked and steered** by **periodic retesting** (same instrument over time).

### Data flow (target)
- Whether Matt uses **phone or computer**, **browser session results must reach** a place where an **agent can analyze** them and:
  - Incorporate into a **personal knowledge base** (assessment / learning / profile of Matt as learner).
  - **Update a profile** with appropriate context.
- Keep this **separate** from the **professional-life knowledge base** maintained in the **Email Overlord** repo (and similar)—**do not conflate** the two; cross-reference only with care.

**Implementation note:** The in-repo app today persists via **in-memory state + JSON export/import** (no `localStorage` in artifact targets). Closing the gap to “always reaches agents” is a **deliberate integration** (e.g. export upload into an agent workflow, or a private backend)—to be designed without publishing raw results broadly.

### Granularity of analysis (errors)
- **Do not lose detail** on what Matt got wrong. Analysis should support building a **theory of error** (why the wrong answer, what misconception or gap) and how instruction might **correct** it—not only a score.

### Experience Matt needs
- A **URL** where he can answer questions **at his own pace**, such that results **enhance the mapping** of:
  - **Knowledge**, **intelligence** (as exercised by items), **personality** (scenario-based items), and **capacity to be useful in role**.
- **Coverage**: **Start wide** across the taxonomy; **go as deep as reasonably relevant** for **leading 1PWR** (CEO-level). Not elite depth in narrow trivia (e.g. 16th-century art), but **not ignorant** of topics that might arise in **interpersonal interaction** or with **important counterparties**.

### Operations and governance
- **Deployment / canonical URL**: maintain a stable place to take the assessment (e.g. GitHub Pages build and/or 1PWR-hosted static path—see `README.md` / `DEPLOY.md`); **evolve** as needed.
- **Ownership of changes**: **Matt’s AI tools**, **via Matt’s instruction** (not unilateral external publishing).
- **Session logs**: **Capture all relevant detail** in `SESSION_LOG.md` when work is substantive.

### Boundaries for agents
- **Do not publish** assessment or profile content **outside** Matt’s interactions with his agents (no public dumps of personal results).
- When interrogating **Email Overlord** or **other repos** for broader context, **do not undermine data integrity**—treat external KBs as authoritative for their domain; don’t corrupt assessment conclusions with sloppy merges.

---

### Intent (living) — summary bullets
- **Primary goal**: Closed-loop **assess → prioritize deficits → learn → retest**, with **agent-accessible** session data and **rich error analysis**.
- **Non-goals**: Public-facing telemetry; treating assessment data as the same store as Email Overlord professional KB; shallow or trivial coverage at the expense of **leadership-relevant** depth.

### Protocol: capturing intent and evolving it (CONTEXT ↔ session logs)
1. **Where intent lives**: Only in **this file**—especially **User-stated intent**, **Intent (living)**, and **Current State** below.
2. **`SESSION_LOG.md`**: Append after each **meaningful session**: date, focus, changes, decisions, open questions. **Facts about what we did**; not a substitute for this file.
3. **Reconciling**: When priorities or goals **shift**, **update this file** using recent `SESSION_LOG.md` as reference. **Order**: session → log → **edit CONTEXT** when intent moves.

---

## Architecture
Single-file React JSX app (`src/App.jsx`) designed to render in Claude's Cowork artifact viewer and in a **Vite** static build (`npm run build` → `dist/`) for hosting.

### Key Constraints
- **Single file**: Assessment logic and question bank live in one `.jsx` file — no separate data files for `Q`.
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
- **2026-04-15**: **User-stated intent** captured in full (closed loop assess→learn→retest; agent-only; separation from Email Overlord KB; rich error analysis; wide terrain, CEO-relevant depth).
- **2026-04-15 (POE pass)**: Rewrote **distractors** on many scenario-style items so wrong answers are **plausible, similar length** to the key (reduces “longest = correct” and cartoon-wrong options). Ongoing: run `npm run audit:questions` and fix remaining high-gap rows. Runtime **shuffle** remains essential.
- Question bank: large and growing; target even coverage across domains and levels.
- NEED: Expand/polish **question bank** where coverage is thin; **factual** accuracy.
- NEED: **UI** for longitudinal view (retesting, progress over time) aligned with intent.
- NEED: **Integration path** from browser/export to **agent analysis** and **personal KB** (explicit design—no accidental public leakage).

## Quality Standards for Questions
- Questions must be factually accurate
- Difficulty must genuinely progress (L1=obvious, L5=specialist)
- Distractors must be plausible, not silly
- Explanations should teach, not just confirm
- Psychology/personality questions use scenarios, not self-report
- Language questions (French, Sesotho) should include business/energy vocabulary relevant to 1PWR operations
- All questions should have exactly 4 options
- **Breadth vs depth**: wide sweep across domains; **deepen** where relevant to **1PWR leadership**, not esoteric trivia
