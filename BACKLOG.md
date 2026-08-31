# Backlog

Work that has been identified and deliberately not built yet. Nothing here is a
commitment to a date. An item earns a place on this list by having a stated
reason and, where one exists, the concrete incident that produced it.

Items are removed when they ship, not when they are attempted.

## Open, from Phase 2A

### Dark grounds were declined on faulty reasoning, and that is revisitable

The Phase 1 report declined the import's dark section grounds, and the reason
given was wrong in a way that matters, so it is recorded here rather than left
to read as a settled design judgment.

**What was said.** That signal red measures 2.99:1 on graphite, datum blue
2.80:1 and steel 2.95:1, so the brand cannot go on dark without lightened
variants, and a lightened brand red stops matching the logo, the Open Graph
card and the Organization schema.

**What is actually true.** Those ratios are correct and the conclusion drawn
from them is not. The constraint is narrower than it was stated: **brand colour
cannot carry TEXT on a dark ground.** It says nothing about dark grounds
themselves. The import does not put brand colour in text on its ink bands. It
sets the type in white and uses red and blue only in rules, borders, the split
bar and the offset frames, none of which carry text and none of which are
subject to a contrast minimum.

The same mistake was made a second time about the closing red band, declined as
"a dark ground wearing the brand's colour", and that one was corrected during
2A: a surface needing only two values does not need the re-pinning mechanism a
full page ground would need. The dark grounds were never re-examined under the
corrected reasoning.

**So this is open, not closed.** A dark band with white type and brand coloured
rules is buildable today with no new tokens and no lightened variants. What it
would still need is a decision about whether this property wants dark bands at
all, which is a design and positioning question rather than a contrast one. If
it is picked up, the thing to check is that no token other than white lands on
the dark field, which is what the contrast audit already enforces.

### The Wattsmith lockup is small inside the import's 88 by 88 tile

The brand block places the delivered lockup in a white tile taken from the
import at 88 by 88 with 8px of padding. The import drew that tile for a square
placeholder. The delivered artwork is 1372 by 498, a 2.75:1 landscape lockup,
so inside the tile it renders at roughly 72 by 26.

It is legible and it is not wrong, but it is smaller than the mark deserves on
a page about the brands this company owns, and the tile is square for a reason
that no longer applies. Deferred rather than resolved: the fix is a tile
proportioned to the artwork instead of to the placeholder, and it is a
one line change whenever somebody wants to make it.

## Phase 3: the Rule One verification, method fixed in advance

Not yet run. The method is written down here before the results exist so that it
can be reviewed for what it covers rather than judged by whether it came back
clean.

**Why it is specified rather than improvised.** The Phase 1 string comparison
used a 40 character floor and a nine word prefix window, and that definition
missed three real claims: "Flagship brand", "flagship market" and "1 operating
brand" are 14, 15 and 17 characters. All three were caught by a separate grep,
not by the scan. A verification that inherits that floor would inherit the hole.

### What is compared

Both branches are built and served. All 27 routes are crawled on each. For every
route the crawler extracts a typed inventory, and every item is compared as an
**exact, complete, normalised string**. No length floor. No prefix window.

1. `<title>`, in full.
2. Every `<meta>` `content` value: description, Open Graph, Twitter.
3. `<link rel="canonical">` href, and the robots directives.
4. Every heading, `h1` through `h6`, carrying its level so a demotion is visible.
5. Every anchor: its text and its `href`, as a pair.
6. Every button and submit control: its text.
7. Every attribute that reaches a person: `alt`, `aria-label`, `title`, and the
   text of each `aria-describedby` and `aria-labelledby` target.
8. Every JSON-LD block, flattened to sorted key and string value pairs.
9. The complete visible text of `<main>`, and of the header and footer
   separately, normalised for whitespace only.
10. The set of prerendered routes, and the sitemap entries, as sets.

Items 5, 6 and 7 are the ones Phase 1 could not see at all: the tag stripping
removed attributes wholesale, and short labels fell under the floor.

### How the two failure modes I named are handled

**Prefix matching that diverges.** There is no window. Strings are compared
whole, so a sentence that opens identically and ends differently is a mismatch
rather than a match.

**Meaning changed by relocation.** Comparison runs at two levels. Per route,
which catches a string leaving a page. And as a site wide multiset, which
distinguishes the two cases that a per route diff confuses: a string that
disappears from route A and appears on route B is reported as **moved**, and a
string that disappears from route A and appears nowhere is reported as
**removed**. A move is not automatically a violation, but it is never silent,
and every one has to be justified as presentation rather than waved through.

### What a pass looks like

**Zero removed. Zero UNAPPROVED added.** Zero routes gained or lost, zero
canonical, robots, meta or schema differences. Moves are enumerated individually
with the route they left and the route they arrived on, and each is signed off
or reverted.

**THE ADDITIONS THRESHOLD WAS ORIGINALLY WRITTEN AS ZERO, AND THAT WAS WRONG.**
It was set by the owner before the first run and corrected by him after it. Zero
added is the right bar for a pure refactor. It is the wrong bar for a redesign
that the owner has explicitly asked to include new elements, because it fails
the run on the very things he asked for and it teaches whoever reads the result
that a red table is normal. A check that is expected to fail stops being a
check.

So additions are classified rather than counted:

- **Approved.** Traceable to a written instruction from the owner. Phase 2A's 59
  additions were the hero eyebrow, the tricolour headline spans, the two fact
  strip cells and their labels, and the brand block's status pill, attribute
  pills and Trade and Market labels. Every one of those was directed in writing
  and each is listed against its instruction in the report.
- **Unapproved.** Everything else. One is a failure.

Removals are not classified and there is no equivalent softening. Nothing on
this site is allowed to quietly stop rendering, and the first run proved why:
"Step 1" through "Step 4" had left the franchising page entirely, taking the
only statement that the inquiry process is ordered with them, and nothing else
in the pipeline had noticed.

### One reclassification the tool makes, and why it is not a softening

A leaf block whose element boundaries changed but whose every word still renders
on the same route is reported as SPLIT rather than REMOVED. Wrapping two phrases
of the home page headline in spans to colour them does exactly this: the block
inventory loses one entry and the page loses nothing.

The assertion moves to the word inventory, which cannot be fooled by element
boundaries. A genuinely deleted phrase fails on `mainWords` whatever happens to
the markup around it.

The crawl output is kept as the proof rather than summarised, so the claim can be
rechecked without rerunning it.

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
