<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Craftline Brands site rules

This is the corporate site for Craftline Brands, the franchise umbrella company
behind Wattsmith Electric. It is a brand and franchise development property. It
does not compete with wattsmithelectric.com for service keywords and it never
targets city plus service queries.

## Facts you may state

Everything the site is allowed to assert lives in `src/config/company.ts`. If a
fact is not in that file, it does not go on the site. There are no franchisee
counts, no revenue or growth figures, no press mentions, no team members, no
testimonials, and no reviews, because none of those are established.

The founder's name is never rendered anywhere: not in copy, metadata, schema,
image alt text, or the sitemap.

## Franchise legal guardrails, non negotiable

The FDD is not yet issued. Until it is, and in registration states until
registered, nothing on this site may constitute a franchise offer.

- No financial performance representations anywhere. No revenue, profit,
  earnings, ROI, payback, or unit economics figures visible to the public. Not
  in copy, not in meta tags, not in schema, not in comments that render.
- No "buy a franchise", no pricing, no fee schedules, and no application form
  that reads as a purchase flow. The franchise page is information and inquiry
  only.
- Every franchise related page carries `FRANCHISE_DISCLAIMER` from
  `src/config/company.ts` verbatim in its footer region.
- The phrase "first territory" never appears on this site.

## Style rules

- No em dashes, no en dashes, and no hyphens used as sentence connectors.
  Hyphens only inside compound words where grammatically required.
- No emojis.
- No marketing cliche. Direct expert operator voice.
- Every image slot must be tracked in `src/data/images.ts`. Nothing else may be
  a placeholder: run `npm run placeholder-audit` before shipping.

## No photography, standing

The site runs on type, white space, the brand marks, and the brand colours.
Nothing else.

No stock photography, from any library, under any licence, free or paid. Not as
a hero, not as section texture, not in a card, not behind a heading, and not at
low opacity. This is not a budget constraint or a sourcing problem, and it is
not open to being solved with a better search: royalty free imagery was added
once, reviewed, and removed, and the decision is settled.

The only photographs that may ever appear are real Craftline photographs of
Craftline's own work. If those exist one day, they get discussed then. Nothing
else revisits this.

The four stock slots in `src/data/images.ts` stay tracked and pending as the
record of that decision. Do not fill them. Do not delete them either: a tracked
empty slot is what stops somebody re-solving this from scratch.

## Audits, standing rule

Every audit rule is injection verified at the time it is written, and two
plants are recorded in the file beside it:

- a string the rule MUST catch, and
- a near miss it MUST NOT catch.

Both, always. A plant that only proves a rule fires proves the easy half:
firing is easy, firing on the right thing is not. The near miss is what pins a
rule to the boundary it claims to be checking, and it is the half that would
have caught every failure listed below.

The record lives in the audit file, states the exact plant and the exact
output, and is updated whenever the rule changes. A rule whose plants are not
written down is treated as unverified.

**A verification that reads a captured artifact must prove the artifact
postdates the build it describes, and must fail loudly rather than proceed when
it cannot.** No exceptions, and no falling back to a warning.

This is a separate rule because it is a worse failure than anything the checks
themselves guard against. It happened on the Phase 3 merge gate. A build failed
after the compile step, so the capture threw and wrote nothing; the comparison
then ran against a leftover file from an earlier state and printed CLEAN, with a
plausible table, about a site that no longer existed. Nothing in the numbers
looked wrong, because the numbers were true, about the wrong thing. The only
tell was a label in the output header reading `after` instead of the label that
had just been asked for.

A defect that ships is expensive. A gate that reports CLEAN when it has verified
nothing is worse, because it ends the review. Anything downstream of it stops
looking.

What this requires in practice:

- The capture side records the build it came from. `rule-one-capture.mjs`
  stores the mtime of `.next/server/app/index.html` and its own timestamp.
- The reading side compares that against the build on disk and exits non zero
  on a mismatch, and also on a capture written before the format existed, which
  cannot be checked and therefore cannot be trusted.
- It exits rather than warns. A warning above a green table is read as green.

The same applies to any future harness that compares against something it did
not just produce: a stored baseline, a golden file, a screenshot set, a
serialised crawl. If the artifact cannot be shown to describe the current build,
the run fails.

**Why this is a rule and not a preference.** An audit that passes while looking
at the wrong thing is the defect this project has produced more often than any
other:

- Five of the nine voice audit rules had never fired once. The string rules
  read only the `main` element, so the footer disclaimer, which is the most
  repeated prose on the property, was never checked at all. The density rule
  ignored `dt`. The bold lead-in rule tested a tag name when the tell is
  weight. The parallel phrasing rule could not see subheads. Every one of them
  would have passed a "does it catch anything" test.
- The triad rule counted sentences when the tell was clauses, and passed a
  three clause triad on all eighteen articles for a whole phase.
- The CTA gap rule could only fail a page for too FEW controls, so an article
  carrying five asks and eight links was a pass twice over.
- An unlayered `h1..h6` base rule beat `text-white` and shipped graphite on red
  at 2.98:1 across 23 routes, because nothing was checking the cascade.
- `first:mt-0` inside a per item wrapper cancelled the margin above every
  subhead in the insights section, from the day the template was written.

Each of those is the same shape: the check was real, the thing it pointed at
was not. Recording both plants is the cheapest structural defence available.

## Engineering

- Next.js App Router, TypeScript strict, Tailwind v4, static generation.
- Design tokens are centralised in `src/app/globals.css`. No designer identity
  exists for Craftline yet, so every visual choice must survive a real identity
  replacing it. Do not hardcode a hex value in a component.
- Feature branches for significant work. Main receives only finished, audited
  work, and only on the owner's explicit word. No history rewrites, no force
  pushes to main.
