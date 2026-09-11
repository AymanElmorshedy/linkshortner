# LinkShorter - LLM Agent Instructions

> **For Developers & AI Agents**: This file is the index for comprehensive coding standards for the LinkShorter project. Read this page first, then refer to specific docs in the `/docs` directory.

<!-- > **CRITICAL RULE: BEFORE GENERATING ANY CODE, ALWAYS read the relevant individual instruction file(s) in `/docs` for the task at hand.** Do not skip the docs, do not infer the implementation from memory alone, and do not write code until the relevant documentation has been reviewed. The docs in `/docs` are the source of truth for project standards and required patterns. -->

---

## 📋 Quick Start

**LinkShorter** is a URL shortening application built with:
- **Frontend**: Next.js 16.3.3, React 19, TypeScript 5, Tailwind CSS 4
- **Backend**: Next.js API Routes with Drizzle ORM
- **Database**: Neon Serverless PostgreSQL
- **Auth**: Clerk 7.8.3

### Core Technologies at a Glance

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | 16.3.3 |
| Language | TypeScript | 5.x |
| UI Library | React | 19.2.8 |
| Styling | Tailwind CSS | 4.x |
| Database | Drizzle ORM | 1.0.0-rc.4 |
| Database Engine | Neon PostgreSQL | Serverless |
| Authentication | Clerk | 7.8.3 |

### Environment Setup

1. Copy `.env.local.example` to `.env.local` (or create new)
2. Add these required variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   DATABASE_URL=postgresql://user:password@host/dbname
   ```
3. Run `npm install && npm run dev`

---

## 📚 Documentation Structure

### For All Developers/Agents

These docs establish **coding standards and patterns** for the LinkShorter project. Read in order based on what you're working on:

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **[Project Structure](./docs/project-structure.md)** | Directory layout, naming conventions, environment setup | First time setup, adding new files |
| **[TypeScript Standards](./docs/typescript-standards.md)** | Type definitions, interfaces, patterns | Before writing any code |
| **[Component Patterns](./docs/component-patterns.md)** | React components, server/client components, hooks | Building UI components |
| **[Shadcn UI Standards](./docs/shadcn-ui-standards.md)** | Required shadcn-based component patterns and no-custom-component rules | Building or editing any UI |
| **[API Routes](./docs/api-routes.md)** | Route handler patterns, response formats, auth | Creating/modifying API endpoints |
| **[Database Schema](./docs/database-schema.md)** | Drizzle ORM, queries, schema patterns | Database work, queries |
| **[Styling Conventions](./docs/styling-conventions.md)** | Tailwind CSS, dark mode, responsive design | UI and styling work |
| **[Authentication](./docs/authentication.md)** | Clerk integration, protected routes, authorization | Auth-related features |
| **[Clerk Auth Flow](./docs/clerk-auth-flow.md)** | Dashboard protection, home page redirects, modal auth | Implementing auth in pages and routes |
| **[Coding Best Practices](./docs/coding-best-practices.md)** | Code organization, naming, errors, security, testing | General coding guidelines |

---

## 🎯 Common Tasks & Workflows

### Creating a New API Endpoint

1. Create file: `app/api/[resource]/route.ts`
2. Reference: [API Routes Documentation](./docs/api-routes.md)
3. Pattern: Authenticate → Validate → Execute → Return
4. Types: Follow [TypeScript Standards](./docs/typescript-standards.md)

### Building a New Component

1. Use shadcn/ui primitives first; do not create custom reusable component files
2. Reference: [Component Patterns](./docs/component-patterns.md) and [Shadcn UI Standards](./docs/shadcn-ui-standards.md)
3. Styles: Use Tailwind utilities with dark mode support
4. Types: Define TypeScript interfaces for props when needed

### Working with Database

1. Define schema in: `db/schema.ts`
2. Reference: [Database Schema](./docs/database-schema.md)
3. Query from: API routes or server components
4. Always filter by `userId` for security

### Adding Authentication

1. Protect routes using: `auth()` from `@clerk/nextjs/server`
2. Reference: [Clerk Auth Flow](./docs/clerk-auth-flow.md) for patterns
3. Implement home page redirect for authenticated users
4. Use modal for sign-in/sign-up (never separate pages)
5. Always verify `userId` on protected routes and APIs
6. Return proper HTTP status codes (401, 403)

### Styling UI

1. Use Tailwind utilities only (no CSS files)
2. Include `dark:` variants for all colors
3. Test responsive with `md:` and `lg:` prefixes
4. Reference: [Styling Conventions](./docs/styling-conventions.md)

---


---

## 🔒 Security Requirements

**Every implementation must include:**

1. **Authentication Check** - Verify user is signed in
   ```typescript
   const { userId } = await auth();
   if (!userId) return unauthorized();
   ```

2. **Authorization Check** - Verify user owns resource
   ```typescript
   // Filter by userId in database queries
   where: (table) => and(eq(table.id, id), eq(table.userId, userId))
   ```

3. **Input Validation** - Check user input before use
   ```typescript
   if (!validateUrl(url)) throw new ValidationError(...);
   ```

4. **No Hardcoded Secrets** - Use environment variables
   ```typescript
   const key = process.env.CLERK_SECRET_KEY; // ✅
   const key = "sk_...";  // ❌
   ```

---

## 🧪 Testing Your Work

### TypeScript Validation
```bash
npx tsc --noEmit
```

### Run Dev Server
```bash
npm run dev
# Visit http://localhost:3000
```

### Database Changes
```bash
npx drizzle-kit push:pg
npx drizzle-kit studio  # Visual DB browser
```

### Linting
```bash
npm run lint
npm run lint -- --fix
```

### Manual Testing Checklist
- [ ] Light mode looks correct
- [ ] Dark mode looks correct
- [ ] Mobile responsive (use DevTools)
- [ ] Authentication works
- [ ] Error states handled
- [ ] All TypeScript strict mode passes

---

## 📖 Key Files Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with ClerkProvider |
| `app/page.tsx` | Landing page template |
| `db/schema.ts` | Database table definitions |
| `db/index.ts` | Database connection setup |
| `components/ui/` | Reusable UI components |
| `lib/utils.ts` | Utility functions |
| `.env.local` | Local environment variables (gitignored) |
| `CLAUDE.md` | Claude-specific guidelines |

---

## 🚀 Development Commands

### Setup & Running
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start                # Run production build
```

