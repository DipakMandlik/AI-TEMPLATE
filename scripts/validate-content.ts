#!/usr/bin/env tsx
/**
 * Standalone content validation — walks content/templates/**\/*.mdx, parses
 * frontmatter, and validates it against the shared TemplateMeta schema. Runs
 * without Velite or a Next.js build so a PR that only touches content gets a
 * fast, isolated check (architecture.md §4.2).
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { PROVIDERS, templateMetaSchema } from "@ai-template/validation";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.resolve(SCRIPT_DIR, "../content/templates");

function findMdxFiles(root: string): string[] {
  const files: string[] = [];
  for (const providerEntry of readdirSync(root, { withFileTypes: true })) {
    if (!providerEntry.isDirectory()) continue;
    const providerDir = path.join(root, providerEntry.name);
    for (const categoryEntry of readdirSync(providerDir, { withFileTypes: true })) {
      if (!categoryEntry.isDirectory()) continue;
      const categoryDir = path.join(providerDir, categoryEntry.name);
      for (const fileEntry of readdirSync(categoryDir, { withFileTypes: true })) {
        if (fileEntry.isFile() && fileEntry.name.endsWith(".mdx")) {
          files.push(path.join(categoryDir, fileEntry.name));
        }
      }
    }
  }
  return files;
}

function main(): void {
  const files = findMdxFiles(CONTENT_ROOT);
  if (files.length === 0) {
    console.error(`No templates found under ${path.relative(process.cwd(), CONTENT_ROOT)}`);
    process.exit(1);
  }

  let errorCount = 0;

  for (const file of files) {
    const relative = path.relative(CONTENT_ROOT, file);
    const contextPath = `content/templates/${relative}`;
    const [provider, category, filename, ...rest] = relative.split(path.sep);

    if (!provider || !category || !filename || rest.length > 0) {
      console.error(`✖ ${contextPath}\n  must live at {provider}/{category}/{slug}.mdx`);
      errorCount++;
      continue;
    }
    if (!(PROVIDERS as readonly string[]).includes(provider)) {
      console.error(
        `✖ ${contextPath}\n  "${provider}" is not a known provider directory (${PROVIDERS.join(", ")})`,
      );
      errorCount++;
      continue;
    }

    const { data } = matter(readFileSync(file, "utf8"));
    const result = templateMetaSchema.safeParse(data);
    if (!result.success) {
      errorCount++;
      console.error(`✖ ${contextPath}`);
      for (const issue of result.error.issues) {
        console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
      }
    } else {
      console.log(`✓ ${contextPath}`);
    }
  }

  if (errorCount > 0) {
    console.error(`\n${errorCount} of ${files.length} template(s) failed validation.`);
    process.exit(1);
  }

  console.log(`\nAll ${files.length} template(s) are valid.`);
}

main();
