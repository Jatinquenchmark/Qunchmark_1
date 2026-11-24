/* Single source of truth for every URL on the site: which page renders, its
   SEO metadata, breadcrumbs and JSON-LD. Used by the browser app AND by the
   build-time prerenderer (scripts/prerender.mjs), so search engines receive
   complete HTML for every page. */
import { SERVICES, serviceBySlug, SERVICE_ALIASES } from "../content/services.js";
import { ARTICLES, articleBySlug } from "../content/articles.js";
import { BROKRSUITE, BROKR_FAQS } from "../content/brokrsuite.js";

export const SITE = {
  name: "QuenchMark Technologies",
  shortName: "QuenchMark",
  origin: "https://www.quenchmark.org",
  email: "official@quenchmark.org",
  whatsapp: "+918851484102",
  logo: "https://www.quenchmark.org/quenchmark-logo.png",
  ogImage: "https://www.quenchmark.org/quenchmark-logo.png",
  founder: "Prince Saini",
  tagline: "Your technology partner for building, scaling and transforming businesses.",
  description:
    "QuenchMark Technologies is an India-based software development company that designs, builds and maintains websites, mobile apps, custom software, SaaS products and AI solutions for businesses worldwide. Creator of BrokrSuite, the real estate CRM.",
};

export const HOME_FAQS = [
  { q: "What does QuenchMark Technologies do?", a: "QuenchMark Technologies is a software development company. We design, build and maintain websites, web applications, mobile apps, custom business software, SaaS products and AI solutions — and we build our own products, including the real estate CRM BrokrSuite." },
  { q: "Where is QuenchMark based, and do you work with international clients?", a: "We're based in India and work with businesses in India and internationally. We collaborate remotely, agree overlapping working hours and communicate through the tools you already use." },
  { q: "How much does a project cost?", a: "Cost depends on the scope, platforms, integrations and timeline. After a free consultation, we provide a written scope and a transparent estimate before any work starts." },
  { q: "How do we get started?", a: "Send us an enquiry, message us on WhatsApp or email official@quenchmark.org. We'll schedule a free consultation to understand your goals and recommend the right approach." },
  { q: "Will we own the code?", a: "Yes. The source code and intellectual property created for your project belong to you." },
  { q: "Do you provide support after launch?", a: "Yes. We offer maintenance and support covering bug fixes, updates, security, monitoring and ongoing improvements." },
];

const abs = (path) => `${SITE.origin}${path === "/" ? "/" : path}`;

/* ---------- JSON-LD builders ---------- */
const orgRef = { "@id": `${SITE.origin}/#organization` };

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.origin}/#organization`,
  name: SITE.name,
  alternateName: ["QuenchMark", "Quenchmark"],
  url: abs("/"),
  logo: SITE.logo,
  email: SITE.email,
  description: SITE.description,
  founder: { "@type": "Person", name: SITE.founder },
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  contactPoint: [{
    "@type": "ContactPoint",
    contactType: "sales",
    email: SITE.email,
    telephone: SITE.whatsapp,
    availableLanguage: ["English", "Hindi"],
    areaServed: "Worldwide",
  }],
  brand: [{ "@type": "Brand", name: "BrokrSuite", url: BROKRSUITE.site }],
});

const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.origin}/#website`,
  name: SITE.name,
  url: abs("/"),
  publisher: orgRef,
});

const breadcrumbLd = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
});

const faqLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const AREAS = ["India", "United States", "United Kingdom", "United Arab Emirates", "Canada", "Australia", "Singapore", "Germany"];

