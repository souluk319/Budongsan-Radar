# Codex Implementation Prompt - Budongsan Radar

You are implementing the first MVP of Budongsan Radar, a Korean real estate issue curation product.

## Context

Budongsan Radar is "GeekNews for real estate."

It is not a real estate listing marketplace. It starts as a curated link board where users can read important real estate news, reports, data links, and community posts. Each item has an AI-style summary explaining why the issue matters and who it affects.

Read these files first:

- `README.md`
- `docs/product-brief.md`
- `docs/build-spec.md`

## Goal

Build a working Next.js TypeScript MVP with seed data.

Do not integrate a real database or OpenAI API in the first loop unless explicitly requested. Use local typed seed data so the product shape can be reviewed quickly.

## Required Pages

1. `/`
   - Practical news board/dashboard
   - Today briefing
   - Category filter
   - Region filter
   - Trending/latest link cards

2. `/links/[id]`
   - Link detail page
   - Original source link
   - Tags
   - Summary bullets
   - Why it matters
   - Audience impact
   - Checkpoints

3. `/briefing`
   - Today's top 10 issues
   - Grouped or ranked
   - Short impact line per item

4. `/submit`
   - URL/title/category/region form
   - Mock success state
   - No real persistence required

## Data

Create a seed data module.

Use Korean UI text.

The seed items can be realistic but must be marked as sample/demo content unless using verified live URLs.

## UI Rules

This should feel like a practical information product, not a landing page.

- No oversized marketing hero.
- No card-inside-card layout.
- No decorative gradient blobs.
- Use dense but organized layout.
- Design for scanning, comparison, and repeated daily use.
- Ensure 390px mobile width works.
- Use stable dimensions for filters, cards, and score badges.

## Quality Bar

- TypeScript types should be explicit.
- Keep components small and obvious.
- Avoid premature backend abstraction.
- Use existing project scripts and style patterns if the scaffold already exists.
- Add a short README update if setup commands differ from this prompt.

## Verification

Run:

```bash
npm install
npm run build
```

If a dev server is started, report the local URL.

Before finishing, inspect desktop and mobile layout if browser tooling is available. If not available, report that only build-level verification was performed.

## Completion Report

At the end, report:

- Files created/changed
- What works
- What is mock/demo
- Verification result
- Recommended next step

