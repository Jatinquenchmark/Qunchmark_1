/* POST /api/enquiry — Vercel serverless function behind the Reach Us form.
 *
 * Environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY            required  Resend API key (never exposed to the browser)
 *   RESEND_FROM               optional  verified sender, default "QuenchMark Website <enquiries@quenchmark.org>"
 *   LEAD_TO_EMAIL             optional  where enquiries go, default hiring.quenchmark@gmail.com
 *                                       (comma-separate several addresses)
 *   SEND_CLIENT_CONFIRMATION  optional  "false" turns off the acknowledgement email to the client
 *   UPSTASH_REDIS_REST_URL    optional  shared rate limiting across all serverless instances
 *   UPSTASH_REDIS_REST_TOKEN  optional  (without these, a per-instance in-memory limit is used)
 */
import { validateEnquiry, validateBrokrLead, cleanAttribution, PUBLIC_EMAIL } from "../src/lib/enquiry.js";

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_TO = "hiring.quenchmark@gmail.com";
const DEFAULT_FROM = "QuenchMark Website <enquiries@quenchmark.org>";
const MAX_BODY_BYTES = 20 * 1024;
const RATE_LIMIT = 5; // submissions …
const RATE_WINDOW_S = 10 * 60; // … per IP per 10 minutes
const MIN_FILL_MS = 2500; // humans don't complete the form faster than this

/* ---------------- small helpers ---------------- */
function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body; // Vercel already parsed JSON
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error("too large"), { status: 413 });
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return fwd || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------- rate limiting ---------------- */
const memoryHits = new Map(); // ip -> [timestamps]; per warm instance only

async function isRateLimited(ip) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const key = `qm:enquiry:${ip}`;
      const r = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([["INCR", key], ["EXPIRE", key, String(RATE_WINDOW_S), "NX"]]),
      });
      if (r.ok) {
        const [incr] = await r.json(); // [{ result: count }, { result: 0|1 }]
        return Number(incr?.result) > RATE_LIMIT;
      }
    } catch (e) {
      console.warn("[enquiry] Upstash rate limit unavailable, using memory:", e.message);
    }
  }
  const now = Date.now();
  const recent = (memoryHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_S * 1000);
  recent.push(now);
  memoryHits.set(ip, recent);
  if (memoryHits.size > 5000) memoryHits.clear(); // keep memory bounded
  return recent.length > RATE_LIMIT;
}

/* ---------------- Resend ---------------- */
async function resendSend(apiKey, payload, idempotencyKey) {
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const r = await fetch(RESEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey, // a retry can never produce a duplicate email
        },
        body: JSON.stringify(payload),
      });
      const json = await r.json().catch(() => ({}));
      if (r.ok && json.id) return json;
      lastErr = new Error(`Resend ${r.status}: ${json.message || json.name || "unknown error"}`);
      if (r.status < 500 && r.status !== 429) break; // config errors won't fix themselves
    } catch (e) {
      lastErr = e;
    }
    if (attempt === 1) await new Promise((ok) => setTimeout(ok, 600));
  }
  throw lastErr;
}

/* ---------------- email templates ---------------- */
function row(label, value, { link } = {}) {
  const v = value ? (link ? `<a href="${esc(link)}" style="color:#4f46e5;text-decoration:none">${esc(value)}</a>` : esc(value)) : '<span style="color:#9aa1ad">—</span>';
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #eceef2;width:180px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f6672;font-weight:700;vertical-align:top">${esc(label)}</td>
    <td style="padding:12px 0;border-bottom:1px solid #eceef2;font-size:15px;color:#0f1115">${v}</td>
  </tr>`;
}

function shell(inner, preheader) {
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:22px;overflow:hidden;border:1px solid #e6e8ec">
${inner}
<tr><td style="padding:20px 32px;background:#0f1115;color:#9aa1ad;font-size:12px">QuenchMark · <a href="https://www.quenchmark.org" style="color:#a5b4fc;text-decoration:none">quenchmark.org</a> · ${PUBLIC_EMAIL}</td></tr>
</table></td></tr></table></body></html>`;
}

