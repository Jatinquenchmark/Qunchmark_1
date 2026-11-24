# Website Audit — www.quenchmark.org

Audit date: 24 November 2026 · Stack: React 19 + Vite 7, hosted on Vercel, enquiries via Resend, analytics via Google Tag Manager (GTM-5M2QZF2H → GA4 G-EY636PXWP1).

## 1. Critical findings (before this release)

| # | Finding | Impact | Status |
|---|---|---|---|
| 1 | The site was a client-side-only single-page app: the HTML served to crawlers contained an empty `<div id="root">` and **0 words of content**. | Search engines, social previews and AI crawlers saw almost nothing; rankings depended entirely on Google executing JavaScript. | ✅ Fixed — every page is prerendered to full HTML at build time (`scripts/prerender.mjs`). |
| 2 | `robots.txt` and `sitemap.xml` returned the homepage HTML (200, `text/html`). | No crawl directives, no sitemap. | ✅ Fixed — real files generated on every build. |
| 3 | **Every URL returned HTTP 200**, including non-existent pages (soft 404s). | Wasted crawl budget, duplicate content, poor quality signals. | ✅ Fixed — catch-all rewrite removed; unknown URLs serve `404.html` with a 404 status. |
| 4 | Canonical and Open Graph URLs pointed to `https://quenchmark.org/`, which 308-redirects to `https://www.quenchmark.org/`. | Mixed canonical signals. | ✅ Fixed — all canonicals use `https://www.quenchmark.org`. |
| 5 | Full-screen typewriter intro hid all content for ~3 seconds on every visit. | Delayed Largest Contentful Paint and first interaction; visitors arriving from ads/search waited before seeing anything. | ✅ Removed — content is visible immediately; hero entrance animations kept. |
| 6 | three.js (≈127 KB gzipped) loaded on every page. | Slower load on pages that don't use 3D. | ✅ Fixed — lazy-loaded only on the homepage, tree-shaken to the classes used. |
| 7 | Only HSTS was set as a security header. | Missing basic browser protections. | ✅ Added `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. |

## 2. Content and positioning findings

- The homepage positioned QuenchMark as a "venture group" ("Powerful businesses, built under one vision") — it did **not** say that QuenchMark builds software for clients. → Rewritten as a technology partner / software development company, with services, process, industries, FAQ and clear CTAs.
- No service pages existed — nothing could rank for "website development company", "mobile app development company", etc. → 11 substantial, consolidated service pages created.
- BrokrSuite was a card inside "Technologies"; no product landing page, demo funnel or store links. → Dedicated `/brokrsuite` page with demo/pricing form, verified App Store and Google Play links, FAQ and structured data.
- No blog/insights, about page, industries page, portfolio/case studies, privacy policy or terms. → All created.
- Navigation used `<button>` elements, so internal links were invisible to crawlers. → All navigation, footer and in-content links are real `<a href>` links.
- Product name inconsistency: the brief said "BrokSuite"; the product, its domain (brokrsuite.in) and store listings use **BrokrSuite**. → The site uses BrokrSuite; `/broksuite` redirects to `/brokrsuite`.

## 3. Conversion findings

- Primary CTA was "Reach Us"; there was no "Request a Quote" or "Book a Demo" language. → Primary CTAs: **Request a Free Quote** / **Discuss Your Project** (services) and **Book a Free Demo** (BrokrSuite).
- WhatsApp existed but used one generic message. → Contextual pre-filled messages per service and for BrokrSuite.
- Forms did not record where leads came from. → Enquiry emails now include submitting page, first landing page, referrer and UTM campaign.
- No conversion events were sent to analytics. → `generate_lead`, `whatsapp_click`, `email_click`, `phone_click`, `app_store_click`, `cta_click` pushed to the GTM dataLayer (no personal data).

## 4. Accessibility and UX

- Added a skip-to-content link, `aria-current` on navigation, accessible FAQ accordions (native `<details>`), labelled form fields with linked error messages, single H1 per page and a logical heading order.
- All 16 page types tested at 375 px width: no horizontal scrolling.
- Reveal animations no longer hide content when JavaScript is unavailable; `prefers-reduced-motion` respected on new components.

## 5. Remaining opportunities (not done in this release)

- **Images:** convert the large PNG logos to WebP/AVIF and add explicit `width`/`height` to every legacy image.
- **JavaScript size:** the main bundle (~124 KB gzipped) contains every page's content; route-level code splitting would reduce it further, but needs streaming SSR support to stay compatible with prerendering.
- **Content-Security-Policy:** not added yet because GTM injects third-party scripts; add a report-only CSP once the final tag list in GTM is settled.
- **Real case studies:** client projects (with permission) would be stronger proof than in-house products alone.
- **Testimonials, client logos, certifications:** none were available to verify, so none were published.
