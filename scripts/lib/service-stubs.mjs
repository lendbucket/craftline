import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

/**
 * In-memory stand-ins for the two services the forms touch.
 *
 * WHY THIS EXISTS
 * ---------------
 * The forms audit has to answer two questions that cannot both be answered
 * against production: does a valid submission actually store a row and send
 * exactly one notification, and does a failed store actually surface as a
 * failure rather than a false success.
 *
 * Pointing the audit at the real project would answer the first question by
 * writing junk rows into the live Wattsmith database on every run, next to that
 * brand's real leads and applicants, and would answer the second not at all.
 * Pointing it at nothing answers only the second. So both services get a
 * stand-in that speaks their wire protocol, and the application stays entirely
 * unaware: it is configured by SUPABASE_URL and RESEND_API_URL exactly as it is
 * in production, and contains no test hooks.
 *
 * WHAT THIS IS NOT
 * ----------------
 * It is not PostgREST and it is not Resend. It implements the two calls this
 * codebase issues, an insert and a send, and nothing else. It does not enforce
 * RLS, because the service role bypasses RLS anyway and the real policy posture
 * is a property of the database rather than something a stub can demonstrate.
 * Assertions stay on what was received, so the audit is never testing the stub.
 */

/**
 * Starts both stand-ins on one port.
 *
 * Set `failInserts` to make every insert return 500, which is how the audit
 * exercises the failure path without needing a broken database.
 */
export function startServiceStubs({ port = 3141, failInserts = false } = {}) {
  /** Everything received, for the audit to assert against. */
  const received = { inserts: [], emails: [] };
  /**
   * Mutable so the audit can flip a healthy database into a failing one between
   * phases without restarting the application. Restarting would also reset any
   * state the failure path depends on, and would triple the run time.
   */
  const state = { failInserts };

  const server = createServer((req, res) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      let body = null;
      try {
        body = raw ? JSON.parse(raw) : null;
      } catch {
        body = raw;
      }

      const url = new URL(req.url, `http://localhost:${port}`);

      // --- Resend: POST /emails ------------------------------------------
      if (url.pathname === "/emails" && req.method === "POST") {
        received.emails.push({
          to: body?.to,
          from: body?.from,
          subject: body?.subject,
          text: body?.text,
          authorization: req.headers.authorization || null,
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ id: randomUUID() }));
        return;
      }

      // --- Supabase PostgREST: POST /rest/v1/<table> ----------------------
      const insert = url.pathname.match(/^\/rest\/v1\/([A-Za-z0-9_]+)$/);
      if (insert && req.method === "POST") {
        if (state.failInserts) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "stubbed failure",
              code: "STUB500",
              details: null,
              hint: null,
            }),
          );
          return;
        }
        const rows = Array.isArray(body) ? body : [body];
        for (const row of rows) {
          received.inserts.push({ table: insert[1], row });
        }
        res.writeHead(201, {
          "Content-Type": "application/json",
          // postgrest-js reads this when asked to return representations.
          "Content-Range": "0-0/1",
        });
        res.end(JSON.stringify([]));
        return;
      }

      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: `stub has no route for ${req.method} ${url.pathname}` }));
    });
  });

  return new Promise((resolve) => {
    server.listen(port, "127.0.0.1", () => {
      resolve({
        base: `http://127.0.0.1:${port}`,
        received,
        setFailInserts(value) {
          state.failInserts = value;
        },
        reset() {
          received.inserts.length = 0;
          received.emails.length = 0;
        },
        stop: () =>
          new Promise((done) => {
            server.close(() => done());
          }),
      });
    });
  });
}
