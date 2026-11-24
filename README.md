# QuenchMark Technologies — www.quenchmark.org

Company website for QuenchMark Technologies (software, web, mobile, SaaS and AI development) and its real estate CRM product, BrokrSuite.

## Stack
React 19 + Vite 7 · prerendered to static HTML at build time · Vercel (hosting + `/api` serverless functions) · Resend (enquiry emails) · Google Tag Manager / GA4.

## Commands
```bash
npm install
npm run dev      # local dev server; /api/enquiry works with a .env.local (see .env.example)
npm run build    # 1) client build 2) SSR build 3) scripts/prerender.mjs → static pages, sitemap, robots, llms.txt
npm run preview  # serve the production build locally
npm run lint
```

## Where things live
| Path | What |
|---|---|
| `src/site/routes.js` | Every URL: page key, SEO title/description, canonical, breadcrumbs, JSON-LD |
| `src/content/` | Page content: services, BrokrSuite (verified facts only), industries, articles |
| `src/pages/` | Inner pages (services, BrokrSuite, work, industries, insights, about, legal, 404) |
| `src/App.jsx` | App shell: navigation, footer, homepage, in-app routing |
| `src/lib/enquiry.js` | Shared form validation (browser + server) |
| `src/lib/track.js` | Analytics events (no personal data) + lead attribution |
| `api/enquiry.js` | Serverless endpoint → Resend (development enquiries and BrokrSuite leads) |
| `scripts/prerender.mjs` | Static HTML generation, sitemap.xml, robots.txt, llms.txt, 404.html |
| `vercel.json` | Clean URLs, redirects, security and cache headers |
| `docs/` | Audit, SEO, keywords, competitors, analytics, growth and outreach plans, manual setup |

## Adding content
- **New article:** add an entry to `src/content/articles.js` → it gets a page, metadata, JSON-LD and a sitemap entry automatically on the next build.
- **New service page:** add an entry to `src/content/services.js`.

Never commit secrets. Server keys (e.g. `RESEND_API_KEY`) live only in Vercel environment variables.