/* where the lead came from — page, first landing page, referrer, UTM campaign */
function sourceRows(a = {}) {
  const utm = [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  return `<tr><td style="padding:8px 32px 4px"><div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f6672;font-weight:700;margin:6px 0 4px">Lead source</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Submitted from", a.pageUrl)}
    ${row("First landing page", a.landingPage)}
    ${row("Referrer", a.referrer || "Direct / unknown")}
    ${row("Campaign (UTM)", utm || "None")}
    ${a.utm_term || a.utm_content ? row("UTM term / content", [a.utm_term, a.utm_content].filter(Boolean).join(" / ")) : ""}
  </table></td></tr>`;
}
const sourceText = (a = {}) => [
  "",
  "Lead source:",
  `Submitted from: ${a.pageUrl || "—"}`,
  `First landing page: ${a.landingPage || "—"}`,
  `Referrer: ${a.referrer || "Direct / unknown"}`,
  `Campaign (UTM): ${[a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ") || "None"}`,
].join("\n");

function teamEmail(d, meta, a) {
  const waDigits = d.phone.replace(/\D/g, "");
  const inner = `
<tr><td style="padding:32px;background:linear-gradient(135deg,#151a26,#0f1219);color:#eef0f4">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a5b4fc;font-weight:700">New business enquiry</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;margin-top:8px;line-height:1.2">${esc(d.service)}</div>
  <div style="margin-top:8px;font-size:14px;color:#9aa1ad">from ${esc(d.name)}${d.company ? ` · ${esc(d.company)}` : ""}</div>
</td></tr>
<tr><td style="padding:24px 32px 8px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Full name", d.name)}
    ${row("Company", d.company)}
    ${row("Email", d.email, { link: `mailto:${d.email}` })}
    ${row("Phone / WhatsApp", d.phone, { link: `tel:${d.phone.replace(/[^\d+]/g, "")}` })}
    ${row("Service required", d.service)}
    ${row("Estimated budget", d.budget || "Not specified")}
    ${row("Preferred contact", d.contactMethod)}
    ${row("Submitted", meta.time)}
  </table>
</td></tr>
<tr><td style="padding:16px 32px 8px">
  <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f6672;font-weight:700;margin-bottom:10px">Project description</div>
  <div style="background:#f6f7f9;border:1px solid #eceef2;border-radius:14px;padding:18px;font-size:15px;line-height:1.65;color:#0f1115;white-space:pre-wrap">${esc(d.description)}</div>
</td></tr>
${sourceRows(a)}
<tr><td style="padding:20px 32px 30px">
  <a href="mailto:${esc(d.email)}?subject=${encodeURIComponent(`Re: Your QuenchMark enquiry – ${d.service}`)}" style="display:inline-block;background:#0f1115;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px">Reply by email</a>
  <a href="https://wa.me/${waDigits}" style="display:inline-block;margin-left:8px;background:#eef0ff;color:#4f46e5;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px">Open WhatsApp</a>
  <div style="margin-top:14px;font-size:12px;color:#9aa1ad">Reference ${esc(meta.ref)} · Hitting “Reply” answers the client directly.</div>
</td></tr>`;
  return shell(inner, `${d.name} needs ${d.service}`);
}

function teamText(d, meta, a) {
  return [
    `New QuenchMark business enquiry — ${d.service}`,
    "",
    `Full name: ${d.name}`,
    `Company: ${d.company || "—"}`,
    `Email: ${d.email}`,
    `Phone / WhatsApp: ${d.phone}`,
    `Service required: ${d.service}`,
    `Estimated budget: ${d.budget || "Not specified"}`,
    `Preferred contact: ${d.contactMethod}`,
    `Submitted: ${meta.time}`,
    "",
    "Project description:",
    d.description,
    "",
    `Reference: ${meta.ref}`,
  ].join("\n") + sourceText(a);
}

/* ---------- BrokrSuite lead ---------- */
function brokrTeamEmail(d, meta, a) {
  const waDigits = d.phone.replace(/\D/g, "");
  const inner = `
<tr><td style="padding:32px;background:linear-gradient(135deg,#1d1a4a,#0f1219);color:#eef0f4">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#a5b4fc;font-weight:700">New BrokrSuite business lead</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;margin-top:8px;line-height:1.2">${esc(d.interest)}</div>
  <div style="margin-top:8px;font-size:14px;color:#9aa1ad">from ${esc(d.name)}${d.company ? ` · ${esc(d.company)}` : ""}${d.city ? ` · ${esc(d.city)}` : ""}</div>
</td></tr>
<tr><td style="padding:24px 32px 8px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Full name", d.name)}
    ${row("Company", d.company)}
    ${row("Email", d.email, { link: `mailto:${d.email}` })}
    ${row("Phone / WhatsApp", d.phone, { link: `tel:${d.phone.replace(/[^\d+]/g, "")}` })}
    ${row("City", d.city)}
    ${row("Team size", d.teamSize || "Not specified")}
    ${row("Current CRM / software", d.currentSoftware || "Not specified")}
    ${row("Interested in", d.interest)}
    ${row("Submitted", meta.time)}
  </table>
</td></tr>
<tr><td style="padding:16px 32px 8px">
  <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f6672;font-weight:700;margin-bottom:10px">Business requirements</div>
  <div style="background:#f6f7f9;border:1px solid #eceef2;border-radius:14px;padding:18px;font-size:15px;line-height:1.65;color:#0f1115;white-space:pre-wrap">${esc(d.requirements || "—")}</div>
</td></tr>
${sourceRows(a)}
<tr><td style="padding:20px 32px 30px">
  <a href="https://wa.me/${waDigits}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px">Open WhatsApp</a>
  <a href="mailto:${esc(d.email)}?subject=${encodeURIComponent("Your BrokrSuite demo")}" style="display:inline-block;margin-left:8px;background:#0f1115;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px">Reply by email</a>
  <div style="margin-top:14px;font-size:12px;color:#9aa1ad">Reference ${esc(meta.ref)} · Hitting “Reply” answers the lead directly.</div>
</td></tr>`;
  return shell(inner, `${d.name} — ${d.interest} (BrokrSuite)`);
}

const brokrTeamText = (d, meta, a) => [
  `New BrokrSuite business lead — ${d.interest}`,
  "",
  `Full name: ${d.name}`,
  `Company: ${d.company || "—"}`,
  `Email: ${d.email}`,
  `Phone / WhatsApp: ${d.phone}`,
  `City: ${d.city || "—"}`,
  `Team size: ${d.teamSize || "Not specified"}`,
  `Current CRM / software: ${d.currentSoftware || "Not specified"}`,
  `Interested in: ${d.interest}`,
  `Submitted: ${meta.time}`,
  "",
  "Business requirements:",
  d.requirements || "—",
  "",
  `Reference: ${meta.ref}`,
].join("\n") + sourceText(a);

function brokrClientEmail(d) {
  const first = d.name.split(" ")[0];
  const inner = `
<tr><td style="padding:36px 32px 12px">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#4f46e5;font-weight:700">BrokrSuite · Request received</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;margin-top:10px;color:#0f1115;line-height:1.2">Thank you, ${esc(first)}.</div>
  <p style="font-size:15px;line-height:1.7;color:#5f6672;margin:14px 0 0">We've received your request (<strong style="color:#0f1115">${esc(d.interest.toLowerCase())}</strong>). Our team will contact you shortly to understand your business and show you how BrokrSuite can help.</p>
  <p style="font-size:15px;line-height:1.7;color:#5f6672;margin:14px 0 0">In the meantime, you can download the BrokrSuite app from the <a href="https://apps.apple.com/in/app/brokrsuite/id6807412019" style="color:#4f46e5">App Store</a> or <a href="https://play.google.com/store/apps/details?id=com.brokrsuite.app" style="color:#4f46e5">Google Play</a>.</p>
</td></tr>
<tr><td style="padding:12px 32px 32px;font-size:14px;line-height:1.7;color:#5f6672">
  Questions? Reply to this email or write to <a href="mailto:${PUBLIC_EMAIL}" style="color:#4f46e5;text-decoration:none">${PUBLIC_EMAIL}</a>.
  <div style="margin-top:18px;color:#0f1115;font-weight:600">— The BrokrSuite team at QuenchMark</div>
</td></tr>`;
  return shell(inner, "We've received your BrokrSuite request and will be in touch shortly.");
}

function clientEmail(d) {
  const first = d.name.split(" ")[0];
  const inner = `
<tr><td style="padding:36px 32px 12px">
  <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#4f46e5;font-weight:700">Enquiry received</div>
  <div style="font-family:Georgia,serif;font-size:28px;font-weight:600;margin-top:10px;color:#0f1115;line-height:1.2">Thank you, ${esc(first)}.</div>
  <p style="font-size:15px;line-height:1.7;color:#5f6672;margin:14px 0 0">We've received your enquiry about <strong style="color:#0f1115">${esc(d.service)}</strong>. Our team will review your requirements and get in touch by ${esc(d.contactMethod.toLowerCase())}, usually within 24 hours.</p>
</td></tr>
<tr><td style="padding:12px 32px">
  <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5f6672;font-weight:700;margin-bottom:10px">What you told us</div>
  <div style="background:#f6f7f9;border:1px solid #eceef2;border-radius:14px;padding:18px;font-size:14px;line-height:1.65;color:#0f1115;white-space:pre-wrap">${esc(d.description)}</div>
</td></tr>
<tr><td style="padding:12px 32px 32px;font-size:14px;line-height:1.7;color:#5f6672">
  Have something to add? Simply reply to this email or write to <a href="mailto:${PUBLIC_EMAIL}" style="color:#4f46e5;text-decoration:none">${PUBLIC_EMAIL}</a>.
  <div style="margin-top:18px;color:#0f1115;font-weight:600">— The QuenchMark team</div>
</td></tr>`;
  return shell(inner, "We've received your enquiry and will be in touch shortly.");
}

/* ---------------- handler ---------------- */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { ok: false, error: "Method not allowed." });
  }

  // only accept posts from our own pages (browsers always send Origin on POST)
  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) return send(res, 403, { ok: false, error: "Forbidden." });
    } catch {
      return send(res, 403, { ok: false, error: "Forbidden." });
    }
  }

  let body;
  try {
    body = await readBody(req);
  } catch (e) {
    return send(res, e.status || 400, { ok: false, error: "Invalid request." });
  }

  // spam traps: hidden honeypot field filled in, or the form was "completed" instantly.
  // Bots get a normal-looking success so they don't learn to adapt.
  if (body.website || (typeof body.elapsedMs === "number" && body.elapsedMs < MIN_FILL_MS)) {
    console.info("[enquiry] spam trap triggered", { ip: clientIp(req) });
    return send(res, 200, { ok: true });
  }

  if (await isRateLimited(clientIp(req))) {
    return send(res, 429, {
      ok: false,
      error: `Too many enquiries from your connection. Please wait a few minutes, or email us at ${PUBLIC_EMAIL}.`,
    });
  }

  const isBrokr = body.formType === "brokrsuite";
  const { data, errors } = isBrokr ? validateBrokrLead(body) : validateEnquiry(body);
  const attr = cleanAttribution(body.attribution);
  if (Object.keys(errors).length) {
    return send(res, 422, { ok: false, error: "Please correct the highlighted fields.", fields: errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || DEFAULT_FROM;
  const to = (process.env.LEAD_TO_EMAIL || DEFAULT_TO).split(",").map((s) => s.trim()).filter(Boolean);
  const now = new Date();
  const meta = {
    ref: `QM-${now.getTime().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    time: `${now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })} IST (${now.toISOString()})`,
  };

  if (!apiKey) {
    // never lose a lead silently: the full enquiry is written to the function logs
    console.error("[enquiry] RESEND_API_KEY is not set — ENQUIRY_NOT_DELIVERED", JSON.stringify({ formType: isBrokr ? "brokrsuite" : "development", ...data, ...meta, ...attr }));
    return send(res, 503, {
      ok: false,
      error: `Our enquiry service is temporarily unavailable. Please email us directly at ${PUBLIC_EMAIL}.`,
    });
  }

  try {
    await resendSend(
      apiKey,
      {
        from,
        to,
        reply_to: data.email,
        ...(isBrokr
          ? { subject: "New BrokrSuite Business Lead", html: brokrTeamEmail(data, meta, attr), text: brokrTeamText(data, meta, attr), tags: [{ name: "lead_type", value: "brokrsuite" }] }
          : { subject: `New QuenchMark Business Enquiry – ${data.service}`, html: teamEmail(data, meta, attr), text: teamText(data, meta, attr), tags: [{ name: "lead_type", value: "development" }] }),
      },
      `${meta.ref}-team`
    );
  } catch (e) {
    console.error("[enquiry] team email failed — ENQUIRY_NOT_DELIVERED", e.message, JSON.stringify({ formType: isBrokr ? "brokrsuite" : "development", ...data, ...meta, ...attr }));
    return send(res, 502, {
      ok: false,
      error: `We couldn't send your enquiry just now. Please try again in a moment, or email us at ${PUBLIC_EMAIL}.`,
    });
  }

  // the acknowledgement is a courtesy: if it fails, the lead is already safe with the team
  let confirmation = false;
  if (process.env.SEND_CLIENT_CONFIRMATION !== "false") {
    try {
      await resendSend(
        apiKey,
        {
          from,
          to: [data.email],
          reply_to: PUBLIC_EMAIL,
          ...(isBrokr
            ? {
                subject: "We've received your BrokrSuite request",
                html: brokrClientEmail(data),
                text: `Hi ${data.name.split(" ")[0]},\n\nThank you for your interest in BrokrSuite. We've received your request (${data.interest.toLowerCase()}) and our team will contact you shortly.\n\nQuestions? Reply to this email or write to ${PUBLIC_EMAIL}.\n\n— The BrokrSuite team at QuenchMark`,
              }
            : {
                subject: "We've received your enquiry – QuenchMark",
                html: clientEmail(data),
                text: `Hi ${data.name.split(" ")[0]},\n\nThank you for contacting QuenchMark. We've received your enquiry about ${data.service} and will get in touch by ${data.contactMethod.toLowerCase()}, usually within 24 hours.\n\nHave something to add? Reply to this email or write to ${PUBLIC_EMAIL}.\n\n— The QuenchMark team`,
              }),
        },
        `${meta.ref}-client`
      );
      confirmation = true;
    } catch (e) {
      console.warn("[enquiry] client confirmation failed (team email was sent):", e.message);
    }
  }

  return send(res, 200, { ok: true, ref: meta.ref, confirmation });
}
