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

## Phase 3 decisions, recorded

### The brand suffix policy is split, and the split is deliberate

Article titles carry no ` | Craftline Brands`. Every other route does. The
suffix is 19 characters against a truncation point near 60, so on a core page it
costs a fifth of the line and buys the brand a place in every result, which is
the trade a company nobody has heard of wants. On an article it left 41
characters for a headline that has to carry a question somebody typed, and
sixteen of eighteen titles ran past the cut.

Open Graph and Twitter titles keep the suffix on every route including the
articles. Those are shared link cards rather than search results, they carry no
length pressure, and a link pasted into a message is where a reader needs to be
told whose writing it is.

Implemented as `brandSuffix` on `pageMetadata`, which flips the Next.js title to
`{ absolute }`. Adding a route that should drop the suffix is one argument.

### llms.txt and llms-full.txt are generated, and that is the point

Both are route handlers reading `src/config/company.ts` and the insight data at
build time, not files in `public/`. A hand written pair would have been
describing the pre redesign site within a month and nothing would have said so.

Three things the site publishes are held out of both files, and the reasoning is
in `src/lib/llms.ts`: the FAQ answers on cost, earnings, and territory
availability; the territory expansion capability; and `CAPITAL_BRACKETS`. All
are safe on the page, where the disclaimer sits under them, and none is safe as
a line lifted out of a text file. What replaces them is a constraints block that
states what this company does not publish, in a form that says the right thing
read whole or read one line at a time.

The article bodies ARE included, and that was a measurement rather than a
judgment: the corpus contains zero dollar figures, zero percentages, and zero
earnings claims. The three matches for that vocabulary are all refusals. If a
future article breaks that, `npm run llms-audit` fails before it ships.

### sameAs is zero because zero profiles exist

The Organization node carries no `sameAs` and will not until a real external
profile does. There is no company LinkedIn, no Crunchbase entry, no Wikidata
item. The operating brand's own site is not a candidate: it identifies a
different entity and already appears on the brand node. When one exists it goes
in `schema.ts` beside `ENTITY_URL`.

### The voice audit was reviewed for one defect class, not one bug

Rule 8 passed for a whole phase while counting sentences when the tell was
clauses. Every rule was re-read for the same shape of error and four more were
found: the string rules read only `<main>` and so never saw the footer
disclaimer, the density rule ignored `<dt>`, the bold lead-in rule tested a tag
name when the tell is weight, and the parallel phrasing rule could not see
subheads because an article wraps every block in its own div. All five are
fixed and every rule is injection verified in the file header.

### One audit is red on this branch, on two counts, both waiting on a decision

`cta-audit` is green. The rule was rewritten into three route classes and the
articles now carry exactly one ask.

`voice-audit` fails 19 times.

Eighteen are the closing band lead, "An inquiry is read by a person, reserves
nothing, and commits you to nothing." The replacement was proposed and not
shipped, because rewriting that string was gated separately from the CTA
placement it sits inside.

The nineteenth is new, and it is the rule earning its place. Removing the mid
article prompt took away the thing that was breaking a run of consecutive
subheads on one article: `what-to-look-for-in-a-home-services-franchise` opens
three headings in a row with "Look at". That was true before this pass and the
audit could not see it, first because the rule only looked at siblings, and
then because a call to action was sitting in the middle of the run. It is
article prose, so it is a copy decision rather than a template one.

### Not done, and not forgotten: three length fixes were never approved

Reported in the Phase 3 audit, decided on neither way, and left alone:

- The home description is 84 characters, which is 26 under the band and the one
  route on the site whose snippet is too short to earn its place.
- `/franchising` 267, `/insights` 222 and `/about` 219 all overrun 160.
- `/about` 24, `/brands` 25, `/contact` 26 and `/insights` 27 are all under the
  30 character floor.

