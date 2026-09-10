import { config } from 'dotenv';

async function seedLinks(): Promise<void> {
  config({ path: '.env.local' });

  const { db } = await import('../db/index');
  const { links } = await import('../db/schema');
  const userId = 'user_3IavFoySo77muEI6lOXFT1LzBuy';
  const originalUrls = [
    'https://example.com/product-launch',
    'https://www.wikipedia.org/wiki/URL_shortening',
    'https://developer.mozilla.org/en-US/docs/Web/URL',
    'https://nextjs.org/docs',
    'https://orm.drizzle.team/docs/overview',
    'https://clerk.com/docs',
    'https://neon.tech/docs/introduction',
    'https://react.dev/learn',
    'https://tailwindcss.com/docs/installation',
    'https://www.typescriptlang.org/docs/',
  ];

  const rows = originalUrls.map((originalUrl, index) => ({
    userId,
    originalUrl,
    shortCode: `example-${String(index + 1).padStart(2, '0')}`,
  }));

  const inserted = await db
    .insert(links)
    .values(rows)
    .onConflictDoNothing({ target: links.shortCode })
    .returning({
      id: links.id,
      userId: links.userId,
      originalUrl: links.originalUrl,
      shortCode: links.shortCode,
    });

  console.table(inserted);
  console.log(`Inserted ${inserted.length} link(s) for ${userId}.`);
}

void seedLinks();
