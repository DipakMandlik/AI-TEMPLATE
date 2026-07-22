#!/usr/bin/env tsx
/**
 * Interactive scaffolding for a new template — prompts for the essentials,
 * writes a valid starting file at the right path, and leaves the MDX body
 * ready to fill in. Removes the copy-paste-and-hope-it-validates friction
 * (architecture.md §4.3).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { PROVIDERS, slugSchema } from "@ai-template/validation";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.resolve(SCRIPT_DIR, "../content/templates");

/**
 * A single `for await` loop over the readline interface, rather than
 * repeated `rl.question()` calls — with fully-buffered (piped or heredoc)
 * input, Node's readline can emit 'line' events before a later `question()`
 * call has attached its listener, silently dropping them. Iterating once
 * and asking each validator to pull as many lines as it needs avoids that.
 */
async function collectAnswers(
  rl: readline.Interface,
  fields: Array<{ label: string; validate: (value: string) => string | null }>,
): Promise<string[]> {
  const answers: string[] = [];
  let index = 0;
  process.stdout.write(`${fields[0]!.label} `);
  for await (const line of rl) {
    const field = fields[index]!;
    const value = line.trim();
    const error = value ? field.validate(value) : "This field is required.";
    if (error) {
      console.error(error);
      process.stdout.write(`${field.label} `);
      continue;
    }
    answers.push(value);
    index++;
    if (index === fields.length) {
      rl.close();
      return answers;
    }
    process.stdout.write(`${fields[index]!.label} `);
  }
  throw new Error("Input ended before all fields were answered.");
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("New template\n");

  const [provider, category, slug, title, description, authorName] = await collectAnswers(rl, [
    {
      label: `Provider (${PROVIDERS.join(", ")}):`,
      validate: (v) =>
        (PROVIDERS as readonly string[]).includes(v)
          ? null
          : `Must be one of: ${PROVIDERS.join(", ")}`,
    },
    {
      label: "Category (kebab-case, e.g. frontend):",
      validate: (v) =>
        slugSchema
          .safeParse(v)
          .error?.issues.map((i) => i.message)
          .join(", ") ?? null,
    },
    {
      label: "Slug (kebab-case, e.g. my-new-template):",
      validate: (v) =>
        slugSchema
          .safeParse(v)
          .error?.issues.map((i) => i.message)
          .join(", ") ?? null,
    },
    { label: "Title:", validate: () => null },
    { label: "One-sentence description:", validate: () => null },
    { label: "Author name:", validate: () => null },
  ]);

  const dir = path.join(CONTENT_ROOT, provider!, category!);
  const filePath = path.join(dir, `${slug}.mdx`);
  if (existsSync(filePath)) {
    console.error(`\n${path.relative(process.cwd(), filePath)} already exists.`);
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const frontmatter = `---
title: ${title}
description: ${description}
author:
  name: ${authorName}
version: 1.0.0
compatibility:
  - ${provider}
tags:
  - TODO
difficulty: beginner
license: MIT
useCases:
  - TODO
examples:
  - title: TODO
    input: TODO
    output: TODO
changelog:
  - version: 1.0.0
    date: "${today}"
    changes:
      - Initial release
createdAt: "${today}"
updatedAt: "${today}"
---

## Overview

TODO — what does this template do and why would someone use it?

## The prompt

\`\`\`md
TODO — the actual prompt/rule content.
\`\`\`
`;

  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, frontmatter);

  console.log(`\nCreated ${path.relative(process.cwd(), filePath)}`);
  console.log("Next steps:");
  console.log("  1. Fill in every TODO (tags, useCases, examples, the prompt itself).");
  console.log("  2. Run `pnpm validate:content` to confirm it passes schema validation.");
  console.log("  3. Run `pnpm --filter web dev` and check it renders at /templates.");
}

main();