### Database
```bash
npx drizzle-kit push:pg  # Apply schema changes
npx drizzle-kit generate:pg  # Generate migrations
npx drizzle-kit studio   # Open Drizzle Studio UI
```

### Code Quality
```bash
npm run lint             # Check linting
npm run lint -- --fix    # Fix linting issues
npx tsc --noEmit         # Check TypeScript
```

---

## 📝 Next.js Version Notice

**Important**: This project uses **Next.js 16.3.3**, which has breaking changes from earlier versions.

Before writing code:
- Check `node_modules/next/dist/docs/` for current API documentation
- Watch for deprecation warnings in console
- Refer to [Next.js 16 migration guides](https://nextjs.org/docs)
- Use App Router (`app/` directory) conventions
- Server components by default, `'use client'` when needed

---

## 🤝 Contributing Guidelines

### Code Review Process

When submitting code for review, ensure:
1. All files follow naming conventions
2. TypeScript strict mode passes (`npx tsc --noEmit`)
3. Components include dark mode support
4. API routes verify authentication/authorization
5. Database queries filter by `userId` where applicable
6. Error handling is complete
7. Comments explain "why" not "what"
8. No console errors or warnings

### Documentation Updates

Update these files when:
- Adding new dependencies
- Changing folder structure
- Creating new common patterns
- Discovering important gotchas
- Upgrading library versions

---

## 📞 Common Questions

**Q: Where should I put new components?**  
A: In `components/ui/` directory, then export from `components/ui/index.ts`

**Q: How do I handle authentication?**  
A: See [Authentication](./docs/authentication.md). Always use `auth()` server-side.

**Q: What about CSS/styling?**  
A: Use Tailwind utilities only. See [Styling Conventions](./docs/styling-conventions.md)

**Q: How do I query the database?**  
A: Use Drizzle ORM in server components or API routes. See [Database Schema](./docs/database-schema.md)

**Q: Should I use `any` type?**  
A: No. Define proper TypeScript types. See [TypeScript Standards](./docs/typescript-standards.md)

**Q: What's the URL structure for shortened links?**  
A: Pattern: `linkshorter.app/[shortCode]` (redirects to original URL)

---

## 🔗 External Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

---

## 📅 Last Updated

Check git history for recent changes. Update this document when:
- Dependencies are upgraded
- New major patterns are established
- Critical gotchas are discovered
- Project structure changes

---

**START HERE**: Read the documentation guide above that matches your task, then implement following those standards!

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
