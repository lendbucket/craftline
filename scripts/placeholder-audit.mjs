#!/usr/bin/env node
/**
 * PLACEHOLDER AUDIT
 * =================
 *
 * Fails the build if unfinished content reached rendered output.
 *
 * The premise: fabricated and placeholder content is the single most damaging
 * failure mode for this property. A fake phone number or a stray "TBD" on a
 * franchisor site is not a cosmetic bug, it is a credibility problem in front
 * of exactly the audience the site exists to reach. Reviewing for it by eye
 * does not scale past a few pages, so it is checked mechanically instead.
 *
 * Scans BUILT HTML, not source, so it sees what a visitor sees. Source files
 * are allowed to discuss placeholders (this file does); pages are not.
 *
 * Run after `npm run build`:
 *   npm run build && npm run placeholder-audit
 *
 * Backport target: this audit is new here and should be copied to the Wattsmith
 * repo, which has the same exposure and none of this checking.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.cwd();

/**
 * Where built HTML lands. `.next/server/app` is the standard App Router build
 * output; `out` covers a static export if this project ever adopts one. Both
 * are checked so the audit does not silently pass by finding nothing.
 */
const BUILD_DIRS = [
  join(ROOT, ".next", "server", "app"),
  join(ROOT, "out"),
];

const RULES = [
  {
    id: "fake-phone-555",
    // The 555 reserved range, as an area code or as an exchange. Covers
    // (555) 123-4567, 555.123.4567, 5551234567, and 512-555-0100.
    pattern: /\(?\b555\)?[\s.\-]?\d{3}[\s.\-]?\d{4}\b|\b\d{3}[\s.\-]?555[\s.\-]?\d{4}\b/g,
    message: "Reserved 555 phone number in rendered output.",
  },
  {
    id: "lorem-ipsum",
    pattern: /\blorem\s+ipsum\b|\bdolor\s+sit\s+amet\b/gi,
    message: "Lorem ipsum in rendered output.",
  },
  {
    id: "todo-marker",
    pattern: /\b(TODO|TBD|FIXME|XXX|PLACEHOLDER)\b/g,
    message: "Unfinished-work marker in rendered output.",
  },
  {
    id: "placeholder-email",
    pattern:
      /[\w.+-]+@(example|test|domain|email|yourdomain|yoursite|mysite)\.(com|org|net)\b|\b(your|youremail|yourname|name|email|test|foo|bar|sample)@[\w.-]+\.\w+/gi,
    message: "Placeholder email address in rendered output.",
  },
  {
    id: "template-slot",
    // An unreplaced template token that survived into HTML.
    pattern: /\{\{[^}]{1,60}\}\}|\[(?:insert|your)\b[^\]]{0,60}\]/gi,
    message: "Unreplaced template token in rendered output.",
  },
  {
    id: "coming-soon",
    pattern: /\bcoming\s+soon\b/gi,
    message:
      "\"Coming soon\" in rendered output. Ship the page or omit the link.",
  },
];

/** Recursively collect files with the given extensions. */
function collect(dir, extensions, found = []) {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collect(full, extensions, found);
    } else if (extensions.includes(extname(full))) {
      found.push(full);
    }
  }
  return found;
}

/**
 * Strip inline <script> bodies before matching. Framework payloads and the
 * flight data embedded there routinely contain tokens that look like our
 * patterns, and a false positive that cannot be fixed teaches people to ignore
 * the audit. JSON-LD is deliberately NOT stripped: it is authored content and
 * it is exactly where a placeholder would hide.
 */
function stripNoise(html) {
  return html.replace(
    /<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi,
    " ",
  );
}

/** Report line number for an offset, so a hit is actually findable. */
function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

const failures = [];

// ---------------------------------------------------------------------------
// 1. Rendered output
// ---------------------------------------------------------------------------
const htmlFiles = BUILD_DIRS.flatMap((dir) => collect(dir, [".html"]));

if (htmlFiles.length === 0) {
  console.error(
    "placeholder-audit: no built HTML found. Run `npm run build` first.",
  );
  process.exit(1);
}

for (const file of htmlFiles) {
  const raw = readFileSync(file, "utf8");
  const content = stripNoise(raw);
  for (const rule of RULES) {
    // Reset because the patterns are global and reused across files.
    rule.pattern.lastIndex = 0;
    let match;
    while ((match = rule.pattern.exec(content)) !== null) {
      failures.push({
        file: relative(ROOT, file),
        line: lineOf(content, match.index),
        rule: rule.id,
        message: rule.message,
        excerpt: match[0].trim().slice(0, 80),
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Imagery manifest consistency
//
// Every image slot is declared in src/data/images.ts. A slot marked "ready"
// must point at a file that exists, or the site renders a broken image, which
// is its own kind of placeholder.
// ---------------------------------------------------------------------------
const manifestPath = join(ROOT, "src", "data", "images.ts");

if (!existsSync(manifestPath)) {
  failures.push({
    file: "src/data/images.ts",
    line: 0,
    rule: "manifest-missing",
    message: "Imagery manifest is missing. Every image slot must be tracked.",
    excerpt: "",
  });
} else {
  const manifest = readFileSync(manifestPath, "utf8");

  // Non-null `src` values in the manifest must resolve under /public.
  for (const match of manifest.matchAll(/src:\s*"([^"]+)"/g)) {
    const assetPath = match[1];
    if (!existsSync(join(ROOT, "public", assetPath.replace(/^\//, "")))) {
      failures.push({
        file: "src/data/images.ts",
        line: lineOf(manifest, match.index),
        rule: "manifest-missing-asset",
        message: `Manifest points at "${assetPath}", which does not exist under /public.`,
        excerpt: assetPath,
      });
    }
  }

  // A slot cannot claim "ready" while its src is still null.
  for (const match of manifest.matchAll(
    /status:\s*"ready",\s*\n\s*src:\s*null/g,
  )) {
    failures.push({
      file: "src/data/images.ts",
      line: lineOf(manifest, match.index),
      rule: "manifest-ready-without-src",
      message: 'Slot is marked "ready" but has no src.',
      excerpt: "",
    });
  }

  const pending = [...manifest.matchAll(/status:\s*"pending"/g)].length;
  if (pending > 0) {
    console.log(
      `placeholder-audit: ${pending} image slot(s) still pending real photography. ` +
        "That is allowed. See src/data/images.ts for the shot list.",
    );
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
console.log(
  `placeholder-audit: scanned ${htmlFiles.length} rendered page(s) against ${RULES.length} rule(s).`,
);

if (failures.length === 0) {
  console.log("placeholder-audit: clean.");
  process.exit(0);
}

console.error(`\nplaceholder-audit: ${failures.length} issue(s).\n`);
for (const failure of failures) {
  console.error(`  ${failure.file}:${failure.line}  [${failure.rule}]`);
  console.error(`    ${failure.message}`);
  if (failure.excerpt) console.error(`    found: ${failure.excerpt}`);
}
console.error("");
process.exit(1);
