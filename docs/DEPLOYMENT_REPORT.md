# Deployment Report — 24 November 2026

## Status
✅ **Live on https://www.quenchmark.org** (Vercel production, branch `main`).
Commits: `92f0133` (site, SEO, funnels, tracking) · `8c1e6cd` (documentation). `dev` was fast-forwarded to the same commit first; Vercel reported the build successful before production was updated.

## What changed
| Area | Result |
|---|---|
| Pages | 29 indexable pages (was 5 client-rendered views): home, services hub + 11 service pages, BrokrSuite, work, industries, insights + 5 articles, about, contact, quote, ventures, products, privacy, terms + real 404 |
| Rendering | Every page prerendered to static HTML with full content (crawlers previously received an empty page) |
| SEO | Unique titles/descriptions, canonical www URLs, Open Graph/Twitter, JSON-LD (Organization, WebSite, Service, BreadcrumbList, Article, FAQPage, SoftwareApplication), sitemap.xml, robots.txt, llms.txt, 25 redirects, clean URLs |
| BrokrSuite | Dedicated product page, verified App Store + Google Play links, demo/pricing form → "New BrokrSuite Business Lead" email, separate lead type |
| Lead generation | Service-specific quote forms, contextual WhatsApp messages, "Request a Free Quote" / "Book a Free Demo" CTAs, lead-source block (page, landing page, referrer, UTM) in every enquiry email |
| Analytics | dataLayer events: generate_lead, whatsapp/email/phone/app-store/CTA clicks, SPA page views — no personal data |
| Performance | 3-second intro gate removed; three.js (~127 KB gz) loads only on the homepage |
| Security | Security headers added; dependency audit: 0 vulnerabilities (production and dev); no secrets in the repository; server-side validation, honeypot, time-trap, rate limiting and escaping unchanged/extended |
| Accessibility | Skip link, one H1 per page, accessible FAQ accordions, labelled form errors, no horizontal scroll at 375 px |

## Verification performed
**Before deploy (local):**
- `npm run lint` — 0 errors; `npm run build` — 29 pages + 404 prerendered.
- API test suite (mocked Resend, 33 checks): development and BrokrSuite emails, exact subjects, reply-to, all fields, lead source, HTML escaping, honeypot, time-trap, rate limit (429), method/origin checks, retry + 502 without false success, failed-lead logging, missing-key 503 — **33/33 passed**.
- Browser (production build): desktop 1280 px and mobile 375 px; all 16 page types checked for horizontal overflow (none); BrokrSuite "Request Pricing" pre-selects the form; service "Request a Quote" scrolls to the pre-filled form; UTM capture → included in the lead (confirmed in server log); `generate_lead` carries no personal data; no console errors.

**After deploy (live):**
- All 29 sitemap URLs return 200 with exactly one H1 and JSON-LD.
- Unknown URLs return **404**; `/brokrsuite/` → `/brokrsuite`, `/careers` → `/reach-us`, `/broksuite` → `/brokrsuite`, `/services/android-app-development` → `/services/mobile-app-development`, `/blog` → `/insights` (308).
- `robots.txt`, `sitemap.xml`, `llms.txt` served as real files.
- Security headers present (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS).
- `/api/enquiry` live and validating; GTM loads; no console errors.

## Not verified / not done
- **Real email delivery** was not tested: it requires `RESEND_API_KEY` for Production and a verified Resend domain, and sending a real test would email the team inbox — awaiting your approval. See `MANUAL_SETUP_REQUIRED.md`.
- The `dev` preview URL is behind Vercel login protection, so it couldn't be checked anonymously before production (build success was confirmed via Vercel's GitHub status).
- No external accounts, listings, social posts or DNS changes were made.
- Pages were not split per Android/iOS/etc.; they are consolidated with redirects by design.

## Rollback
Vercel dashboard → Deployments → previous production deployment (`d1f56c2`) → **Instant Rollback**, or `git revert 92f0133 && git push origin main`.
