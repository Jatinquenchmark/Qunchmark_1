# SEO Strategy — QuenchMark Technologies & BrokrSuite

## 1. Two verticals, two SEO homes

| Vertical | Primary SEO home | Role of quenchmark.org |
|---|---|---|
| **A. Technology development services** | **quenchmark.org** | Rank for commercial "company / services / hire" keywords; convert to quote requests. |
| **B. BrokrSuite** | **brokrsuite.in** (already has product, features, pricing, blog and app pages) | A strong product page (`/brokrsuite`) that converts QuenchMark visitors into demos and links authority to brokrsuite.in. |

**Why:** if both domains publish the same real-estate-CRM content, they compete for the same keywords and split authority (keyword cannibalisation). Keep deep BrokrSuite keyword pages and real-estate blog posts on **brokrsuite.in**; use quenchmark.org/brokrsuite for brand searches ("QuenchMark BrokrSuite"), conversion and as proof of product capability for the services business. The 12 BrokrSuite blog topics in the brief should be published on brokrsuite.in (see `CONTENT_CALENDAR_90_DAYS.md`).

## 2. Site architecture (implemented)

```
/                                   Home — services positioning, BrokrSuite, work, FAQ
/services                           Services hub
/services/<11 consolidated pages>   Commercial landing pages (see KEYWORD_RESEARCH.md)
/brokrsuite                         Product landing page + demo funnel
/work                               Portfolio / case studies (in-house products)
/technologies, /ventures            Existing in-depth product & venture pages
/industries                         10 industries, anchors per industry
/insights, /insights/<slug>         Guides for decision-makers
/about, /contact, /reach-us         Trust + conversion
/privacy-policy, /terms             Legal
```

The brief suggested 22 service URLs. Overlapping topics were consolidated into 11 pages with 1,000–1,200 words each; the other 18 URLs **301-redirect** to the right page (e.g. `/services/android-app-development` → `/services/mobile-app-development`). Splitting them later is easy if a sub-topic proves big enough to deserve its own page.

## 3. Technical SEO (implemented)

- Static prerendered HTML for all 29 public pages + 404 (full content, metadata and JSON-LD in the initial response).
- Unique `<title>` (≤ ~65 chars) and meta description per page; one H1 per page; logical H2/H3 hierarchy.
- Canonical URLs on `https://www.quenchmark.org`; `cleanUrls` + `trailingSlash: false` prevent duplicate URL variants.
- `sitemap.xml` (all canonical, indexable URLs; `lastmod` from article dates), `robots.txt` (allows all, disallows `/api/`, links sitemap).
- Real 404 status for unknown URLs; 25 permanent redirects (legacy, alias and misspelt URLs).
- Structured data (JSON-LD): Organization, WebSite, Service (with areaServed), BreadcrumbList, Article, FAQPage, SoftwareApplication (no fake ratings, reviews or prices).
- Open Graph + Twitter cards per page; breadcrumbs on all inner pages; crawlable `<a href>` internal links.
- `llms.txt` — plain-language company summary for AI assistants (helpful context, **not** a ranking factor).

## 4. Internal linking model

- Home → services hub, featured services, BrokrSuite, work, industries, insights.
- Every service page → related services, related in-house products, quote form; footer links to 7 core services.
- Every article → its service page (sidebar + in-text links) and the quote page; FAQ answers link naturally.
- Industries → relevant service pages; Real Estate → BrokrSuite.
- BrokrSuite page → brokrsuite.in and the official app stores.

## 5. International targeting

- Content is written in neutral international English and states plainly: India-based, working with clients worldwide.
- `Service` schema lists areas served (India, US, UK, UAE, Canada, Australia, Singapore, Germany).
- **No** fake offices, addresses or duplicated city/country pages. Add a country page only when there is something genuinely specific to say (e.g. client work, time-zone arrangements, local payment integrations).
- Optional later: a `/hire-developers-india` page aimed at offshore buyers, once a few international case studies exist.

## 6. AI search (AEO / GEO)

What makes QuenchMark easy for ChatGPT, Gemini, Perplexity and AI Overviews to understand and cite:
- Consistent entity data everywhere: name "QuenchMark Technologies", the same description, email and WhatsApp number on the site, LinkedIn and directories.
- Direct, question-led answers (FAQs on every service page, the homepage and BrokrSuite) marked up with FAQPage schema.
- Original guides that answer buying questions (cost, choosing a partner, MVPs, build vs buy).
- Genuine third-party mentions (directories, LinkedIn, Product Hunt, guest articles) — these matter more than anything on-site.
- Avoid: keyword-stuffed "best company" claims, fake reviews, hidden text or prompt-injection tricks.

## 7. KPI framework (no guarantees — measure and iterate)

| Metric | Source | 30 days | 60 days | 90 days |
|---|---|---|---|---|
| Indexed pages | Search Console → Pages | All 29 submitted, majority indexed | ~all indexed | all + new articles |
| Organic impressions / clicks | Search Console | Establish baseline | Growth on brand + long-tail | Growth on service terms |
| Commercial keyword positions | Search Console → Queries | Baseline per service page | Track movement | Prioritise pages ranking 8–20 for improvements |
| Qualified enquiries (dev) | GA4 `generate_lead` (lead_type=development) + inbox | Baseline | Trend | Lead → proposal rate |
| BrokrSuite demo / pricing requests | GA4 `generate_lead` (lead_type=brokrsuite) | Baseline | Trend | Demo → paid conversion |
| WhatsApp / email clicks | GA4 events | Baseline | Trend | Share of leads by channel |
| App store clicks | GA4 `app_store_click` | Baseline | Trend | Compare with store console installs |
| Lead → customer rate, CAC | CRM / spreadsheet | Start recording every lead's source and outcome | — | First real conversion rates |

Review monthly: pages with impressions but low CTR → rewrite titles/descriptions; pages ranking 8–20 → expand content and add internal links; zero-lead pages → strengthen CTAs.
