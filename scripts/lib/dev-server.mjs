import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Boot and reliably tear down a `next start` for an audit harness to drive.
 *
 * Ported from the Wattsmith repo, where it exists because two harnesses got the
 * same two things wrong and the failure mode is the expensive kind: a run that
 * reports a confident result about a server nobody meant to test.
 *
 *   1. `child.kill()` does not stop `next start` on Windows. spawn runs through
 *      a shell there, so killing the child kills the shell and orphans the node
 *      process holding the port.
 *
 *   2. A naive "is anything answering?" readiness probe treats any response as
 *      success. Combined with (1), a run whose own server failed to bind will
 *      silently attach to the orphan, audit an older build, and report whatever
 *      that stranger happens to do.
 *
 * So: refuse to start if the port is already answering, and kill the whole
 * process tree on the way out.
 *
 * This harness drives `next start` rather than `next dev` on purpose. Craftline
 * is a fully static site, and dev mode serves unminified output with a dev
 * overlay mounted in the DOM. Auditing that would mean auditing a page no
 * visitor ever receives, and the overlay is itself a source of phantom axe
 * findings.
 */

/**
 * Resolves true when nothing answers at `url`.
 *
 * Deliberately a connect probe and not a bind probe. Binding is the obvious
 * test and it is wrong here: on Windows a stray server holds the port on IPv6,
 * `localhost` resolves to ::1 first, and a probe that binds 127.0.0.1 succeeds
 * while every request the harness makes still reaches the stranger. Asking the
 * same question the harness asks, over the same name resolution, is the only
 * probe that cannot disagree with it.
 */
async function nothingAnswersAt(url) {
  try {
    await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(2000) });
    return false;
  } catch {
    // Refused, unreachable, or too slow to be a server we would have adopted.
    return true;
  }
}

async function waitForServer(url, timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // Not up yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Server at ${url} never came up.`);
}

/**
 * Start a production server on `port`. Returns the base URL and a stop() that
 * actually stops it.
 *
 * If BASE_URL is set in the environment, no server is started and that base is
 * returned with a no-op stop(), so every harness can be pointed at a server the
 * operator is already running.
 */
export async function startNextServer({ port, env = {}, timeoutMs = 120000 }) {
  const external = process.env.BASE_URL;
  if (external) {
    return { base: external.replace(/\/+$/, ""), stop: async () => {}, external: true };
  }

  // `next start` on a project that was never built fails in a way that reads as
  // a harness bug. Say the actual thing instead.
  if (!existsSync(join(process.cwd(), ".next", "BUILD_ID"))) {
    throw new Error(
      "No production build found. Run `npm run build` before the audits, " +
        "or set BASE_URL to point at a server you are already running.",
    );
  }

  const base = `http://localhost:${port}`;

  if (!(await nothingAnswersAt(`${base}/`))) {
    throw new Error(
      `Something is already serving ${base}. Refusing to start, because ` +
        `attaching to whatever is there would report results about the wrong ` +
        `server. Stop it and re-run.`,
    );
  }

  // Spawn the Next binary under this same node, rather than `npx` through a
  // shell. Going via a shell on Windows means the direct child is cmd.exe, which
  // is what makes (1) above bite, and passing args through a shell earns a
  // deprecation warning on modern node for good reason. The tree kill below
  // stays regardless, because `next start` still forks workers of its own.
  const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    env: { ...process.env, ...env },
    stdio: "ignore",
  });

  try {
    await waitForServer(`${base}/`, timeoutMs);
  } catch (error) {
    await stopTree(child);
    throw error;
  }

  return { base, stop: () => stopTree(child), external: false };
}

/**
 * Kill a child and everything it spawned.
 *
 * On Windows `taskkill /T` is what walks the tree; killing the shell alone
 * would leave the server behind.
 */
function stopTree(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();

    if (process.platform === "win32" && child.pid) {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
      });
      killer.on("exit", () => resolve());
      killer.on("error", () => {
        child.kill();
        resolve();
      });
      return;
    }

    child.once("exit", () => resolve());
    child.kill();
    // Do not hang the harness on a process that refuses to go.
    setTimeout(resolve, 5000).unref?.();
  });
}
