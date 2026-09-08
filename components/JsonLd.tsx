/**
 * Emits one structured-data block. Server component — the JSON is baked into
 * the static HTML, so crawlers that do not run JavaScript still see it.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // No user input reaches this, but `<` is escaped anyway so the payload
      // can never terminate the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
