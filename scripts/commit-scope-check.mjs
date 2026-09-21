#!/usr/bin/env node
/**
 * COMMIT SCOPE CHECK
 * ==================
 *
 *   node scripts/commit-scope-check.mjs            new commits, fails on breach
 *   node scripts/commit-scope-check.mjs --history  every commit since the
 *                                                  redesign, reported not failed
 *   node scripts/commit-scope-check.mjs --validate checker's own two plants
 *
 * WHY A TRAILER RATHER THAN A GUESS. The first version of this read the
 * subject line and inferred a commit's kind from its wording. That is the
 * defect it exists to catch, wearing a different hat: a commit that
 * misdescribes itself is classified by the misdescription, so the one case
 * worth finding is the one case it cannot see. On 21 September a commit whose
 * message said it changed two comments carried four content edits, and no
 * reading of that message would have flagged it.
 *
 * So every commit from now on declares its own kind in a trailer, and this
 * checks the declaration against the diff. A declaration can still be wrong,
 * but a wrong declaration is a visible claim in the commit message rather than
 * an inference nobody made, and this fails on it.
 *
 *   Kind: approval    only scripts/rule-one-compare.mjs
 *   Kind: content     nothing under scripts/
 *   Kind: harness     only scripts/
 *   Kind: records     only AGENTS.md and BACKLOG.md
 *
 * A MISSING TRAILER FAILS. Not warns. A commit with no declaration is a commit
 * nobody decided the shape of, and the whole point is that somebody decides.
 *
 * HISTORY IS REPORTED, NOT FAILED. Commits written before the trailer existed
 * cannot carry one, so --history classifies them by subject line, says so, and
 * never exits non zero on them. The inference is weak and is labelled weak.
 */
import { execSync } from "node:child_process";

