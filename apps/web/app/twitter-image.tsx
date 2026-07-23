// `dynamic` can't be re-exported — Next needs it declared literally in this
// file to statically parse it, unlike the other route-config fields below.
export const dynamic = "force-static";
export { default, size, contentType } from "./opengraph-image";