These are nine edits to strings that already exist. They are listed here rather
than done because the instruction enumerated other items and did not include
them, and doing unrequested work to a page's metadata is how a site drifts.

## Corrections to the performance findings, recorded

### The "25 KB of form code on 25 routes" claim was wrong on two counts

Reported in the performance pass as three form chunks totalling 25.4 KB
uncompressed, all shipped to every route. Checked properly by reading the
`<script src>` tags out of each prerendered page rather than counting every
response the browser touched:

- The two form chunks were already correctly route split. `1f1lbvz81rq42.js`
  loaded only on /contact and `1kl8wbbalqz6a.js` only on /franchising.
- What actually shipped everywhere was a third chunk of 10.9 KB, and it was not
  form code. It was `src/config/company.ts` crossing the client boundary,
  because `site-header.tsx` is a client component and `Wordmark` inside it
  imported `COMPANY` for one string, the link's accessible name.

Fixed by moving `NAV` and `LEGAL_NAV` to `src/config/nav.ts` and passing the
company name into `Wordmark` as a prop. The config now reaches the client on
one route, /franchising, where the franchise form genuinely needs it.

**The byte saving is about 0.6 KB uncompressed, not 10.9.** The chunk that
disappeared was mostly shared client runtime that simply redistributed into the
remaining chunks; only the config data itself was eliminated. The change is
worth keeping for the boundary, not for the bytes, and it is recorded here so
nobody re-measures it expecting ten kilobytes.

### Lighthouse and applied throttling disagree on the inlined stylesheet

Lantern reports LCP moving the wrong way, home 2.41s to 2.94s. Measured on the
two real builds under applied throttling, inlining is 250 to 292 ms faster on
every template with confidence intervals nowhere near zero. The decision was
taken on the applied numbers and the reasoning is written into next.config.ts.
Every template stays under the 3.5s Lighthouse ceiling either way.

### A stale capture nearly produced a false Rule One pass

A build failed after the compile step, the capture threw, and the comparison ran
against a leftover file and printed CLEAN. The only tell was the label in the
output header. Captures now record the build they came from and the compare half
refuses to run against one that predates the build on disk. Both halves planted
and verified.

## Closed, do not re-open

### The Bing "missing alt attribute" warning on 27 of 27 pages is a false positive

Bing Site Scan flags a missing alt attribute on every route. It is wrong, and
the finding is recorded here so a future session does not re-open it and
"fix" it by adding redundant alt text.

**Measured from the served bytes on the apex, all 27 live routes:**

- Images with no alt attribute at all: **zero**.
- Images with `alt=""`: **54**, two per route, both the Craftline lockup, one
  in the header and one in the footer. An empty alt is the WCAG sanctioned way
  to mark an image decorative. It is not a missing attribute.
- SVG elements with no accessible name: **zero**. Every one carries
  `aria-hidden="true"`.

**axe-core, WCAG 2.1 A and AA, run against the live production home page:**

- `image-alt` matched both images and **passed** both.
- `link-name` passed on 25 nodes.
- Total violations: **zero**.

**Both images have a genuine accessible name by another mechanism:**

- Header: the `<img alt="">` sits inside
  `<a aria-label="Craftline Brands home" href="/">`. The link carries the name.
- Footer: no link wrapper, but the footer's own visible text renders the
  literal string "Craftline Brands" **four times**, in the descriptor, the
  brands column and the two legal entity names. The mark is decorative by
  redundancy, which is exactly when `alt=""` is correct.

**Why axe passing is correct rather than a miss.** The `image-alt` rule is
written to pass an empty alt, because empty alt is the standard. It is not
looking at the wrong thing. This is NOT another instance of the defect class in
the audits section above, and it was checked specifically for that: the thing
that would have made it a real gap is the footer mark being the only carrier of
the company name, and it is not.

**Why the fix is not to add alt text.** `alt="Craftline Brands"` would make a
screen reader announce the company twice inside one control in the header, and
add a fifth announcement in the footer. That is a WCAG regression dressed as a
fix, shipped to satisfy a scanner using a cruder heuristic than the standard.

