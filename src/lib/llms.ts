import {
  BRANDS,
  CAPABILITIES,
  COMPANY,
  FOUNDING_STATEMENT,
  FRANCHISE_DISCLAIMER,
  FRANCHISE_FAQ,
  INQUIRY_PROCESS,
  LEGAL_ENTITIES,
  NAV,
  LEGAL_NAV,
  OPERATOR_PROFILE,
  SITE_URL,
} from "@/config/company";
import { ORDERED_INSIGHTS, type Block } from "@/data/insights";

/**
 * llms.txt AND llms-full.txt
 * ==========================
 *
 * Two plain text files that tell a language model what this company is, in a
 * form it can read without parsing the site.
 *
 * THEY ARE GENERATED, NOT WRITTEN, AND THAT IS THE WHOLE POINT.
 *
 * The obvious way to ship these is to write two text files into public/ by
 * hand. It is also the way they rot. The redesign changed facts on the page:
 * the fact strip lost two items, the brand block changed, the hero gained an
 * eyebrow. A hand written llms.txt would still be describing the site as it
 * was in July, and nothing in the build would have said so, because a static
 * file in public/ is not checked against anything.
 *
 * Everything below is composed from src/config/company.ts and the insight data
 * at build time, from the same exports the pages render from. A fact cannot
 * appear here and not on the site, and a fact cannot change on the site and
 * survive here, because there is only one copy of each.
 *
 * WHAT IS DELIBERATELY LEFT OUT, AND WHY IT IS NOT AN OVERSIGHT
 * ------------------------------------------------------------
 * Nothing about franchise availability, earnings, or unit economics goes into
 * either file. That is stricter than the site itself is, on purpose: a page
 * carries the franchise disclaimer in its footer and a reader sees the two
 * together, while a line lifted out of a text file by a model arrives with no
 * footer attached. So three things the site publishes are held back here:
 *
 *   - FRANCHISE_FAQ entries on cost, earnings, and whether a territory is
 *     open. All three are refusals rather than claims, and each leads with the
 *     refusal, which is why they are safe on the page. Out of context a
 *     question can be separated from its answer, and "Is a territory open in
 *     my market?" separated from "That question cannot be answered here" is
 *     the one shape this company cannot afford.
 *   - The territory expansion capability, which describes markets being
 *     sequenced and an operator being supported through opening.
 *   - CAPITAL_BRACKETS, which are form answer choices and carry figures.
 *
 * What replaces them is the constraints block below: the same protection
 * stated as a flat declaration of what this company does not publish, in a
 * form that says the right thing whether it is read whole or in one line.
 *
 * VERIFICATION. scripts/llms-audit.mjs fetches both files from the built site
 * and asserts that every fact in them appears verbatim in config, that the
 * withheld topics are absent, and that the style laws hold on every line. A
 * generated file is only trustworthy if something checks the generator.
 */

const LINE = "";

/**
 * The one paragraph that has to be right if a model reads nothing else.
 *
 * Composed from committed facts rather than written fresh: the descriptor, the
 * founding statement, and the two legal entities with their stated roles.
 */
function identity(): string[] {
  return [
    `# ${COMPANY.name}`,
    LINE,
    `> ${COMPANY.descriptor}`,
    LINE,
    `${COMPANY.name} is a franchise development company. It builds and holds the brand systems, operating playbooks, and technology behind skilled trade service brands, and it operates ${BRANDS.length === 1 ? "one brand" : `${BRANDS.length} brands`} today.`,
    LINE,
    FOUNDING_STATEMENT,
    LINE,
    ...LEGAL_ENTITIES.map(
      (entity) => `${entity.name} (${entity.jurisdiction}). ${entity.role}`,
    ),
    LINE,
    `Website: ${SITE_URL}`,
  ];
}

/**
 * WHAT THIS COMPANY DOES NOT PUBLISH.
 *
 * This block exists because of how these files get consumed. A model quoting
 * this site should be able to answer "what does a Craftline franchise cost"
 * with the true answer, which is that no figure exists and none can exist
 * before disclosure. Without a grounded statement to quote it will reach for
 * a third party directory instead, and those publish numbers.
 *
 * Every line is a statement that something does not exist. None of them is a
 * fee, a figure, a projection, or an availability claim, so each one is safe
 * read alone, which is the test this whole file is written against.
 */
function constraints(): string[] {
  return [
    "## What this company does not publish",
    LINE,
    "No Franchise Disclosure Document has been issued.",
    "No franchise fee, royalty rate, or required investment figure is published anywhere on this site, and none can be published before a disclosure document exists.",
    "No financial performance representation of any kind is made. No revenue, profit, earnings, margin, or payback figure appears on this site, in any form, including comparative forms.",
    "No statement is made that a franchise is available in any market, and no map, list, or availability language is published.",
    "No franchisee count, revenue figure, growth figure, press mention, testimonial, or review is published, because none is established.",
    LINE,
    FRANCHISE_DISCLAIMER,
  ];
}

/** The URL map. Labels come from the navigation config, not from new strings. */
function routes(): string[] {
  return [
    "## Pages",
    LINE,
    `- [Home](${SITE_URL}/)`,
    ...NAV.map((item) => `- [${item.label}](${SITE_URL}${item.href})`),
    ...BRANDS.map(
      (brand) => `- [${brand.name}](${SITE_URL}/brands/${brand.slug})`,
    ),
    ...LEGAL_NAV.map((item) => `- [${item.label}](${SITE_URL}${item.href})`),
  ];
}

