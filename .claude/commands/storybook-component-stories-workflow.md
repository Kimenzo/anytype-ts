---
name: storybook-component-stories-workflow
description: Workflow command scaffold for storybook-component-stories-workflow in anytype-ts.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /storybook-component-stories-workflow

Use this workflow when working on **storybook-component-stories-workflow** in `anytype-ts`.

## Goal

Adds or expands Storybook stories for UI components, often with new decorators, helpers, or mock infrastructure.

## Common Files

- `.storybook/*.ts`
- `.storybook/*.tsx`
- `.storybook/*.scss`
- `src/ts/component/**/*.stories.tsx`
- `src/ts/component/**/*.tsx`
- `src/scss/**/*.scss`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update .stories.tsx files for components under src/ts/component/**
- Add or update Storybook configuration or helper files under .storybook/
- Optionally update SCSS files for component styling
- Optionally update tsconfig.json for Storybook compatibility

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.