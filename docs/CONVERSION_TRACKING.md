# Conversion Tracking

Implementation: `src/lib/track.js` (events + attribution), forms in `src/ReachUs.jsx` (`EnquiryForm`), `src/pages/BrokrForm.jsx` and the Contact page in `src/App.jsx`.

## Events pushed to the GTM dataLayer

| Event | When | Parameters (never personal data) |
|---|---|---|
| `generate_lead` | A form submission is **confirmed by the server** (not on click) | `lead_type` = `development` or `brokrsuite`; development: `service`, `budget_range`, `contact_method`, `form_location`; BrokrSuite: `brokrsuite_interest` = `demo` / `pricing` / `question`, `team_size`, `form_location` |
| `whatsapp_click` | Any WhatsApp link | `link_location` (page path), `context` (which button, e.g. `service:web-development`, `brokrsuite-hero`) |
| `email_click` | Any `mailto:` link | `link_location` |
| `phone_click` | Any `tel:` link | `link_location` |
| `app_store_click` | App Store / Google Play badge | `store` = `app_store` / `google_play`, `product` = `brokrsuite`, `link_location` |
| `cta_click` | Buttons/links marked `data-cta` (Request a Free Quote, Book a Free Demo, Request Pricing, service cards …) | `cta`, `link_location` |
| `page_view_spa` | Every in-app page change | `page_path`, `page_type` (`home`, `service`, `insight`, `brokrsuite` …) |

### Mapping the brief's conversions to events

| Conversion in the brief | How to report it in GA4 |
|---|---|
| Successful form submissions | `generate_lead` |
| Software / website / app / AI enquiries | `generate_lead` where `lead_type = development`, broken down by `service` |
| Consultation requests | `generate_lead` (all quote forms offer a free consultation) + `cta_click` where `cta` contains "Consultation" |
| BrokrSuite demo requests | `generate_lead` where `brokrsuite_interest = demo` |
| BrokrSuite pricing requests | `generate_lead` where `brokrsuite_interest = pricing` |
| WhatsApp / phone / email clicks | `whatsapp_click`, `phone_click`, `email_click` |
| App Store / Google Play clicks | `app_store_click` by `store` |
| CTA interactions | `cta_click` by `cta` |

**Separate BrokrSuite from services:** use `lead_type` in GA4 explorations, or create two key events in GTM (e.g. a `brokrsuite_lead` GA4 event fired by a trigger on `generate_lead` with condition `lead_type equals brokrsuite`).

## Lead-source attribution in emails

On the first visit, the browser stores (in `localStorage` key `qm-attribution`): UTM source/medium/campaign/term/content, referring domain and landing page. A new UTM-tagged visit refreshes it. Every enquiry email then includes a **Lead source** block:
- Submitted from (page path)
- First landing page
- Referrer (or "Direct / unknown")
- Campaign (UTM source / medium / campaign)

Server-side, these values are length-capped and HTML-escaped (`cleanAttribution` in `src/lib/enquiry.js`).

### UTM conventions (use consistently)
- `utm_source`: `linkedin`, `instagram`, `facebook`, `youtube`, `whatsapp`, `email`, `google`, `clutch`, `producthunt`
- `utm_medium`: `social`, `paid-social`, `cpc`, `email`, `referral`, `outreach`
- `utm_campaign`: short kebab-case, e.g. `brokr-demo-dec26`, `web-dev-launch`

Example: `https://www.quenchmark.org/brokrsuite?utm_source=linkedin&utm_medium=social&utm_campaign=brokr-demo-dec26`

## Testing checklist
1. GTM **Preview** → open the site → click a WhatsApp button, an app store badge and "Request a Free Quote" → confirm `whatsapp_click`, `app_store_click`, `cta_click`.
2. Submit a form (with approval — it sends a real email) → confirm `generate_lead` with the right `lead_type`.
3. GA4 **Realtime** → check events arrive with their parameters.
