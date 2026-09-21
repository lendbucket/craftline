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

**Why, and the status of this reasoning.** The rule was written into this file
at the first commit and restated in seven other places, and none of them
recorded a reason. In September 2026 a founder page was proposed, built on a
branch, and ruled against by the owner, who then adopted the following as the
rule's stated rationale. **This is reasoning adopted, not reasoning recovered.**
It was reconstructed from where the rule sits rather than read out of any
original note, and it is written down here so the next session does not have to
reconstruct it again.

Craftline is a franchisor in formation. Under the FTC Franchise Rule a
franchisor's principals and their business experience are disclosed in **Item 2
of the FDD**, which is a controlled document delivered with a waiting period
before anything can be signed. A named principal making statements on a
pre-disclosure marketing site is a different exposure profile from a corporate
voice making the same statements, because the statements attach to a person.
That is why the rule reaches schema, alt text and the sitemap, which is further
than a privacy preference normally goes: those are all places a name becomes
machine readable and quotable outside the page that carried it.

Two things this rationale does not claim. It is not a privacy rule, and the
owner's name is already published as `founder` in live schema on a property he
owns that is not franchise gated. It is not a style rule either, and it has
never appeared in the style section.

**The condition on which it is revisitable.** This rule holds until an FDD
exists and Item 2 is filed. At that point the principals are disclosed through
the controlled channel, the exposure the rule was adopted to prevent has been
addressed by the disclosure itself, and a founder page on this property becomes
a normal decision rather than a gated one. Until then, the answer is no, and
"the owner asked for it" is not sufficient on its own: the rule was reversed
once on exactly that basis and then restored when the reasoning was examined.

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

**The approval allowlist is self certifying, no in-repo mechanism can close
that, and the control is on GitHub rather than in this repository.**

A session can add content it was not asked for AND add the allowlist entry that
excuses it, in the same commit, and `rule-one-compare.mjs` prints CLEAN. The
verdict becomes indistinguishable from a run where nothing needed approving. It
is not specific to one entry: it applies to the literal lists, every approval
rule, the string swaps and the FAQ count pin alike.

**Why nothing written here fixes it.** Every control would be a file in the
same repository as the thing it controls, editable in the same commit. A check
that diffs the allowlist against the baseline can be deleted, and the
acknowledgement flag it introduces can be passed. A verdict string can be
changed back. A recorded plant is a comment. A signed approval token still needs
in-repo code to verify it. An allowlist fetched from outside still needs an
in-repo fetch that can be stubbed. Every design reduces to the same place: the
checker and the checked are in one trust domain, and a verification cannot
authorise itself. Moving the authorisation into the repository does not move it
outside.

A third proposal, having the harness diff its own allowlist and refuse to print
CLEAN silently, was declined for introducing a new bypass in the act of closing
one while buying little over the cheap changes, given that neither stops a
determined session.

**What actually controls it**, and it is deliberately not code: branch
protection on `main` requiring a pull request and the owner's review, plus
CODEOWNERS on `scripts/` so a harness change cannot merge without the owner
looking at it specifically. Both are GitHub repository settings, neither is
reachable from a commit, and the owner set them up. CODEOWNERS is the one place
the recursion works in our favour, because editing it is itself a CODEOWNERS
change requiring the same review.

**A commit message described a comment change and the commit carried four
content edits.**

On 21 September a session applied a metadata sweep to four files, then staged
two of them for a separate commit about citation dates using `git add`
followed by `git stash --keep-index`. The stash held back the unstaged files,
not the unstaged hunks, so `9d311ba` went in carrying its two date fixes and
four of the eight metadata strings, under a message saying it changed nothing
but comments. `5d670d0` then carried the other four under a message claiming
nine.

The branch was already pushed and the project forbids force pushing, so the
history was not rewritten. The pull request body was corrected to say what
each commit actually contains, and this entry exists because a corrected body
is not where somebody looks when reading `git log`.

