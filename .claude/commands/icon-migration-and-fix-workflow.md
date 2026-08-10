---
name: icon-migration-and-fix-workflow
description: Workflow command scaffold for icon-migration-and-fix-workflow in anytype-ts.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /icon-migration-and-fix-workflow

Use this workflow when working on **icon-migration-and-fix-workflow** in `anytype-ts`.

## Goal

Migrates icon usage from className-based to SVG registry, adds new SVG files, and fixes icon rendering across the app.

## Common Files

- `src/img/icon/**/*.svg`
- `src/img/arrow/**/*.svg`
- `src/ts/component/**/*.tsx`
- `src/ts/component/util/icons/**/*.tsx`
- `src/scss/**/*.scss`
- `scripts/generate-icon-components.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or update SVG files under src/img/icon/ or src/img/arrow/
- Update TypeScript/TSX files to use new icon registry or iconParam props
- Update SCSS files for icon styling
- Optionally update scripts for icon generation or migration
- Optionally update icon index or registry files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.