const git = (cmd) => execSync(`git ${cmd}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

/** The redesign merge. Nothing before it is in scope for the history pass. */
const SINCE = "d394176";

const KINDS = {
  approval: {
    allows: (f) => f === "scripts/rule-one-compare.mjs",
    says: "only scripts/rule-one-compare.mjs",
  },
  content: {
    allows: (f) => !f.startsWith("scripts/"),
    says: "nothing under scripts/",
  },
  harness: {
    allows: (f) => f.startsWith("scripts/"),
    says: "only scripts/",
  },
  records: {
    allows: (f) => f === "AGENTS.md" || f === "BACKLOG.md",
    says: "only AGENTS.md and BACKLOG.md",
  },
};

function bodyOf(sha) {
  return git(`log -1 --format=%B ${sha}`);
}
function subjectOf(sha) {
  return git(`log -1 --format=%s ${sha}`).trim();
}
function filesOf(sha) {
  return git(`show --pretty=format: --name-only ${sha}`)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
function isMerge(sha) {
  return git(`rev-list --parents -n 1 ${sha}`).trim().split(/\s+/).length > 2;
}

/** The declared kind, or null. Last trailer wins, so an amend can correct one. */
function declaredKind(sha) {
  const lines = bodyOf(sha).split("\n");
  let found = null;
  for (const l of lines) {
    const m = l.match(/^Kind:\s*(\w+)\s*$/i);
    if (m) found = m[1].toLowerCase();
  }
  return found;
}

/** Weak, and only used for commits written before the trailer existed. */
function inferKind(subject) {
  const s = subject.toLowerCase();
  if (/^approve\b/.test(s)) return "approval";
  if (/^record\b/.test(s)) return "records";
  return null;
}

function judge(sha, { historical }) {
  if (isMerge(sha)) return { sha, skip: "merge" };
  const files = filesOf(sha);
  if (files.length === 0) return { sha, skip: "empty" };
  const subject = subjectOf(sha);

  const declared = declaredKind(sha);
  if (!declared) {
    if (!historical) {
      return { sha, subject, files, fail: "no Kind trailer" };
    }
    const guess = inferKind(subject);
    if (!guess) {
      const onlyScripts = files.every((f) => f.startsWith("scripts/"));
      const noScripts = files.every((f) => !f.startsWith("scripts/"));
      const kind = onlyScripts ? "harness" : noScripts ? "content" : null;
      if (!kind) {
        return { sha, subject, files, report: "mixes scripts/ with other paths", inferred: true };
      }
      return { sha, skip: "inferred clean" };
    }
    const rule = KINDS[guess];
    const bad = files.filter((f) => !rule.allows(f));
    return bad.length
      ? { sha, subject, files, bad, says: rule.says, kind: guess, inferred: true, report: "breaks its inferred kind" }
      : { sha, skip: "inferred clean" };
  }

  const rule = KINDS[declared];
  if (!rule) return { sha, subject, files, fail: `unknown Kind "${declared}"` };
  const bad = files.filter((f) => !rule.allows(f));
  if (bad.length) {
    return { sha, subject, files, bad, says: rule.says, kind: declared, fail: "breaks its declared kind" };
  }
  return { sha, skip: "clean" };
}

/* ---------------- the checker's own plants ---------------- */
if (process.argv.includes("--validate")) {
  /*
    KNOWN POSITIVE. 07ec3b0 shipped content, rewrote the audit rule policing
    it, and fixed four descriptions, all in one commit. Read as content it must
    be flagged. If the checker returns nothing here it is broken, and nothing
    else it prints means anything.
  */
  const files = filesOf("07ec3b0");
  const bad = files.filter((f) => !KINDS.content.allows(f));
  console.log("KNOWN POSITIVE 07ec3b0 read as content");
  if (bad.length === 0) {
    console.log("  NOT FLAGGED. The checker is broken.");
    process.exit(1);
  }
  console.log(`  flagged, ${bad.length} file(s) outside ${KINDS.content.says}`);
  for (const f of bad) console.log(`      ${f}`);

  /*
    KNOWN NEGATIVE. A records commit touching only AGENTS.md must pass, so the
    checker is not simply flagging everything.
  */
  const neg = filesOf("60cda7a").filter((f) => !KINDS.records.allows(f));
  console.log("\nKNOWN NEGATIVE 60cda7a read as records");
  console.log(neg.length ? "  FLAGGED. The checker is over-broad." : "  not flagged, correct");
  if (neg.length) process.exit(1);

  /* A missing trailer must fail on a new commit. */
  const missing = judge("60cda7a", { historical: false });
  console.log("\nKNOWN POSITIVE: a commit with no Kind trailer, judged as new");
  console.log(missing.fail === "no Kind trailer" ? "  failed, correct" : "  NOT FAILED. The checker is broken.");
  if (missing.fail !== "no Kind trailer") process.exit(1);

  console.log("\nchecker validated: two positives and one negative\n");
}

/* ---------------- the run ---------------- */
const historical = process.argv.includes("--history");
const range = historical ? `${SINCE}..HEAD` : `origin/main..HEAD`;
let log;
try {
  log = git(`log --reverse --format=%H ${range}`).split("\n").filter(Boolean);
} catch {
  console.error(`cannot resolve the range ${range}. Fetch origin first.`);
  process.exit(2);
}

const failures = [];
const reports = [];
const skipped = new Map();
for (const sha of log) {
  const v = judge(sha, { historical });
  if (v.skip) {
    skipped.set(v.skip, (skipped.get(v.skip) ?? 0) + 1);
    continue;
  }
  (v.fail && !historical ? failures : reports).push(v);
}

const show = (v) => {
  console.log(`  ${v.sha.slice(0, 7)}  ${(v.kind ?? "?").padEnd(8)} ${v.subject.slice(0, 62)}`);
  console.log(`      ${v.fail ?? v.report}${v.inferred ? ", kind inferred from the subject line" : ""}`);
  if (v.says) console.log(`      rule: ${v.says}`);
  for (const f of v.bad ?? []) console.log(`      also touched: ${f}`);
};

console.log(`commits examined (${range}): ${log.length}`);
for (const [k, n] of skipped) console.log(`  skipped, ${k}: ${n}`);

if (reports.length) {
  console.log(`\nreported, not failed: ${reports.length}`);
  for (const v of reports) show(v);
}

console.log(`\n================ RESULT ================`);
if (failures.length === 0) {
  console.log(
    historical
      ? `HISTORY REPORTED. ${reports.length} commit(s) would break their kind. Nothing is failed: these predate the trailer and their kind is inferred from a subject line, which is the weakest signal available and is why the trailer exists.`
      : `ALL DECLARED AND ALL IN SCOPE. Every commit carries a Kind trailer and touches only what that kind allows.`,
  );
} else {
  console.log(`${failures.length} commit(s) break their declared kind or carry none:`);
  for (const v of failures) show(v);
  process.exitCode = 1;
}
