---
description: read this before implementing or modifying authentication in the project
---

# Clerk Authentication Flow & Protected Routes

## Overview

LinkShorter uses **Clerk (and ONLY Clerk)** for all authentication. This document standardizes how authentication is implemented across the application, including protected route patterns and user redirect logic.

**Critical Rule**: ❌ Do NOT implement any other authentication methods (no custom auth, no other OAuth providers beyond Clerk config). Clerk is the single source of truth for authentication.

---

## Core Principles

1. **Clerk Only** - All authentication flows must use Clerk
2. **Protected Dashboard** - `/dashboard` requires authenticated user
3. **Smart Redirects** - Authenticated users on home page → redirect to dashboard
4. **Modal Auth** - Sign-in/sign-up always launch as modals, never separate pages
5. **Server-Side Checks** - Verify `userId` on protected routes via `auth()` from Clerk

---

## Authentication Setup

### Root Layout Configuration

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LinkShorter',
  description: 'Create and manage short links',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### Environment Variables Required

```
# .env.local (DO NOT COMMIT)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## Authentication Patterns

### Pattern 1: Protected Route (Server Component)

For pages that MUST require authentication (like `/dashboard`):

```typescript
// app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  // ✅ Check authentication server-side
  if (!userId) {
    redirect('/'); // Redirect to home
  }

  // Render protected content
  return (
    <div className="min-h-screen p-8">
      {/* Dashboard content */}
    </div>
  );
}
```

### Pattern 2: Home Page Redirect for Authenticated Users

Home page should redirect authenticated users to dashboard:

```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Show, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function HomePage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ Redirect authenticated users to dashboard
    if (isLoaded && userId) {
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Only show landing page content for non-authenticated users
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold">LinkShorter</div>

        <div className="flex items-center gap-3">
          {/* Show sign in/up buttons only for unauthenticated users */}
          <Show when="signed-out">
            <SignInButton>
              <button className="px-4 py-2 border rounded dark:border-zinc-700">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 bg-zinc-950 text-white rounded dark:bg-white dark:text-zinc-950">
                Sign Up
              </button>
            </SignUpButton>
          </Show>
        </div>
      </header>

      {/* Landing page content */}
    </main>
  );
}
```

### Pattern 3: Modal Sign-In/Sign-Up

Sign-in and sign-up should launch as **modals**, never as separate pages. Use Clerk's modal components:

```typescript
// app/components/AuthButtons.tsx
'use client';

import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthButtons() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) return null;

  return (
    <div className="flex gap-3">
      {/* ✅ SignInButton automatically launches modal */}
      <SignInButton mode="modal">
        <button className="px-4 py-2 border border-zinc-200 rounded dark:border-zinc-700">
          Sign In
        </button>
      </SignInButton>

      {/* ✅ SignUpButton automatically launches modal */}
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-zinc-950 text-white rounded dark:bg-white dark:text-zinc-950">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}
```

**Key**: Always use `mode="modal"` to prevent navigation to separate auth pages.

---

## Protected API Routes

All API routes that access user data must verify authentication:

```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  // ✅ Always authenticate first
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", status: 401 },
      { status: 401 },
    );
  }

  // ✅ Filter by userId (never return other users' data)
  const userLinks = await db.query.links.findMany({
    where: (table) => eq(table.userId, userId),
  });

  return NextResponse.json({ success: true, data: userLinks });
}
```

---

## User Information in Components

### Get Current User (Server Component)

```typescript
// app/components/UserProfile.tsx
import { auth, currentUser } from '@clerk/nextjs/server';

export async function UserProfile() {
  const user = await currentUser();

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
      <p>Name: {user.fullName}</p>
    </div>
  );
}
```

### Get Current User (Client Component)

```typescript
// app/components/UserGreeting.tsx
'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export function UserGreeting() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!userId) return <div>Please sign in</div>;

  return <div>Welcome, {user?.firstName}!</div>;
}
```

---

## Common Patterns

### Conditional UI Based on Auth State

```typescript
'use client';

import { Show, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>LinkShorter</h1>

      {/* Show these when logged out */}
      <Show when="signed-out">
        <div className="flex gap-3">
          {/* Auth buttons */}
        </div>
      </Show>

      {/* Show these when logged in */}
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  );
}
```

### Protecting Async Server Operations

```typescript
// app/actions/createLink.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";

export async function createLink(url: string, title?: string) {
  const { userId } = await auth();

  // ✅ Always verify userId
  if (!userId) {
    throw new Error("Unauthorized: User must be signed in");
  }

  // Create link associated with user
  const newLink = await db
    .insert(links)
    .values({
      userId,
      originalUrl: url,
      title: title ?? null,
    })
    .returning();

  return newLink[0];
}
```

---

## Security Checklist

### Before Deploying Any Feature

- [ ] Clerk is the ONLY auth method used (no custom sessions, no other OAuth)
- [ ] Protected routes verify `userId` from `auth()`
- [ ] Database queries filter by `userId` (never return all user data)
- [ ] API routes return 401 if `userId` is missing
- [ ] Home page redirects authenticated users to dashboard
- [ ] Sign-in/sign-up uses modal mode, never separate pages
- [ ] No user IDs exposed in client-side code
- [ ] Environment variables for Clerk keys are in `.env.local` (never committed)
- [ ] All protected operations check ownership: `userId === resource.userId`

---

## Anti-Patterns (❌ DO NOT DO THIS)

```typescript
// ❌ Don't use custom authentication
const user = localStorage.getItem("user"); // WRONG!

// ❌ Don't expose userId without verification
return db.query.links.findMany(); // Returns ALL links!

// ❌ Don't use separate sign-in/sign-up pages
redirect("/sign-in"); // Use modal instead

// ❌ Don't skip auth checks
export async function GET() {
  const allUsers = await db.query.users.findMany(); // No auth check!
}

// ❌ Don't mix auth methods
if (customAuth || clerkAuth) {
  // Use ONLY Clerk!
}
```

---

## Debugging Authentication Issues

| Problem                          | Solution                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| "userId is undefined"            | Verify `.env.local` has Clerk keys; ClerkProvider wraps app |
| Sign-in opens new page           | Use `mode="modal"` in SignInButton                          |
| Authenticated user stays on home | Check useEffect redirect in page.tsx                        |
| API returns 401 unexpectedly     | Ensure `auth()` is called, verify Clerk middleware setup    |
| User data not loading            | Check `useUser()` and `useAuth()` `isLoaded` flag           |

---

## Cross-References

- [Full Authentication Guide](./authentication.md) - Complete Clerk patterns
- [API Routes](./api-routes.md) - Protected API endpoint patterns
- [Database Schema](./database-schema.md) - Always include userId in tables
- [Coding Best Practices](./coding-best-practices.md) - Security checks

---

## Summary

**The Golden Rule**:

> Every user-facing operation must verify the `userId` from Clerk. If `userId` is missing or doesn't match the resource owner, deny access immediately.

This ensures LinkShorter remains secure, with all authentication flowing through Clerk and all user data properly scoped to the authenticated user.
