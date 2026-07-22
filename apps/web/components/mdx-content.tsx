import { run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

/**
 * Executes MDX already compiled by Velite (`function-body` output format) —
 * the compile step happened at build time, this only evaluates the result.
 */
export async function MdxContent({ code }: { code: string }) {
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return <Content />;
}
