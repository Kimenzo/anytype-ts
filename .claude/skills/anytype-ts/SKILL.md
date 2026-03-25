```markdown
# anytype-ts Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you how to contribute effectively to the `anytype-ts` codebase, a TypeScript project built with Vite. You'll learn the project's coding conventions, common workflows (such as adding Storybook stories, migrating icons, and fixing chat/dataview bugs), and how to write and run tests. This guide includes step-by-step instructions and code examples to help you follow established patterns and maintain code quality.

## Coding Conventions

**File Naming**
- Use `camelCase` for file names.
  - Example: `iconRegistry.ts`, `dragProvider.tsx`

**Imports**
- Use relative import paths.
  - Example:
    ```ts
    import { IconRegistry } from './iconRegistry'
    import ChatBlock from '../block/chat/chatBlock'
    ```

**Exports**
- Mixed export styles are used (named and default).
  - Example:
    ```ts
    // Named export
    export function getIcon(name: string) { ... }

    // Default export
    export default ChatBlock
    ```

**Commit Messages**
- Freeform, usually with a short prefix (not enforced).
- Average length: ~53 characters.
  - Example: `fix: update icon registry for new SVG icons`

## Workflows

### Storybook Component Stories Workflow
**Trigger:** When you want to add or update Storybook stories for UI components.  
**Command:** `/add-storybook-stories`

1. Create or update `.stories.tsx` files for components under `src/ts/component/**`.
2. Add or update Storybook configuration or helper files under `.storybook/`.
3. Optionally update SCSS files for component styling in `src/scss/`.
4. Optionally update `tsconfig.json` for Storybook compatibility.

**Example:**
```tsx
// src/ts/component/button/button.stories.tsx
import React from 'react'
import { Button } from './button'

export default {
  title: 'Components/Button',
  component: Button,
}

export const Primary = () => <Button primary>Primary Button</Button>
```

---

### Icon Migration and Fix Workflow
**Trigger:** When you want to migrate, add, or fix icons (SVGs) and their usage in components.  
**Command:** `/migrate-icons`

1. Add or update SVG files under `src/img/icon/` or `src/img/arrow/`.
2. Update TypeScript/TSX files to use the new icon registry or `iconParam` props.
3. Update SCSS files for icon styling.
4. Optionally update scripts for icon generation or migration.
5. Optionally update icon index or registry files.

**Example:**
```tsx
// src/ts/component/util/icons/iconRegistry.tsx
import IconAdd from '../../../img/icon/add.svg'

export const IconRegistry = {
  add: IconAdd,
  // ...
}
```

---

### Chat or Dataview Bugfix Workflow
**Trigger:** When you want to fix a bug in chat or dataview components.  
**Command:** `/fix-chat-or-dataview-bug`

1. Update one or more TSX files under `src/ts/component/block/chat/` or `src/ts/component/block/dataview/`.
2. Update related SCSS files for chat or dataview styling.
3. Optionally update utility or provider files for chat/dataview logic.

**Example:**
```tsx
// src/ts/component/block/chat/chatBlock.tsx
export function ChatBlock() {
  // Bugfix: ensure message scrolls to bottom on new message
}
```

---

### Drag-and-Drop Widget Fix Workflow
**Trigger:** When you want to fix or improve drag-and-drop behavior for widgets.  
**Command:** `/fix-widget-drag-drop`

1. Update `src/ts/component/drag/provider.tsx` with new logic or bugfixes.
2. Make multiple sequential commits to refine the behavior.

**Example:**
```tsx
// src/ts/component/drag/provider.tsx
export function DragProvider() {
  // Refactored drag-and-drop logic for widgets
}
```

---

### Dataview Filters and Selection Fix Workflow
**Trigger:** When you want to fix or update dataview filters or selection logic.  
**Command:** `/fix-dataview-filters`

1. Update TSX files under `src/ts/component/block/dataview/filters*`, `selection*`, or related menu files.
2. Update SCSS files for dataview styling.
3. Optionally update utility files for dataview logic.

**Example:**
```tsx
// src/ts/component/block/dataview/filtersMenu.tsx
export function FiltersMenu() {
  // Improved filter logic for dataview
}
```

## Testing Patterns

- **Framework:** [vitest](https://vitest.dev/)
- **Test file pattern:** `*.test.ts`
- **Test files** are colocated with the code or in a `__tests__` directory.

**Example:**
```ts
// src/ts/component/block/chat/chatBlock.test.ts
import { describe, it, expect } from 'vitest'
import { ChatBlock } from './chatBlock'

describe('ChatBlock', () => {
  it('renders without crashing', () => {
    expect(ChatBlock).toBeDefined()
  })
})
```

## Commands

| Command                   | Purpose                                                      |
|---------------------------|--------------------------------------------------------------|
| /add-storybook-stories    | Add or update Storybook stories for UI components            |
| /migrate-icons            | Migrate, add, or fix icons (SVGs) and their usage            |
| /fix-chat-or-dataview-bug | Fix bugs in chat or dataview components                      |
| /fix-widget-drag-drop     | Fix or improve drag-and-drop behavior for widgets            |
| /fix-dataview-filters     | Fix or update dataview filters or selection logic            |
```