Owner ruling: accepted as a false positive, do not add redundant alt text.

### 254 Engineering stays off this site

Considered as a second Craftline brand and declined by the owner. The analysis
is recorded so it is not redone.

**The structural finding.** 254engineering.com describes a Texas engineering
firm delivering "field work to a written protocol, reviewed and sealed by a
licensed Texas Professional Engineer in responsible charge", across eight
sealed service lines. Its schema type is `ProfessionalService`. It is a
professional services firm working under a licensed PE, not a skilled trade
service brand, and it carries a regulatory shape no trade service franchise
has: several states restrict ownership of engineering firms to licensed
engineers.

**What adding it would have touched.** The site was built plural, so most of it
absorbs a second brand as a data edit: `BrandRow`, `/brands`, `/brands/[slug]`,
the sitemap, `subOrganization` and `brand` in the Organization schema, and both
llms files all loop over `BRANDS` and need no code change.

The cost is not mechanical. Four load bearing identity strings and one FAQ
answer would have had to change:

1. `COMPANY.descriptor`, "A franchise development company building and
   operating **skilled trade service** brands." It renders in seven places
   including the home hero, the footer on every route, the web manifest,
   `Organization.description`, the home meta description and both llms files.
2. `CATEGORY_POSITIONING`, four trade phrases emitted as `knowsAbout` in the
   Organization schema on all 28 routes. None of them covers engineering.
3. The `FRANCHISE_FAQ` entry "Why is there only one brand?" and its whole
   answer, which becomes false. It renders on /franchising and sits in the
   FAQPage schema, and the Rule One allowlist pins the FAQ at exactly nine
   entries, so this trips the gate by design.
4. "the first brand" in the `building-wattsmith-electric` title, description
   and lead.
5. Six `const [wattsmith] = BRANDS` destructures in about, brands, contact,
   home, privacy and terms, each needing review. The privacy page says "It does
   not cover Wattsmith Electric, which operates its own website", and with two
   brands that sentence becomes an incomplete disclosure on a legal page.

Plus a new `BrandLockup` case, a new inline SVG component, and a tracked slot
in `src/data/images.ts`, which the placeholder audit fails until real artwork
exists.

**The decision.** Craftline stays a skilled trade franchise developer. 254 keeps
its own site and its own entity, and the connection to the owner is carried by
the Person node on the founder page rather than by widening Craftline's story
until it stops saying anything specific.

## Later targets, with the reasoning intact

### franchise broker, 500 volume, KD 48

Cut from the approved article batch by the owner on the grounds that KD 48
against a DR 0 site with zero organic keywords is a multi-year play and will
not earn its place in this batch. Kept here because the subject is worth
writing eventually and the argument for it should not have to be rebuilt.

**Why it is worth writing.** How franchise brokers are paid, and the conflict
that creates, is something Craftline can say plainly from working knowledge
and most of the category will not say at all. A broker is typically paid by
the franchisor on a placement, which means the person presenting themselves to
a prospect as an impartial guide is compensated by one side of the
transaction. That is a fact about the structure, not an accusation about any
individual, and it is exactly the kind of thing the eighteen existing articles
already handle well: the FDD article, the royalty article and the due
diligence article all work by explaining a mechanism rather than warning about
a villain.

**Why not now.** Difficulty 48 is the highest in the whole candidate pull.
The site ranks for nothing today, has no referring domains worth counting, and
the realistic path to that SERP runs through first establishing authority on
the KD 0 to KD 9 targets in the approved batch. Writing it now spends the same
effort for a ranking that will not arrive for years.

**When to revisit.** Once the approved batch has been live long enough to show
whether the low-difficulty targets rank at all. If they do, the domain has
some authority to spend and this becomes a reasonable next target. If they do
not, difficulty is not the constraint and this would not have worked either.

