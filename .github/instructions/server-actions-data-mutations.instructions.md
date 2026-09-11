---
description: "Use when implementing or modifying data mutations, server actions, client components that call mutations, or Drizzle data helpers. Covers authentication, Zod validation, typed inputs, action placement, and database boundaries."
<!-- applyTo: ["app/**/actions.ts", "app/**/*.tsx", "components/**/*.tsx", "data/**/*.ts"] -->
---

# Server Actions and Data Mutations

- Implement every data mutation as a server action. Server action files must be named `actions.ts` and colocated with the component that calls them.
- Call server actions from client components. Keep the client responsible for collecting typed values and invoking the action; keep authorization and persistence on the server.
- Give every action a dedicated TypeScript input type. Do not use the `FormData` type.
- Validate all action input with a Zod schema before performing any database operation.
- Check for an authenticated Clerk user before continuing to database work. Return a clear unauthorized result when no user is signed in.
- Server actions must not throw errors. Return an object with either an `error` property for failures or a `success` property for successful operations.
- Keep Drizzle queries out of server actions. Put database operations in typed helper functions under `/data`, and pass the authenticated user ID to helpers so ownership can be enforced.

Example:

```ts
// app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createLink } from "@/data/links";

type CreateLinkInput = {
  url: string;
};

const createLinkSchema = z.object({
  url: z.url(),
});

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const parsedInput = createLinkSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: "Invalid URL" };
  }

  const link = await createLink(userId, parsedInput.data.url);
  return { success: true, data: link };
}
```

```ts
// data/links.ts
import { db } from "@/db";
import { links } from "@/db/schema";

export async function createLink(userId: string, url: string) {
  return db.insert(links).values({ userId, url }).returning();
}
```
