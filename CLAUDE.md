# Claude-Specific Guidelines for LinkShorter

> **Start Here**: Read [AGENTS.md](./AGENTS.md) first for the main project documentation and coding standards.

---

## Your Role

As Claude, you're helping implement features and fix issues while maintaining the project's coding standards. Your focus:

1. **Follow established patterns** - Use examples from existing code
2. **Maintain type safety** - No `any` types, full TypeScript
3. **Think about security** - Always verify user ownership of resources
4. **Consider dark mode** - Include `dark:` classes for all UI
5. **Provide clear explanations** - Explain what and why

---

## Before You Start Any Task

### 1. Read the Relevant Documentation

- **Building UI?** → [Component Patterns](./docs/component-patterns.md)
- **Creating API?** → [API Routes](./docs/api-routes.md)
- **Database work?** → [Database Schema](./docs/database-schema.md)
- **Styling?** → [Styling Conventions](./docs/styling-conventions.md)
- **Auth features?** → [Authentication](./docs/authentication.md)
- **General coding?** → [Coding Best Practices](./docs/coding-best-practices.md)

### 2. Examine Existing Code

- Look at similar files in the project
- Copy the style and patterns you see
- Ask yourself: "Does this match the existing code?"

### 3. Check for Conflicts

- Will this break existing functionality?
- Does it require database schema changes?
- Are there security implications?

---

## Implementation Standards

### TypeScript

- ✅ Always define types for function parameters and returns
- ✅ Use interfaces for object shapes
- ✅ Import types with `import type { ... }`
- ❌ Never use `any` - use `unknown` or specific types instead
- ✅ Enable strict mode (it's already enabled)

### Components

- ✅ Use `clsx` for conditional classes
- ✅ Include dark mode (`dark:` prefix) for all colors/backgrounds
- ✅ Server components by default, `'use client'` only when needed
- ✅ Pass data via props instead of using global state
- ❌ Don't create CSS files - use Tailwind utilities

### API Routes

- ✅ Authenticate first: `const { userId } = await auth();`
- ✅ Verify user owns resource before returning/modifying
- ✅ Use consistent response format: `{ success, data, error }`
- ✅ Return proper HTTP status codes (401, 403, 404, 409, 500)
- ❌ Never return user data without verification

### Database

- ✅ Always include `userId` in WHERE clauses for user resources
- ✅ Use timestamps on all tables (`createdAt`, `updatedAt`)
- ✅ Define proper indexes for performance
- ✅ Use Drizzle ORM for all queries
- ❌ Never hardcode SQL strings

### Security

- ✅ Verify `userId` from Clerk before trusting it
- ✅ Filter database queries by `userId`
- ✅ Validate all user input
- ✅ Use environment variables for secrets
- ❌ Never hardcode API keys or secrets

---

## Code Quality Checklist

Before marking work as complete, ensure:

- [ ] TypeScript `npx tsc --noEmit` passes (no errors)
- [ ] Code follows naming conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
- [ ] All functions have explicit return types
- [ ] No `any` types in code
- [ ] Dark mode support included for UI components
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] API routes verify authentication
- [ ] Database queries filter by `userId`
- [ ] Error handling in place (try-catch for async)
- [ ] Comments explain complex logic (not obvious code)
- [ ] Code matches existing patterns in the project

---

## File Organization

### Where to Put Code

```
New page?
  → app/[name]/page.tsx

New API endpoint?
  → app/api/[resource]/route.ts

New UI component?
  → components/ui/MyComponent.tsx
  → export from components/ui/index.ts

Utility function?
  → lib/utils.ts (or create lib/[category].ts)

Database schema?
  → db/schema.ts
```

### Import Organization

```typescript
// 1. React & Next
import { useState } from "react";
import { auth } from "@clerk/nextjs/server";

// 2. Third-party
import { clsx } from "clsx";
import { eq } from "drizzle-orm";

// 3. Local (use @ alias)
import { Button } from "@/components/ui";
import { db } from "@/db";

// 4. Types (type imports)
import type { Link } from "@/db/schema";
```

---

## Common Patterns

### Protected API Route

```typescript
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { userId } = await auth();

  // 1. Authenticate
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", status: 401 },
      { status: 401 },
    );
  }

  // 2. Your logic here

  // 3. Return response
  return NextResponse.json({ success: true, data: result });
}
```

### Component with Props