Related and also declined, on intent rather than difficulty: `franchise
consultant` at 1,500 and KD 39 is the same subject from the other side, and
`franchise lawyer` and `franchise attorney`, at 1,700 and 1,200 with KD 0 and
a $6.00 CPC, are local_pack "find me a lawyer" queries that Craftline cannot
satisfy at all.

## Open: the capture holds no whole string for text beside an element child

`rule-one-capture.mjs` builds its block inventories from leaf text. An
element that carries its own text *and* has an element child is not a leaf,
so its own text reaches `mainWords` and no block, anchor or heading holds it
as a whole string. Nothing is checking those strings at block level.

A scan of the built site found 108 such elements in 34 distinct shapes. Three
account for 71 of them:

| shape | count | where |
|---|---|---|
| `p.label-sm` carrying `Published` beside a `<time>` | 24 | every article page |
| `p.text-datum` carrying `Read this` beside an `sr-only` span | 24 | every hub card |
| `span` carrying `,` beside a title link | 23 | the `/franchising` title run |

`Published` plus its date is the clearest case: it appears on 24 routes and
**no inventory holds it as a string at all**. If it changed, only word level
would notice, and word level cannot say what changed.

The other 25 are article body links whose own text sits beside an `sr-only`
"(opens in a new tab)". Those are covered, because `anchors` holds the
combined text as one value.

**The fix is in the capture, not the comparator.** `leafBlocks` should emit an
element's own text as its own block when that element also has element
children, so the string exists to be compared. That is a change to what every
capture contains, so it invalidates stored captures and belongs in its own
pull request, after #3 merges, with a fresh capture on both sides.

**This retires the twelve token bound, and that bound is temporary because of
this entry.** `rule-one-compare.mjs` currently funds `Read`, `this` and the
comma at one of each per article in a batch, because those three tokens reach
the word inventory with nothing behind them to pay for them. Once the capture
emits the text as a block, the block funds its own words like any other and
the special case has no work left to do. Delete it then rather than carrying
it forward: a hand sized allowance for a capture defect outlives the defect
unless somebody writes down that it should not.
## Ruled: one article spells license the American way

House style is British and stays British. `franchise-vs-license` is a scoped
exception covering that article's slug, title, description, heading and body,
plus the anchor text and href in `how-to-franchise-a-business` that point at
it, because a link carries the title of the page it opens.

The reason, as given: the search term is "franchise vs license", this is a
Texas company, and the title has to lead with the target term.

Everything else keeps the British spelling, and there is a fair amount of it:
`/franchising`, the FAQ in `company.ts`, `images.ts`, and five articles use
the word in passing. Changing any of those is a separate decision and a Rule
One matter, because it would move text on pages nobody has approved to touch.

This is recorded so the next session reads the mixed spelling as a ruled
exception rather than as drift to be tidied up. Tidying it up in either
direction is a content change to merged pages and needs its own approval.

## Closed: three merged articles failed the section rhythm rule

`voice-audit` rule 9 failed three articles that were already on main when it
was written. The owner ruled restructure rather than exempt: an exemption list
is a moved threshold with a record attached, and the audit would knowingly pass
articles it had correctly identified as uniform.

| article | before | after |
|---|---|---|
| `why-trade-services-suit-franchise-systems` | 2,2,2,2,2,3 | 3,2,3,2,2,3 |
| `what-veteran-operators-bring-to-trade-services` | 2,2,2,2,1,3 | 2,3,2,2,1,3 |
| `franchising-for-veterans` | 1,2,1,1,1 | 1,2,1,2,1 |

Four paragraphs split at a sentence boundary, no merges, no sentence written
or deleted. The word inventory is identical on all twenty articles before and
after, and Rule One reports a zero word delta in both directions with the four
originals classified SPLIT rather than REMOVED.

The threshold was not moved. That is the whole point of the entry.
