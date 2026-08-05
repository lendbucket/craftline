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

## Engineering

- Next.js App Router, TypeScript strict, Tailwind v4, static generation.
- Design tokens are centralised in `src/app/globals.css`. No designer identity
  exists for Craftline yet, so every visual choice must survive a real identity
  replacing it. Do not hardcode a hex value in a component.
- Feature branches for significant work. Main receives only finished, audited
  work, and only on the owner's explicit word. No history rewrites, no force
  pushes to main.
