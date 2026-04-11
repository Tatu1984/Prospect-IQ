// SMTP email verifier — pings the recipient's mail server with RCPT TO
// without actually sending an email. Verifies:
//  1. Email syntax
//  2. MX records exist (domain accepts mail)
//  3. Mail server accepts the recipient address
//
// Runs entirely on our server using Node's built-in `dns` and `net`.
// No third-party API.
//
// Caveats:
//  - Many providers (Gmail, Outlook, Yahoo) return "accept-all" for any
//    address, so we can only confirm the domain exists. We report this
//    state honestly via `result` = "accept_all".
//  - Some ISPs block outbound port 25 — in that case verification falls
//    back to "unknown" but MX check still tells us the domain is real.

import { promises as dns } from "dns";
import net from "net";

export type VerifyResult = "deliverable" | "undeliverable" | "accept_all" | "unknown" | "invalid_syntax" | "no_mx";

export interface EmailVerification {
  email: string;
  result: VerifyResult;
  mxHost: string | null;
  checkedAt: string;
}

const EMAIL_SYNTAX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Well-known catch-all providers
const ACCEPT_ALL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "yahoo.co.in",
  "icloud.com",
  "me.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
]);

export async function verifyEmail(email: string): Promise<EmailVerification> {
  const checkedAt = new Date().toISOString();
  const lower = email.toLowerCase().trim();

  if (!EMAIL_SYNTAX.test(lower)) {
    return { email: lower, result: "invalid_syntax", mxHost: null, checkedAt };
  }

  const domain = lower.split("@")[1];

  // 1. MX lookup — real domains have MX records
  let mxHost: string | null = null;
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      return { email: lower, result: "no_mx", mxHost: null, checkedAt };
    }
    // Sort by priority (lowest = primary)
    mxRecords.sort((a, b) => a.priority - b.priority);
    mxHost = mxRecords[0].exchange;
  } catch {
    return { email: lower, result: "no_mx", mxHost: null, checkedAt };
  }

  // 2. Catch-all providers — we can't distinguish real from fake
  if (ACCEPT_ALL_DOMAINS.has(domain)) {
    return { email: lower, result: "accept_all", mxHost, checkedAt };
  }

  // 3. SMTP RCPT TO probe
  try {
    const smtpResult = await probeSmtp(mxHost, lower);
    return { email: lower, result: smtpResult, mxHost, checkedAt };
  } catch {
    return { email: lower, result: "unknown", mxHost, checkedAt };
  }
}

async function probeSmtp(mxHost: string, email: string): Promise<VerifyResult> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: mxHost, port: 25, timeout: 8000 });
    let state: "greet" | "helo" | "mail" | "rcpt" | "done" = "greet";
    let finalized = false;

    const finalize = (result: VerifyResult) => {
      if (finalized) return;
      finalized = true;
      try {
        socket.write("QUIT\r\n");
        socket.end();
      } catch {
        // ignore
      }
      resolve(result);
    };

    socket.setEncoding("utf8");

    socket.on("data", (chunk: string) => {
      const code = parseInt(chunk.slice(0, 3), 10);

      switch (state) {
        case "greet":
          if (code === 220) {
            socket.write("HELO prospectiq.local\r\n");
            state = "helo";
          } else {
            finalize("unknown");
          }
          break;
        case "helo":
          if (code === 250) {
            socket.write("MAIL FROM:<verify@prospectiq.local>\r\n");
            state = "mail";
          } else {
            finalize("unknown");
          }
          break;
        case "mail":
          if (code === 250) {
            socket.write(`RCPT TO:<${email}>\r\n`);
            state = "rcpt";
          } else {
            finalize("unknown");
          }
          break;
        case "rcpt":
          state = "done";
          if (code === 250 || code === 251) {
            finalize("deliverable");
          } else if (code === 550 || code === 551 || code === 553) {
            finalize("undeliverable");
          } else if (code === 450 || code === 451 || code === 452) {
            finalize("unknown");
          } else {
            finalize("unknown");
          }
          break;
        default:
          break;
      }
    });

    socket.on("error", () => finalize("unknown"));
    socket.on("timeout", () => {
      socket.destroy();
      finalize("unknown");
    });
    socket.on("end", () => {
      if (!finalized) finalize("unknown");
    });
  });
}

// Verify many emails in parallel, with a concurrency cap
export async function verifyMany(emails: string[], concurrency = 3): Promise<EmailVerification[]> {
  const out: EmailVerification[] = [];
  for (let i = 0; i < emails.length; i += concurrency) {
    const batch = emails.slice(i, i + concurrency);
    const results = await Promise.all(batch.map(verifyEmail));
    out.push(...results);
  }
  return out;
}

// Confidence score based on verification result
export function confidenceFromVerify(result: VerifyResult): number {
  switch (result) {
    case "deliverable":
      return 95;
    case "accept_all":
      return 70; // MX exists, domain valid, but can't confirm address
    case "unknown":
      return 40; // MX exists but SMTP probe inconclusive
    case "no_mx":
    case "undeliverable":
    case "invalid_syntax":
      return 0;
    default:
      return 0;
  }
}