/* ---------- static routes ---------- */
export const ROUTES = {
  home: {
    path: "/",
    title: "Software & App Development Company | QuenchMark Technologies",
    description: "QuenchMark Technologies designs, builds and maintains websites, mobile apps, custom software, SaaS and AI solutions for startups and businesses worldwide. Get a free quote.",
    ld: () => [organizationLd(), websiteLd(), faqLd(HOME_FAQS)],
  },
  services: {
    path: "/services",
    title: "Software Development Services | QuenchMark Technologies",
    description: "Custom software, websites, web apps, mobile apps, SaaS and MVPs, UI/UX design, AI integration, automation, cloud & DevOps, CRM/ERP and dedicated teams.",
    crumbs: [{ name: "Services", path: "/services" }],
  },
  brokrsuite: {
    path: "/brokrsuite",
    title: "BrokrSuite – Real Estate CRM Software for Brokers | QuenchMark",
    description: "BrokrSuite is the all-in-one real estate CRM for brokers, property dealers and agencies: manage properties, leads, clients, follow-ups and your team on iPhone and Android. Book a free demo.",
    crumbs: [{ name: "BrokrSuite", path: "/brokrsuite" }],
    ld: () => [{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "BrokrSuite",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Real estate CRM",
      operatingSystem: "iOS, Android",
      description: BROKRSUITE.description,
      url: BROKRSUITE.site,
      downloadUrl: [BROKRSUITE.appStore, BROKRSUITE.playStore],
      image: `${SITE.origin}/shots/brokrsuite-site.webp`,
      publisher: orgRef,
    }, faqLd(BROKR_FAQS)],
  },
  work: {
    path: "/work",
    title: "Our Work – Products We Built | QuenchMark Technologies",
    description: "See the SaaS products, mobile apps and websites QuenchMark Technologies has designed and built, including BrokrSuite, DMGennie, QuantMentor, TripSoul and ParameterX.",
    crumbs: [{ name: "Work", path: "/work" }],
  },
  industries: {
    path: "/industries",
    title: "Industries We Serve | QuenchMark Technologies",
    description: "Websites, apps, custom software and AI solutions for real estate, healthcare, education, e-commerce, startups, professional services, logistics, hospitality and enterprises.",
    crumbs: [{ name: "Industries", path: "/industries" }],
  },
  insights: {
    path: "/insights",
    title: "Insights – Software Development Guides for Businesses | QuenchMark",
    description: "Practical guides on software costs, mobile apps, MVPs, CRM, AI and choosing a development partner — written for business owners and decision-makers.",
    crumbs: [{ name: "Insights", path: "/insights" }],
  },
  about: {
    path: "/about",
    title: "About QuenchMark Technologies – Your Technology Partner",
    description: "QuenchMark Technologies is an India-based technology company building software for clients and our own products, including BrokrSuite. Learn about our approach and values.",
    crumbs: [{ name: "About", path: "/about" }],
    ld: () => [organizationLd()],
  },
  "reach-us": {
    path: "/reach-us",
    title: "Request a Free Quote | QuenchMark Technologies",
    description: "Tell us about your project. QuenchMark builds websites, mobile apps, custom software, AI automation, UI/UX design and more. Free consultation and estimate.",
    crumbs: [{ name: "Get a Quote", path: "/reach-us" }],
  },
  contact: {
    path: "/contact",
    title: "Contact QuenchMark Technologies",
    description: "Contact QuenchMark Technologies by email at official@quenchmark.org or on WhatsApp at +91 88514 84102. We respond within 24 hours.",
    crumbs: [{ name: "Contact", path: "/contact" }],
  },
  ventures: {
    path: "/ventures",
    title: "Ventures | QuenchMark",
    description: "Companies run by QuenchMark: TripSoul in travel and ParameterX in cybersecurity.",
    crumbs: [{ name: "Ventures", path: "/ventures" }],
  },
  technologies: {
    path: "/technologies",
    title: "Our Products – BrokrSuite, DMGennie & QuantMentor | QuenchMark",
    description: "Software designed, built and run in-house by QuenchMark: BrokrSuite (real estate CRM), DMGennie (Instagram automation) and QuantMentor (AI trading automation).",
    crumbs: [{ name: "Work", path: "/work" }, { name: "Our Products", path: "/technologies" }],
  },
  "privacy-policy": {
    path: "/privacy-policy",
    title: "Privacy Policy | QuenchMark Technologies",
    description: "How QuenchMark Technologies collects, uses and protects information submitted through this website.",
    crumbs: [{ name: "Privacy Policy", path: "/privacy-policy" }],
  },
  terms: {
    path: "/terms",
    title: "Terms of Use | QuenchMark Technologies",
    description: "Terms governing the use of the QuenchMark Technologies website.",
    crumbs: [{ name: "Terms of Use", path: "/terms" }],
  },
  notfound: {
    path: "/404",
    title: "Page Not Found | QuenchMark Technologies",
    description: "The page you were looking for doesn't exist.",
    noindex: true,
  },
};

