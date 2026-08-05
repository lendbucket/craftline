/**
 * FRANCHISING EDUCATION CONTENT
 * ============================
 *
 * General explanatory material about how franchising works as a structure.
 * This is deliberately separate from src/config/company.ts, and the line
 * between the two files is the legal line this whole property is built on:
 *
 *   company.ts       facts about Craftline. What it is, what it holds, what it
 *                    looks for. Everything the site may assert about itself.
 *
 *   this file        how franchising works in general, and what the law
 *                    requires of any franchisor. Facts about the framework,
 *                    not representations about this company.
 *
 * Describing the framework is permitted before an FDD is issued. Describing
 * this company's terms is not. So NOTHING in this file may state or imply a
 * Craftline fee, royalty rate, territory grant, capital requirement, or any
 * figure about what an operator might earn. Where a mechanism normally carries
 * a number, this file explains the mechanism and says the number lives in the
 * disclosure document.
 *
 * If you are adding an entry, the test is: would this sentence be equally true
 * and equally publishable on a site belonging to a franchisor that has never
 * heard of Craftline? If not, it belongs in company.ts or nowhere.
 */

/** The vocabulary a first time reader is expected to already know, and does not. */
export const FRANCHISE_GLOSSARY = [
  {
    term: "Franchisor",
    body: "The company that owns the brand, the trademarks, and the operating system, and licenses the right to run a business under them. It is responsible for maintaining the brand and supporting the people operating under it.",
  },
  {
    term: "Franchisee",
    body: "The independent owner who runs a business under the brand. A franchisee owns their business and is responsible for it, and agrees to run it to the standards the brand sets.",
  },
  {
    term: "Franchise agreement",
    body: "The contract between the two. It sets out the term, what each side must do, what happens if either side fails to do it, and how the relationship ends. It is the document that actually governs, and it is attached to the disclosure document so you can read it before you commit.",
  },
  {
    term: "Royalty",
    body: "An ongoing payment from the franchisee to the franchisor, normally a percentage of sales, in exchange for the continued right to use the brand and the support that comes with it. The rate and the basis are stated in the disclosure document, which is where you compare one system against another.",
  },
  {
    term: "Brand standards",
    body: "The requirements every operator follows so that the brand means the same thing everywhere: how work is performed, how customers are handled, how vehicles and uniforms and premises look, and what gets measured. Standards are the reason a customer can predict what they will get, and enforcing them is a franchisor obligation rather than an optional extra.",
  },
  {
    term: "Territory",
    body: "The geographic area a franchisee operates in, and the protections that come with it. Territories differ widely between systems in how they are drawn and what exclusivity they carry, and the specifics for any given system are set out in its disclosure document.",
  },
  {
    term: "Initial franchise fee",
    body: "A one time payment made when joining a system, distinct from the ongoing royalty. As with the royalty, the amount belongs in the disclosure document.",
  },
] as const;

/**
 * What the FDD is and why it exists.
 *
 * Every claim here is about federal and state regulation rather than about
 * Craftline. The fourteen day rule is the FTC Franchise Rule minimum; some
 * registration states impose longer or additional requirements, which is why
 * the wording below says at least and does not enumerate states.
 */
export const FDD_EXPLAINER = [
  {
    heading: "What it is",
    body: "The Franchise Disclosure Document is a standardised document a franchisor must give you before it can sell you a franchise. It is long, it is not marketing, and it is not written to persuade you. It exists so that you can evaluate a system on the same basis as any other.",
  },
  {
    heading: "Why it is standardised",
    body: "It is organised into a fixed set of numbered items, in the same order, for every franchisor in the country. That structure is the point: it means you can put two systems side by side and compare the same item in each, instead of comparing two brochures that each emphasise whatever flatters them most.",
  },
  {
    heading: "What is in it",
    body: "The franchisor and its history, its litigation and bankruptcy history, the fees, the estimated initial investment, your obligations and theirs, territory, trademarks, training, financial statements, and a list of current and former franchisees you may contact. The franchise agreement itself is attached.",
  },
  {
    heading: "The waiting period",
    body: "Federal rule requires that you receive the document at least fourteen calendar days before you sign anything or pay anything. Some states require more. The waiting period is yours: it exists so you can read the document, call the franchisees listed in it, and take it to a franchise attorney and an accountant.",
  },
  {
    heading: "What it does not do",
    body: "It does not promise that a business will succeed. A franchisor is not required to make any projection of financial performance, and many do not. Where one is made it must appear in a specific item of the document and be substantiated. A figure quoted anywhere else, in conversation or in an advertisement, is not a disclosure.",
  },
] as const;

/**
 * Honest advice to a prospect, including advice that is against a franchisor's
 * short term interest. It is here because a reader who follows it makes a
 * better decision, and a franchise system does not benefit from operators who
 * joined without understanding what they joined.
 */
export const DUE_DILIGENCE = [
  "Read the whole disclosure document, including the litigation item and the financial statements, and do not let anyone summarise it for you.",
  "Call the current and former franchisees listed in it. Former franchisees are the more useful call, and a system that makes them hard to reach has told you something.",
  "Take the document to a franchise attorney and to an accountant, both independent of the franchisor.",
  "Ask what happens when it goes badly: what support looks like in a bad quarter, what the franchisor can require of you, and how the agreement ends.",
  "Treat any number given to you outside the disclosure document as though it had not been given to you at all.",
] as const;
