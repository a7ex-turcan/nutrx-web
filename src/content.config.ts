import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * One YAML file per tool page (src/content/tools/<id>.yaml). The id must match
 * a tool in src/data/products.json, which still owns the name, expansion,
 * badge, interfaces, install commands and links.
 */
const tools = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/tools' }),
  schema: z.object({
    // Hero headline, a short promise in plain words ("Make AI agents read the manual.").
    tagline: z.string().max(60),
    // One or two sentences under the headline.
    lead: z.string().max(320),
    // <meta name="description">, also used for social previews.
    description: z.string().max(160),
    // "What it does": benefit cards.
    highlights: z
      .array(z.object({ title: z.string().max(48), body: z.string().max(260) }))
      .min(3)
      .max(6),
    // "How it works": a few steps from nothing to useful. Code is real shell from the README.
    steps: z
      .array(
        z.object({
          title: z.string().max(60),
          body: z.string().max(300),
          code: z.string().optional(),
          // "shell" lines get a "$" prompt and a copy button; "config" is shown as-is.
          kind: z.enum(['shell', 'config']).default('shell'),
        }),
      )
      .min(2)
      .max(6),
    // "Good to know": requirements, limits, honest caveats.
    notes: z.array(z.string().max(220)).min(2).max(6),
  }),
});

export const collections = { tools };
