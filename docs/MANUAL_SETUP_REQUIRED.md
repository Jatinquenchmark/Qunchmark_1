# Manual Setup Required

Things that need a human, an account login, a business decision or an approval. Ordered by priority.

## 🔴 Do first

- [ ] **Resend key for Production.** In Vercel → Settings → Environment Variables, `RESEND_API_KEY` must apply to **Production** (it was previously scoped to the `dev` preview branch only). Optional: `RESEND_FROM`, `LEAD_TO_EMAIL` (defaults: `QuenchMark Website <enquiries@quenchmark.org>`, `hiring.quenchmark@gmail.com`). Redeploy after changing.
- [ ] **Verify `quenchmark.org` in Resend** (Resend → Domains). Until verified, emails to hiring.quenchmark@gmail.com and client confirmations won't send. DNS records go in **Hostinger** — a DNS change you need to make/approve.
- [ ] **Send one real test enquiry and one BrokrSuite demo request** on the live site and confirm both emails arrive (subjects: "New QuenchMark Business Enquiry – …" and "New BrokrSuite Business Lead"). Not done automatically, because it sends real email.
- [ ] **Vercel plan review.** The project is on Vercel's **Hobby** plan. Vercel's terms restrict Hobby to non-commercial, personal use; a business website generating sales leads is commercial use and would normally need **Pro** (paid, per member). Review Vercel's current fair-use / plan terms and decide — nothing was purchased or changed.
- [ ] **Google Search Console**: verify the property and submit `https://www.quenchmark.org/sitemap.xml` (steps in `ANALYTICS_SETUP.md`).

## 🟠 This week

- [ ] **GTM tags for the new events** (`generate_lead`, `whatsapp_click`, `email_click`, `phone_click`, `app_store_click`, `cta_click`) → GA4, then mark key events (`ANALYTICS_SETUP.md` §3–4).
- [ ] **GA4 enhanced measurement**: confirm "page changes based on browser history events" is on.
- [ ] **Microsoft Clarity** via the GTM community template (no code change).
- [ ] **Bing Webmaster Tools**: import from Search Console.
- [ ] **Legal review** of `/privacy-policy` and `/terms` — written in plain language to match how the site handles data, but not reviewed by a lawyer. Confirm the registered company name/entity and add a postal address if required for your jurisdiction.
- [ ] **Technology stack confirmation**: the homepage and service pages list technologies "we work with" (React, Next.js, Node.js, React Native, Flutter, Swift, Kotlin, Python, PostgreSQL, AWS, Vercel, Docker, OpenAI/Claude/Gemini …). Remove anything the team doesn't genuinely use (`src/pages/HomeExtras.jsx` → `STACK`, and each service's `tech` list in `src/content/services.js`).
- [ ] **Engagement models & policies**: confirm you offer fixed-scope, dedicated-team and hourly engagements and full code ownership for clients, as described (`src/content/services.js`).

## 🟡 This month

- [ ] **Social profiles**: create/confirm LinkedIn company page (and Instagram, YouTube if used). Then add their URLs to the footer and to `sameAs` in the Organization schema (`src/site/routes.js` → `organizationLd`). None were added because no verified profile URLs were available.
- [ ] **Directory listings** (see `OFF_PAGE_SEO.md`) — create with your approval.
- [ ] **Google Business Profile** — only if eligible (real address or service-area business).
- [ ] **BrokrSuite pricing**: once finalised, decide whether to publish it on the product page (and add an `offers` object to the SoftwareApplication schema then — never before real prices exist).
- [ ] **BrokrSuite features**: if WhatsApp integration, calling, channel-partner tools or portal integrations exist, confirm them and they can be added to `src/content/brokrsuite.js`.
- [ ] **Testimonials, client logos, case studies, certifications, years in business, project counts** — none were published because none could be verified. Provide them (with client permission) to strengthen trust sections.
- [ ] **Founder/team photos and bios** for the About page.
- [ ] **Consent banner** (Google Consent Mode v2 via GTM) before running campaigns aimed at the EU/UK.
- [ ] **Content-Security-Policy** header once the GTM tag list is final (start in report-only mode).

## Optional

- [ ] Upstash Redis (free tier) for shared rate limiting across serverless instances: set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Without it, a per-instance limit applies.
- [ ] Optimise legacy PNG logos to WebP/AVIF.
- [ ] Publish the BrokrSuite blog topics on brokrsuite.in (see `SEO_STRATEGY.md` §1).
