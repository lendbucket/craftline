# Backlog

Work that has been identified and deliberately not built yet. Nothing here is a
commitment to a date. An item earns a place on this list by having a stated
reason and, where one exists, the concrete incident that produced it.

Items are removed when they ship, not when they are attempted.

## Rejected import behaviours

These are not deferred work. They are things the Claude Design import does that
this site deliberately does not do, recorded so that a future session reading
the export in `scratch/craftline-redesign/` does not reintroduce them believing
they were simply missed. Each was reviewed in Phase 1, declined by the owner in
writing, and is absent from the Phase 2A build.

**Do not implement any of these without the owner's explicit word.** If one
looks like an obvious improvement, the reason it is here is that it looked like
one before.

### The footer legal links point at `href="#"`

`SiteFooter.dc.html` renders Privacy policy and Terms as `<a href="#">`. Both
routes exist, both are in the sitemap, and both are reachable from every page
of this site through `LEGAL_NAV` in `src/config/company.ts`.

**Why it is rejected.** A dead anchor on a legal link is worse than no link. It
tells a reader the document exists and then refuses to produce it, and the
reader most likely to click Privacy on a franchisor site before an FDD is
issued is exactly the reader who should not be met with a page that does not
move. It would also strand two indexed URLs with no internal inbound link,
which is the same orphaning problem as the item below.

**The correct behaviour**, which is what ships: both links resolve, and both
are generated from `LEGAL_NAV` so the footer, the header and the sitemap cannot
drift apart.

### The brands page sends its primary action off site

`Brands.dc.html` points "About Wattsmith Electric" at `wattsmithelectric.com`.
The import contains no brand detail template at all, so nothing in it links to
`/brands/wattsmith-electric`.

**Why it is rejected.** That route exists, it is prerendered, it is in the
sitemap, and the brands index is its only inbound link from anywhere on this
site. Sending the index's primary action to the operating brand's own domain
leaves an indexed page with no internal path to it, which is an orphaned route
whatever else it is.

It is also the wrong destination for the reader. Someone on the Craftline
brands index is evaluating Craftline's portfolio, not looking for an
electrician. The brand page is what answers that, and the outbound link to
`wattsmithelectric.com` already sits on the brand page itself, prominently,
which is where a service intent should be caught and released.

**The correct behaviour**, which is what ships: the brands index links inward
to `/brands/${brand.slug}`, and the brand page carries the outbound link.

### The remaining declined import behaviours, in brief

Each was reviewed and declined for a stated reason. The full reasoning for the
first three lives in the header of `src/app/globals.css`, because they are
colour and ground decisions and that is where a future reader will be standing
when the question comes up again.

- **Dark section grounds.** On graphite, signal red measures 2.99:1, datum blue
  2.80:1 and steel 2.95:1. All three fail. Carrying the brand on dark requires
  lightened variants, and a lightened brand red no longer matches the logo, the
  Open Graph card, or the Organization schema.
- **A full bleed red closing band.** The same objection. On `#CB0000` only white
  clears AA. A red field is a dark ground in the brand's colour and would need
  the identical re-pinning mechanism that `globals.css` retired.
- **The import's colours, `#C4161C` and `#1A82C6`.** Invented, not delivered.
  The import's own hero sets its red on its ink ground at 2.94:1, which fails
  even the large text minimum, and its blue fails AA at body size on white.
- **The two Wattsmith field photograph slots.** No photography remains settled
  law. See the standing rule in `AGENTS.md` and the manifest header in
  `src/data/images.ts`. The four pending stock slots stay pending and untouched.
- **"Flagship brand", "flagship market", and the "1 operating brand" hero
  statistic.** None is in `src/config/company.ts`. The first two assert a
  portfolio hierarchy and a sequenced expansion plan that do not exist, and the
  third puts a unit count in the one container on a franchisor's home page that
  a reader reads as a system statistic.
- **The insights hub category filter.** Ten buttons over client held state is a
  new capability on an existing route rather than a restyle of it, and the hub
  is server rendered and static.
- **Absolute article links opening in a new tab.** The import writes all
  eighteen as `https://craftlinebrands.com/insights/...` with `target="_blank"`,
  which turns this site's own internal linking into outbound behaviour on its
  most linked section.
- **The five tab mobile bottom bar.** It drops Contact from the navigation set
  and relabels Franchising to "Franchise", neither of which matches `NAV`, and
  `NAV` is the single source the header, the footer and the sitemap all read so
  that they cannot drift.

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
