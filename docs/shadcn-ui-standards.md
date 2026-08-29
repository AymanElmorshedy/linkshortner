# Shadcn UI Standards

## Core Rule

All user-facing UI in LinkShorter must use shadcn/ui components. Do not build custom reusable UI components unless they are direct shadcn primitives or wrappers from the official shadcn registry.

## Required Pattern

- Use shadcn components for buttons, inputs, cards, dialogs, tables, dropdowns, badges, tabs, and other interface elements.
- Prefer existing shadcn primitives over custom HTML or ad hoc styling.
- Keep styling in Tailwind utilities only.
- Reuse the generated component set in the project instead of creating new component files.
- If a pattern is needed, compose shadcn primitives rather than inventing a custom component.

## Prohibited

- Do not create custom component files such as MyButton.tsx, Modal.tsx, Card.tsx, or Input.tsx.
- Do not hand-roll button/input/card styles when shadcn equivalents already exist.
- Do not add CSS-only UI patterns that duplicate shadcn design system behavior.

## Preferred Workflow

1. Check whether the required UI already exists as a shadcn component.
2. Use the shadcn component with the correct variant and props.
3. Apply Tailwind classes only for spacing, layout, and state styling.
4. Keep behavior consistent with the rest of the app.

## Example

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LinkForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="https://example.com" />
        <Button>Shorten URL</Button>
      </CardContent>
    </Card>
  );
}
```

## Decision Rule

If a UI element can reasonably be implemented with a shadcn component, it must be implemented with a shadcn component.