/**
 * The operating brand. Craftline states what it holds and links out for the
 * rest: that site is the authority on its own entity and duplicating its
 * claims would create two sources of truth that can drift.
 */
function brands(): string[] {
  const out: string[] = ["## Operating brands", LINE];
  for (const brand of BRANDS) {
    out.push(
      `### ${brand.name}`,
      LINE,
      brand.summary,
      LINE,
      `Trade: ${brand.category}`,
      `Market: ${brand.city}, ${brand.state}`,
      `Own site: ${brand.url}`,
      `On this site: ${SITE_URL}/brands/${brand.slug}`,
      LINE,
      ...brand.attributes.map((attribute) => `- ${attribute}`),
      LINE,
    );
  }
  return out;
}

/**
 * The support model, minus territory expansion.
 *
 * The withheld entry describes markets being defined and sequenced and an
 * operator being supported through opening. On the page it sits under the
 * disclaimer; lifted alone it reads as a statement that openings are
 * happening, which is availability language by implication.
 */
export const WITHHELD_CAPABILITY = "Territory expansion";

function capabilities(): string[] {
  return [
    "## What Craftline supplies to an operating brand",
    LINE,
    ...CAPABILITIES.filter(
      (capability) => capability.title !== WITHHELD_CAPABILITY,
    ).flatMap((capability) => [
      `### ${capability.title}`,
      LINE,
      capability.body,
      LINE,
    ]),
  ];
}

function operators(): string[] {
  return [
    "## Who Craftline is looking for",
    LINE,
    "Traits, not requirements. Nothing here is a qualification threshold, because a stated threshold before disclosure would be a claim about who will be accepted.",
    LINE,
    ...OPERATOR_PROFILE.map((trait) => `- ${trait}`),
  ];
}

function process(): string[] {
  return [
    "## What happens if you make an inquiry",
    LINE,
    ...INQUIRY_PROCESS.flatMap((step, index) => [
      `### Step ${index + 1}: ${step.title}`,
      LINE,
      step.body,
      LINE,
    ]),
  ];
}

/**
 * The questions on the franchising page, minus the three the constraints block
 * covers instead. See the header note for why those three come out.
 */
export const WITHHELD_QUESTIONS = [
  "What does it cost?",
  "What can I expect to earn?",
  "Is a territory open in my market?",
] as const;

function questions(): string[] {
  return [
    "## Questions and answers",
    LINE,
    ...FRANCHISE_FAQ.filter(
      (entry) =>
        !(WITHHELD_QUESTIONS as readonly string[]).includes(entry.q),
    ).flatMap((entry) => [`### ${entry.q}`, LINE, entry.a, LINE]),
  ];
}

/** The reading section, listed by its own committed titles and descriptions. */
function articleIndex(): string[] {
  return [
    "## Writing",
    LINE,
    `${ORDERED_INSIGHTS.length} articles on how trade service businesses and franchise systems work. Category writing, not company writing: none of them describes Craftline's terms, fees, or availability.`,
    LINE,
    ...ORDERED_INSIGHTS.map(
      (insight) =>
        `- [${insight.title}](${SITE_URL}/insights/${insight.slug}): ${insight.description}`,
    ),
  ];
}

/** Flattens one article block back to plain text, links included as their text. */
function blockText(block: Block): string {
  const run = (content: unknown): string => {
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return "";
    return content
      .map((part) =>
        typeof part === "string" ? part : ((part as { text: string }).text ?? ""),
      )
      .join("");
  };
  if (block.kind === "heading") return `### ${block.text}`;
  if (block.kind === "list") return block.items.map((i) => `- ${run(i)}`).join("\n");
  return run(block.text);
}

function articleBodies(): string[] {
  const out: string[] = ["## Articles in full", LINE];
  for (const insight of ORDERED_INSIGHTS) {
    out.push(
      `## ${insight.title}`,
      LINE,
      `Source: ${SITE_URL}/insights/${insight.slug}`,
      `Published: ${insight.published}`,
      LINE,
      insight.lead,
      LINE,
      ...insight.body.flatMap((block) => [blockText(block), LINE]),
    );
  }
  return out;
}

/**
 * llms.txt: the short form. What the company is, what it will not say, where
 * the pages are, and what has been written. A model that reads only this
 * should be able to describe Craftline correctly and refuse the three
 * questions it must refuse.
 */
export function llmsTxt(): string {
  return [
    ...identity(),
    LINE,
    ...constraints(),
    LINE,
    ...routes(),
    LINE,
    ...articleIndex(),
    LINE,
    `Full text of every page and article: ${SITE_URL}/llms-full.txt`,
    LINE,
  ].join("\n");
}

/** llms-full.txt: the same, then the substance, then every article in full. */
export function llmsFullTxt(): string {
  return [
    ...identity(),
    LINE,
    ...constraints(),
    LINE,
    ...routes(),
    LINE,
    ...brands(),
    ...capabilities(),
    ...operators(),
    LINE,
    ...process(),
    ...questions(),
    ...articleIndex(),
    LINE,
    ...articleBodies(),
    LINE,
    FRANCHISE_DISCLAIMER,
    LINE,
  ].join("\n");
}