/* old URLs → their replacement */
export const LEGACY_PATHS = { "/careers": "/reach-us", "/broksuite": "/brokrsuite" };

/* ---------- resolving paths ---------- */
export function normalizePath(pathname = "/") {
  const p = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return p || "/";
}

/** path → page key ("home", "service:web-development", "notfound", …) */
export function keyFromPath(pathname) {
  let path = normalizePath(pathname);
  if (LEGACY_PATHS[path]) path = LEGACY_PATHS[path];
  const hit = Object.entries(ROUTES).find(([k, r]) => r.path === path && k !== "notfound");
  if (hit) return hit[0];
  let m = path.match(/^\/services\/([a-z0-9-]+)$/);
  if (m) {
    const slug = SERVICE_ALIASES[m[1]] || m[1];
    if (serviceBySlug(slug)) return `service:${slug}`;
  }
  m = path.match(/^\/insights\/([a-z0-9-]+)$/);
  if (m && articleBySlug(m[1])) return `insight:${m[1]}`;
  return "notfound";
}

export function pathFromKey(key) {
  if (key.startsWith("service:")) return `/services/${key.slice(8)}`;
  if (key.startsWith("insight:")) return `/insights/${key.slice(8)}`;
  return (ROUTES[key] || ROUTES.home).path;
}

/** full metadata for a page key */
export function metaFor(key) {
  if (key.startsWith("service:")) {
    const s = serviceBySlug(key.slice(8));
    const path = `/services/${s.slug}`;
    const crumbs = [{ name: "Services", path: "/services" }, { name: s.name, path }];
    return {
      path, title: s.seoTitle, description: s.description, canonical: abs(path), crumbs,
      ld: [
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          serviceType: s.name,
          description: s.description,
          url: abs(path),
          provider: orgRef,
          areaServed: AREAS.map((name) => ({ "@type": "Country", name })),
        },
        breadcrumbLd([{ name: "Home", path: "/" }, ...crumbs]),
        faqLd(s.faqs),
      ],
    };
  }
  if (key.startsWith("insight:")) {
    const a = articleBySlug(key.slice(8));
    const path = `/insights/${a.slug}`;
    const crumbs = [{ name: "Insights", path: "/insights" }, { name: a.title, path }];
    const ld = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        datePublished: a.published,
        dateModified: a.updated,
        author: { "@type": "Organization", name: a.author.name, url: abs(a.author.url) },
        publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: SITE.logo } },
        mainEntityOfPage: abs(path),
        image: SITE.ogImage,
      },
      breadcrumbLd([{ name: "Home", path: "/" }, ...crumbs]),
    ];
    if (a.faqs?.length) ld.push(faqLd(a.faqs));
    return { path, title: a.seoTitle, description: a.description, canonical: abs(path), crumbs, ld, ogType: "article" };
  }
  const r = ROUTES[key] || ROUTES.notfound;
  const ld = r.ld ? r.ld() : [];
  if (r.crumbs) ld.push(breadcrumbLd([{ name: "Home", path: "/" }, ...r.crumbs]));
  return { path: r.path, title: r.title, description: r.description, canonical: abs(r.path), crumbs: r.crumbs, ld, noindex: r.noindex };
}

/** every indexable URL, for the prerenderer and sitemap */
export function allIndexableKeys() {
  const statics = Object.keys(ROUTES).filter((k) => !ROUTES[k].noindex);
  return [
    ...statics,
    ...SERVICES.map((s) => `service:${s.slug}`),
    ...ARTICLES.map((a) => `insight:${a.slug}`),
  ];
}
