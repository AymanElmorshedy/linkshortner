import { randomBytes } from "node:crypto";

import { desc, eq, and } from "drizzle-orm";

import { db } from "@/db";
import { links, type Link } from "@/db/schema";

export async function getLinksForUser(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}

export async function getLinkByShortCode(
  shortCode: string,
): Promise<Link | undefined> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link;
}

const shortCodeAlphabet =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateShortCode(length: number): string {
  const bytes = randomBytes(length);

  return Array.from(
    bytes,
    (byte) => shortCodeAlphabet[byte % shortCodeAlphabet.length],
  ).join("");
}

export async function createLink(
  userId: string,
  originalUrl: string,
): Promise<Link> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shortCode = generateShortCode(6);

    try {
      const [link] = await db
        .insert(links)
        .values({ userId, originalUrl, shortCode })
        .returning();

      return link;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
    }
  }

  throw new Error("Unable to create link");
}

export async function updateLink(
  userId: string,
  linkId: string,
  originalUrl: string,
): Promise<Link> {
  const [link] = await db
    .update(links)
    .set({ originalUrl })
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  if (!link) {
    throw new Error("Link not found");
  }

  return link;
}

export async function deleteLink(
  userId: string,
  linkId: string,
): Promise<void> {
  const deletedLinks = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning({ id: links.id });

  if (deletedLinks.length === 0) {
    throw new Error("Link not found");
  }
}
