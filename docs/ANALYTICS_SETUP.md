# Analytics Setup — GA4, GTM, Search Console, Clarity

All tools below are free. Nothing in the website code needs an analytics ID except the existing GTM container.

## Current state (in code)

| Tool | Status |
|---|---|
| Google Tag Manager | ✅ Installed in `index.html` — container **GTM-5M2QZF2H** (loads on every page). |
| Google Analytics 4 | ✅ Configured **inside GTM** — measurement ID **G-EY636PXWP1** (seen in the published container). Don't add a second GA snippet to the site. |
| Website events | ✅ The site pushes conversion events to `window.dataLayer` (see `CONVERSION_TRACKING.md`). They reach GA4 only after you add GTM triggers/tags for them. |
| Google Search Console | ❌ Manual — needs verification (below). |
| Microsoft Clarity | ❌ Manual — add through GTM (below). |

## 1. Google Search Console (do this first)

1. Go to https://search.google.com/search-console and click **Add property**.
2. Best option, **Domain property** `quenchmark.org`: covers www, non-www, http and https. It needs a TXT record in **Hostinger DNS** — this is a DNS change, so make it yourself (or approve it) in Hostinger → Domains → DNS → add TXT with the value Google shows.
   *Alternative without DNS:* **URL-prefix property** `https://www.quenchmark.org/` verified via your Google Analytics or Google Tag Manager access (choose the GTM method — it's already installed).
3. In Search Console → **Sitemaps**, submit `https://www.quenchmark.org/sitemap.xml`.
4. Use **URL Inspection → Request indexing** for `/`, `/services`, `/brokrsuite` and the top service pages.
5. Repeat for **brokrsuite.in** if not already done.

## 2. Bing Webmaster Tools

https://www.bing.com/webmasters → **Import from Google Search Console** (quickest) → submit the sitemap. Bing also powers several AI assistants' search results.

## 3. GA4 configuration (inside GA4)

1. **Admin → Data streams → Web stream → Enhanced measurement**: keep on; under *Page views → Show advanced settings* make sure **"Page changes based on browser history events"** is ticked (the site changes pages without full reloads).
2. **Admin → Events → Mark as key event** (after the events first appear, ~24 h): `generate_lead`, `whatsapp_click`, `app_store_click`.
3. **Admin → Custom definitions → Create custom dimensions** (event scope): `lead_type`, `service`, `brokrsuite_interest`, `form_location`, `link_location`, `store`, `cta`, `page_type`.
4. **Admin → Data retention**: set event data retention to 14 months.
5. Link GA4 ↔ Search Console (Admin → Product links) to see queries next to landing pages.

## 4. GTM configuration

Create these in GTM (tagmanager.google.com → container GTM-5M2QZF2H), then **Submit/Publish**:

1. **Data Layer Variables**: `lead_type`, `service`, `budget_range`, `contact_method`, `form_location`, `brokrsuite_interest`, `team_size`, `link_location`, `context`, `store`, `product`, `cta`, `page_path`, `page_type`.
2. **Triggers** (type *Custom Event*): `generate_lead`, `whatsapp_click`, `email_click`, `phone_click`, `app_store_click`, `cta_click`.
3. **Tags** (type *Google Analytics: GA4 Event*, measurement ID G-EY636PXWP1): one per trigger, event name = trigger name, adding the relevant variables as event parameters.
4. Use **Preview** mode on www.quenchmark.org to confirm each event fires (click a WhatsApp button, an app store badge, etc.) before publishing.

Don't create a tag for `page_view_spa` unless you turn **off** the history-change page views in step 3.1 — otherwise page views will be double-counted.

## 5. Microsoft Clarity (heatmaps + session recordings)

1. Create a project at https://clarity.microsoft.com for `www.quenchmark.org`.
2. Install via GTM: in GTM **Tags → New → Community Template Gallery → "Microsoft Clarity – Official"**, paste the Clarity project ID, trigger *All Pages*, publish. (No code change needed.)
3. In Clarity **Settings → Masking**, keep **"Strict"** or **"Balanced"** so form inputs are never recorded.

## 6. Privacy notes

- The site never sends names, emails, phone numbers or messages to analytics — events carry only service, page and category values.
- GA4 and Clarity set cookies. The privacy policy explains this. If you start actively marketing to the EU/UK, add a consent banner (Google Consent Mode v2) via GTM — e.g. a free CMP template — before running campaigns there.
