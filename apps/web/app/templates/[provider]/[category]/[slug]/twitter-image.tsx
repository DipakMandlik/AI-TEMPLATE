// Twitter/X falls back to og:image for crawlers that respect it, but not all
// do — this file satisfies the twitter:image convention explicitly with the
// same generated image, rather than duplicating the layout.
export { default, generateStaticParams, size, contentType } from "./opengraph-image";
