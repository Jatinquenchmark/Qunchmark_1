/* Build step 3 of 3 (see package.json "build"):
   renders every public page to static HTML so search engines, social
   previews and AI crawlers receive full content and correct metadata, then
   writes sitemap.xml, robots.txt, llms.txt and a real 404 page.

   Input:  dist/index.html (client build) + dist-ssr/entry-server.js (SSR build)
   Output: dist/<path>/index.html for each page, dist/404.html, dist/sitemap.xml,
           dist/robots.txt, dist/llms.txt */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssr = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
const { render, metaFor, allIndexableKeys, SITE, SERVICES, ARTICLES } = ssr;

const template = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const today = new Date().toISOString().slice(0, 10);

function setTag(html, re, replacement) {
  if (!re.test(html)) throw new Error(`prerender: template is missing ${re}`);
  return html.replace(re, replacement);
}

function page(key) {
  const meta = metaFor(key);
  const body = render(meta.path === "/404" ? "/404-not-found" : meta.path);
  let html = template;
  html = setTag(html, /<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`);
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, meta.noindex ? "" : `<link rel="canonical" href="${meta.canonical}" />`);
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${meta.ogType || "website"}" />`);
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${meta.canonical}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(meta.title)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(meta.description)}" />`);
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(meta.title)}" />`);
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(meta.description)}" />`);
  const ld = (meta.ld || []).map((o) => `<script type="application/ld+json" data-ld>${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n    ");
  html = html.replace("</head>", `    ${ld}\n  </head>`);
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  return { meta, html };
}

const written = [];
for (const key of allIndexableKeys()) {
  const { meta, html } = page(key);
  // flat files (services/web-development.html) + vercel.json "cleanUrls" → served at /services/web-development
  const file = meta.path === "/" ? join(dist, "index.html") : join(dist, `${meta.path.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(meta);
}
writeFileSync(join(dist, "404.html"), page("notfound").html);

/* ---------- sitemap.xml ---------- */
const articleDates = Object.fromEntries(ARTICLES.map((a) => [`/insights/${a.slug}`, a.updated]));
const priority = (p) => (p === "/" ? "1.0" : p === "/brokrsuite" || p === "/services" || p === "/reach-us" ? "0.9" : p.startsWith("/services/") ? "0.8" : p.startsWith("/insights/") ? "0.6" : p === "/privacy-policy" || p === "/terms" ? "0.2" : "0.7");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.map((m) => `  <url>
    <loc>${m.canonical}</loc>
    <lastmod>${articleDates[m.path] || today}</lastmod>
    <priority>${priority(m.path)}</priority>
  </url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);

/* ---------- robots.txt ---------- */
writeFileSync(join(dist, "robots.txt"), `# ${SITE.name}
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE.origin}/sitemap.xml
`);

/* ---------- llms.txt (plain-language summary for AI assistants; not a ranking factor) ---------- */
writeFileSync(join(dist, "llms.txt"), `# ${SITE.name}

> ${SITE.description}

${SITE.name} (also written QuenchMark) is based in India and works with clients in India and internationally. Contact: ${SITE.email} · WhatsApp +91 88514 84102 · ${SITE.origin}/reach-us

## Services
${SERVICES.map((s) => `- [${s.name}](${SITE.origin}/services/${s.slug}): ${s.description}`).join("\n")}

## Product: BrokrSuite
- [BrokrSuite](${SITE.origin}/brokrsuite): Real estate CRM and business management software for brokers, property dealers, agencies and sales teams — property inventory and public listings, leads and clients, follow-ups and daily tasks, team management and business analytics. Available on iPhone (App Store) and Android (Google Play). Official product site: https://www.brokrsuite.in. Pricing is available on request.

## Company
- [About](${SITE.origin}/about): Who we are, mission, values and process.
- [Our work](${SITE.origin}/work): Products and websites designed, built and operated by QuenchMark (BrokrSuite, DMGennie, QuantMentor, TripSoul, ParameterX).
- [Industries](${SITE.origin}/industries): Real estate, healthcare, education, e-commerce, startups, professional services, logistics, hospitality, enterprises and local businesses.

## Guides
${ARTICLES.map((a) => `- [${a.title}](${SITE.origin}/insights/${a.slug}): ${a.description}`).join("\n")}
`);

rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${written.length} pages + 404, sitemap.xml, robots.txt, llms.txt`);
