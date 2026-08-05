# Backlog

Work that has been identified and deliberately not built yet. Nothing here is a
commitment to a date. An item earns a place on this list by having a stated
reason and, where one exists, the concrete incident that produced it.

Items are removed when they ship, not when they are attempted.

## Tooling

### Token existence check

A scan that verifies every design token class referenced anywhere in `src`
actually resolves to a rule in the built CSS.

**Why:** a class that does not exist fails silently in every audit currently in
the suite. Contrast, mobile, SEO, forms, and placeholder all pass, lint passes,
the build succeeds, and the element simply renders with no styling applied.
There is no stage in the pipeline where a misspelled or stale token is visible
as a failure, so the only thing standing between a dead class and production is
whether a person happens to look at the right pixel.

**The incident that produced this item.** Two dead tokens survived the full
Panel Interior rebuild and every audit run against it, and both were found only
by eye during a manual screenshot review:

- `accent-bronze` on the radio inputs in `src/components/form/fields.tsx`.
  Bronze was a token in the previous design system and does not exist in the
  current one, so `accent-color` was never set and the veteran question rendered
  its radios in browser default blue on a page with no blue anywhere in it.
- `hover:border-ink/40` on the text, textarea, and select controls in the same
  file. Ink was likewise a former token, so the hover state on every form
  control on the site was a no operation.

Both were shipped, both passed five audits, and neither would have been caught
by anything other than somebody looking.

**What the check needs to do.** Extract every candidate utility class from JSX
`className` strings and from the class name helper functions in `src`, resolve
the design token portion of each against the compiled stylesheet from a
production build, and fail with the file, the class, and the nearest existing
token when a reference does not resolve.

**Known difficulty, worth deciding before building.** Tailwind generates
utilities on demand, so a class absent from the built CSS can mean either a dead
token or a class the scanner constructed that the source never actually uses.
Dynamic class construction and arbitrary value syntax both make naive string
extraction produce false results in each direction, and a check that cries wolf
will be switched off within a week. The design decision is where to draw the
boundary: matching only against the `--color-*`, `--font-*`, and `--radius-*`
names declared in `src/app/globals.css` is narrower than a general Tailwind
linter and catches the entire class of failure that actually occurred here.

**Fits into:** the audit suite in `package.json`, alongside `placeholder-audit`.
It needs a production build first, the same as `seo-audit` does.

## Infrastructure

### The www redirect is a 307 and should be a 308

`www.craftlinebrands.com` redirects to the apex on every route, one hop, path
and query preserved, but it answers `307 Temporary Redirect` rather than a
permanent `308`. Accepted for now because the canonical tags on both hosts point
at the apex and carry the consolidation. Fix whenever convenient, either by
setting the redirect status on the **www** domain row in Vercel, which is the
row that performs the redirect, or with a host matched permanent redirect in
`next.config`.