**What this costs.** Every separation rule on this property is enforced by a
human reading commit messages: content apart from approvals, harness apart
from content, records apart from both. A message that misdescribes its own
diff defeats all of them at once, and nothing in the repository checks it. The
approval gate is the clearest case: an approval commit is trusted because its
message says it contains no content, and that claim has never been verified by
anything.

**What to do instead.** Stage hunks, not files, when a working tree holds more
than one change: `git add -p`, or commit the changes in the order they were
made. And before any commit whose message makes a claim about its own scope,
read `git diff --cached` rather than trusting the file list. The claim in the
message is the thing being made, so it is the thing to check.

**A plant on a value that already appears many times is measured by count,
never by presence.**

A word plant was reported twice as having flipped from red to green, and the
report went further: it quoted a gross-against-net comparison as showing 129
spare credits for "the" and concluded the budget had slack. A change was
designed to close it.

None of that was true. The classifier asked whether the string appeared on an
approved line. "the" appears on hundreds of approved lines and hundreds of
unapproved ones in the same run, so the answer was yes whatever the harness
did. Measured properly, by planting one instance and counting the unapproved
lines with and without it, the count rose by exactly one both before and after
the change. The budget was already tight and the proposed fix would have
turned 516 legitimately approved words into unapproved ones for nothing.

The gross-against-net figure was the second error and it fed the first.
Funding comes from APPROVED blocks; the 681 figure counted words in ALL added
blocks. The two numbers were never comparable, and the difference between them
was read as slack.

**The rule. When a plant targets a value the capture already holds many
copies of, the test is the change in count, not the presence of a line.**
Record the count without the plant, plant one, record it again, and state the
difference. A presence check on a duplicated value answers a question nobody
asked.

And when a measurement taken outside the harness is used to justify changing
the harness, the two have to be computed over the same set. Otherwise the
difference measures the disagreement between the methods rather than anything
about the site.

**Sample output is labelled with the plant that produced it.**

A pull request body showed a harness printing

    ### furniture the templates promised and the capture did not hold
      "The definition"   expected: 21   found: 20

beside a second sample taken from real data, with nothing to tell them apart.
The first was manufactured: an eyebrow had been deleted from the capture to
exercise that branch. Read as written it says a card is missing from
production, which is a defect report about the live site, and it was neither
true nor claimed to be false.

Nobody was misled, because the owner asked. That is the point. The reader had
to ask, and the answer lived only in this session.

**The rule. Any sample of tool output in a report or a pull request body says
where it came from, in the sample.** Real run, or which plant produced it. Not
in a paragraph above it, because output gets quoted onward and the caption
does not travel with it. A sample with no provenance reads as evidence about
production, which is the strongest thing a sample can claim and the thing it
is least often entitled to.

This applies hardest to output that looks like a defect report. A harness
prints the same words whether it found something or was shown something, and
the difference is entirely in what the person running it did a moment earlier.

**A one-off check is run against a known positive before its result is
cited.**

On 21 September a session reported twice that article 5 served none of its
three threshold figures inside a link. The check was

    grep -o '<a[^>]*>\$[0-9,]*</a>'

and it could not match anything, ever. Every one of those anchors contains an
`sr-only` span, so the closing tag never follows the figure directly. The
figure was reported as 0 of 3 on a page that had all three, and the number was
quoted as evidence in two reports.

It was not caught by anything, because a check that returns zero returns a
plausible answer. A rule that finds nothing and a rule that cannot find
anything are indistinguishable from their output, and the second one is
silent by construction.

**The rule. Before citing the result of a check written for one occasion, run
it against a case it must find.** Not a case it must ignore, which proves only
that it is not wildly over-broad. A case where the answer is known to be
non-zero, and the check has to produce it. If nothing on hand is a known
positive, make one: plant the thing, see the check name it, take the plant out
again. That is the same two-plant discipline the audit rules are held to, and
the reason a one-off escapes it is only that nobody wrote it down.

