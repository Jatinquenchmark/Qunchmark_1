/* Analytics + lead attribution.
   - Events go to window.dataLayer (Google Tag Manager → GA4). Configure tags
     and conversions in GTM; see docs/CONVERSION_TRACKING.md.
   - NEVER send personal data (names, emails, phone numbers, messages) here.
   - First-touch attribution (UTM params, referrer, landing page) is kept in
     the visitor's own browser and attached to enquiries so the team can see
     where each lead came from. */

const KEY = "qm-attribution";
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

const readStore = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};

/* call once on load: store first-touch data; refresh it when a new campaign arrives */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const qs = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(UTM.filter((k) => qs.get(k)).map((k) => [k, qs.get(k).slice(0, 100)]));
  const existing = readStore();
  if (existing && !Object.keys(utm).length) return;
  let referrer = "";
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.host !== window.location.host) referrer = r.host;
  } catch { /* ignore */ }
  const data = { ...utm, referrer, landingPage: window.location.pathname, firstSeen: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage blocked */ }
}

/* attribution sent with an enquiry (current page + first touch) */
export function attribution() {
  const stored = (typeof window !== "undefined" && readStore()) || {};
  return {
    pageUrl: typeof window !== "undefined" ? window.location.pathname : "",
    landingPage: stored.landingPage || "",
    referrer: stored.referrer || "",
    ...Object.fromEntries(UTM.map((k) => [k, stored[k] || ""])),
  };
}

/* one delegated listener: WhatsApp, email, phone, app store and CTA clicks */
let clickTrackingInstalled = false;
export function installClickTracking() {
  if (typeof document === "undefined" || clickTrackingInstalled) return;
  clickTrackingInstalled = true;
  document.addEventListener("click", (e) => {
    const el = e.target.closest?.("a, button");
    if (!el) return;
    const href = el.getAttribute("href") || "";
    const where = window.location.pathname;
    const ctx = el.dataset.track || "";
    if (href.includes("wa.me/")) track("whatsapp_click", { link_location: where, context: ctx });
    else if (href.startsWith("mailto:")) track("email_click", { link_location: where });
    else if (href.startsWith("tel:")) track("phone_click", { link_location: where });
    else if (href.includes("play.google.com")) track("app_store_click", { store: "google_play", product: "brokrsuite", link_location: where });
    else if (href.includes("apps.apple.com")) track("app_store_click", { store: "app_store", product: "brokrsuite", link_location: where });
    if (el.dataset.cta) track("cta_click", { cta: el.dataset.cta, link_location: where });
  }, { capture: true });
}
