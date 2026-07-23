// Twitter/X falls back to og:image for crawlers that respect it, but not all
// do — this file satisfies the twitter:image convention explicitly with the
// same generated image, rather than duplicating the layout.
// `dynamic` can't be re-exported — Next needs it declared literally in this
// file to statically parse it, unlike the other route-config fields below.
export const dynamic = "force-static";
export { default, generateStaticParams, size, contentType } from "./opengraph-image";