**Where this bites hardest.** Greps and regexes over rendered HTML, because
markup nests and a pattern written against the shape in a person's head
matches nothing in the shape a framework emits. Also any check whose pass
condition is a zero, a count of none, or an empty list, because those are the
answers a broken check gives for free.

**A state check is only true at the moment it runs, and a report is not that
moment.**

On 21 September a session verified that `origin/main` was unchanged, that five
pull requests were open, and that production served 29 routes. It then worked
for ten minutes and published a report giving those findings as current state.
The owner had merged all five pull requests between 15:44:50 and 15:45:35 UTC,
inside that window, and two of the session's own commits are stamped 15:52.
Every figure in the report was true when measured and false when read.

This is the stale capture in a different costume. There, a comparison read a
leftover file and reported CLEAN about a state that no longer existed. Here, a
report read a leftover measurement and did the same thing, and nothing in the
harness could have caught it, because nothing in the harness knows what a
report says.

**The rule. Any state that can change outside this session is re-checked as the
last act before the report that states it.** That means `git fetch` and the
remote refs, pull request status, production served bytes, and any deployment
state. Not at the top of the work, not in the middle, last. If a check is
expensive enough that running it twice is a real cost, it runs once, at the
end, and the earlier pass is treated as orientation rather than as a finding.

Two corollaries worth writing down. A figure carried forward from an earlier
step in the same turn is a quotation, not a measurement, and it is labelled
with when it was taken. And a report that says "verified" about anything
outside the working tree is making a claim about a clock as well as a fact.

**Content and removals reached `main` without a read, and the approvals were
written afterwards.**

On 21 September the owner merged PR #2 and PR #5 before reading either. PR #2
carried five articles that no approval entry covered. PR #5 carried the
cleanup, which rewrites text on routes that already existed, so it carried 130
removals as well as additions. Both landed on `main` and reached production,
and the retroactive approvals were written after the fact.

It is the same shape as the entry below it: a control reported as exercised
that was not. The gate record's whole claim is that content reaches `main`
after a person has read it, and for these two merges the reading happened in
the other order. The approvals that now exist describe a decision taken after
the deployment, and anyone auditing this later should know that rather than
infer the usual sequence from the usual paperwork.

The owner identified this himself and recorded it as his error. It is here
because the record is about what happened, not about who is at fault: an
approval written after a merge proves less than one written before it, and the
file should not let the two look alike.

**The control was reported as in place, and it was not.**

On 20 September 2026 the owner said both were being set up on GitHub, and this
file was written on that basis: branch protection on `main` requiring a pull
request and review, plus CODEOWNERS on `scripts/`. The paragraph above was
written as though that had happened.

It had not. On 21 September a session pushed four commits straight to `main`
and the push succeeded. Checking afterwards: `main` returned "Branch not
protected", the repository rulesets list was empty, and no CODEOWNERS file
existed anywhere in the tree. So for the whole of the intervening period the
only control against a session approving its own work was a sentence in this
file describing a control that did not exist.

That is worse than having no control, and it is the same shape as the stale
capture: something reported a state it had not verified, and everything
downstream read the report instead of the state. A rule recorded as enforced is
read as enforced.

**What is required for the control to mean anything.** Branch protection alone
does not close this. The owner and the agent were operating under the same
GitHub credentials, and GitHub cannot distinguish two actors who authenticate
as one. A rule requiring review by somebody other than the author is satisfied
by the owner's own identity whoever is driving it, and a CODEOWNERS entry
naming the owner is satisfied the same way. The agent needs its own GitHub
identity before either control can tell the two apart, and the owner is setting
that up alongside the ruleset and CODEOWNERS on `scripts/` and this file.

**Until the owner says it is done, no session pushes to `main`, even where
the push would succeed.** A push succeeding is not evidence that it was
allowed; on 21 September it was evidence of the opposite. Feature branches and
pull requests only, and the fact that a direct push works is a finding to
report rather than a route to take.

