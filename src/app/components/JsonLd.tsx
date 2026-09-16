// Structured data, rendered server-side as a <script> tag (Next's JSON-LD guide).
// One place for the canonical origin so page JSON-LD and metadata agree.
export const SITE_URL = "https://shogo.build";
export const OG_IMAGE_URL = `${SITE_URL}/opengraph-image.png`;

type JsonLdData = Record<string, unknown>;

export default function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so a string in the payload can't close the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