```typescript
import { clsx } from 'clsx';

interface MyComponentProps {
  title: string;
  isActive?: boolean;
  className?: string;
}

export function MyComponent({
  title,
  isActive = false,
  className
}: MyComponentProps) {
  return (
    <div className={clsx(
      'p-4 rounded-lg',
      isActive && 'bg-blue-100 dark:bg-blue-900',
      !isActive && 'bg-gray-100 dark:bg-gray-900',
      className,
    )}>
      {title}
    </div>
  );
}
```

### Database Query with User Filter

```typescript
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getUserLinks(userId: string) {
  return await db.query.links.findMany({
    where: (table) => eq(table.userId, userId),
    orderBy: (table) => table.createdAt,
  });
}
```

---

## Debugging Strategy

When something doesn't work:

1. **Check the browser console** - Look for JavaScript errors
2. **Check the terminal** - Look for Next.js errors
3. **Check TypeScript** - Run `npx tsc --noEmit`
4. **Check the database** - Use `npx drizzle-kit studio`
5. **Check environment variables** - Is `.env.local` set up?
6. **Check authentication** - Is `userId` actually being returned?
7. **Add console.log** - Debug strategically with `console.error()`
8. **Check similar code** - Look at working examples in the project

### Common Issues

| Issue                     | Solution                                 |
| ------------------------- | ---------------------------------------- |
| 401 Unauthorized          | Check if user is signed in with Clerk    |
| 403 Forbidden             | Verify userId matches resource owner     |
| 404 Not Found             | Check if ID/shortCode exists in database |
| Dark mode broken          | Forgot `dark:` prefix on color classes   |
| TypeScript errors         | Check interface definitions and imports  |
| Database connection fails | Verify `DATABASE_URL` in `.env.local`    |

---

## Communication with Users

When implementing:

1. **Explain what you're doing** - "I'll create an API endpoint at `/api/links`"
2. **Explain why** - "This validates the URL format to prevent bad data"
3. **Point to patterns** - "Following the same pattern as the sign-up page"
4. **Ask clarifying questions** - "Should this endpoint require authentication?"
5. **Provide complete implementations** - Not just suggestions

### Example Communication

```
I'll create a new API endpoint at `app/api/links/[id]/route.ts` to handle link updates.

The endpoint will:
1. Authenticate the user with Clerk
2. Verify they own the link (security check)
3. Validate the input data
4. Update the database
5. Return the updated link

This follows the same pattern as other protected routes in the project.
```

---

## Project Context

### What LinkShorter Does

- Users can create shortened links from long URLs
- Track clicks on each shortened link
- Manage their links in a dashboard
- Share short links that redirect to originals

### Key Workflow

1. User signs up/signs in via Clerk
2. User creates a link (stores original URL → short code mapping)
3. User gets a share link: `linkshorter.app/[shortCode]`
4. Visitors click link → redirects to original URL
5. Analytics track each click

### Important Constraints

- Users can only see/modify their own links
- Short codes must be unique
- Links can expire (optional)
- No public API - internal use only

---

## Tools & Commands You'll Use

```bash
# Start dev server
npm run dev

# Check TypeScript
npx tsc --noEmit

# Fix linting
npm run lint -- --fix

# Database operations
npx drizzle-kit push:pg      # Apply changes
npx drizzle-kit generate:pg  # Generate migrations
npx drizzle-kit studio       # UI for database

# Build for production
npm run build
npm start
```

---

## Quick Reference

| Need               | Resource                                                 |
| ------------------ | -------------------------------------------------------- |
| Component examples | [Component Patterns](./docs/component-patterns.md)       |
| API examples       | [API Routes](./docs/api-routes.md)                       |
| Tailwind classes   | [Styling Conventions](./docs/styling-conventions.md)     |
| Database patterns  | [Database Schema](./docs/database-schema.md)             |
| Type examples      | [TypeScript Standards](./docs/typescript-standards.md)   |
| Auth patterns      | [Authentication](./docs/authentication.md)               |
| General coding     | [Coding Best Practices](./docs/coding-best-practices.md) |
| Project setup      | [Project Structure](./docs/project-structure.md)         |

---

## You're Ready!

You now have everything needed to:

- ✅ Understand the project structure
- ✅ Follow coding standards
- ✅ Implement features securely
- ✅ Match existing code patterns
- ✅ Debug issues effectively

**When you're asked to build something:**

1. Read the relevant doc above
2. Look at similar existing code
3. Ask clarifying questions if needed
4. Implement following the standards
5. Test and verify it works

Good luck! 🚀