**And do not build either control from inside a session.** A CODEOWNERS file
written by the session it is meant to constrain, in the commit it is meant to
gate, is the control that only looks like one. This belongs to the owner, on
GitHub, under an identity the agent does not hold.

**Two checks agreeing is worth less than it sounds when they share a half.**

Rule One has two halves, a capture and a comparison, and there are two tools
that read the capture: `rule-one-compare.mjs` and
`article-propagation-check.mjs`. They were written separately, they share no
code, and on 21 September they returned the same figure, 3,602, for the same
run. The overnight report presented that as two independent checks agreeing.

That overstated it, and the overstatement is the point of this entry. Only the
comparison logic is independent. Both read the same two JSON files, produced by
the same capture, from the same build. Any defect in the capture is invisible
to both of them, and they will agree about it confidently. An agreement between
two readers of one artifact is evidence about the readers, not about the
artifact.

It was also weaker than that at the time. Planting two words onto a route,
`the` and `Franchise`, was caught by the comparator and missed by the
propagation check, because the second was still matching a vocabulary at word
level. So the matching totals partly reflected the looser predicate agreeing
with the stricter one, which is not corroboration at all.

What to say instead, when both are green: the comparison was checked two ways
against one capture. If the capture is the thing in doubt, neither of them
helps, and the answer is a fresh capture from a fresh build rather than a
second opinion on the old one.

**Record a bound in the order it was actually arrived at.**

Three tokens reach the word inventories with no block behind them, and the
allowance for them is one of each per article in a batch. The order that number
was arrived at is part of the record, because it was not derived and then
checked.

Twelve instances came back unfunded. A bound of one of each per article, for a
four article batch, is twelve. The number was chosen because it matched, and
only afterwards verified against the two card templates, which do turn out to
emit exactly one "Read this" label per hub card and one separator per title on
`/franchising`. The justification holds. The sequence was observe, size, then
justify, and a bound sized to a result is worth less than one derived from a
template even when the two agree.

Anyone changing it should re-derive from the templates first and compare
afterwards, which is the order this one missed.

**A separate failure class: the data was right and the reader was not.**

This is not the audit-checking-the-wrong-thing pattern above, and it is on the
record as its own thing because the remedy is different.

Fifteen article candidates were proposed. One of them, `franchise resale`, was
the only keyword in the entire Ahrefs pull flagged `transactional: true`. That
flag was in the response, in context, and it was read past. The candidate went
into an approved batch and was only caught later when a SERP check showed every
top result was a marketplace listing units for sale, which Craftline cannot
publish without making a territory availability claim.

Nothing was broken. No check was pointed at the wrong unit, no rule passed while
looking elsewhere. The correct signal was present, retrieved, and displayed, and
the person reading it did not act on it.

**Why it matters more than it looks.** Every defence this project has built is a
mechanism that surfaces a signal. That is the right investment, and it has a
ceiling: a surfaced signal still has to be read. Adding another audit does not
address this class, and reaching for one is the tempting wrong answer.

**What does address it.** When a tool returns a field that would disqualify a
result, say what the field says before proposing the result, in the same
sentence. Not in a footnote, not in a column the reader may skim. If a pull
returns an intent, a flag, a status or a warning, that value is part of the
recommendation and not metadata beside it. The candidate table should have read
"transactional intent, cannot satisfy" in the row rather than carrying a
difficulty score and a beatability argument as though the row were viable.

**What the in-repo work is for, so nobody mistakes it for a fix.** The verdict
line prints how many allowlist entries a run leaned on and says outright that
the list is self certifying, and the gap is recorded in the harness as a plant
that does not pass. That is legibility, not control. It is good against
carelessness, which is what has actually failed here every time, and worth
nothing against intent. Do not write a control that only looks like one: say
what a mechanism cannot do, next to what it can.

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
