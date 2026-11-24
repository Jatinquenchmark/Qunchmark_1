import { metaFor } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero, Section, CtaBand, Rise, ArrowRight } from "./common.jsx";

/* Portfolio = software QuenchMark has designed, built and operates itself.
   These are labelled as in-house products / group ventures, NOT client work.
   Only facts verified from the live products are used; no metrics invented. */
const PROJECTS = [
  {
    id: "brokrsuite",
    name: "BrokrSuite",
    label: "In-house SaaS product · Live",
    category: ["Real Estate Technology", "SaaS Products", "Mobile Applications"],
    summary: "An all-in-one real estate CRM and business management platform for brokers, property dealers, agencies and sales teams.",
    challenge: "Real estate businesses track properties, leads and follow-ups across WhatsApp groups, spreadsheets and notebooks, which makes team coordination and follow-up difficult.",
    built: ["Property inventory and public listings", "Lead and client management", "Follow-up reminders and daily tasks", "Team management with lead and property assignment", "Business analytics dashboard", "iPhone and Android apps on the App Store and Google Play"],
    services: [["mobile-app-development", "Mobile apps"], ["saas-development", "SaaS"], ["crm-development", "CRM development"]],
    shot: "/shots/brokrsuite-site.webp", domain: "brokrsuite.in", href: "/brokrsuite", hrefLabel: "Explore BrokrSuite",
  },
  {
    id: "dmgennie",
    name: "DMGennie",
    label: "In-house SaaS product · Live",
    category: ["SaaS Products", "AI and Automation"],
    summary: "Instagram automation that sends a direct message automatically when someone comments a chosen keyword on a post.",
    challenge: "Creators and businesses lose potential customers when they can't reply to every comment asking for a link or price.",
    built: ["Comment-to-DM automation", "Integration with the official Meta API", "Web application for setting up automations", "Mobile-friendly experience"],
    services: [["business-automation", "Automation & APIs"], ["saas-development", "SaaS"]],
    shot: "/shots/dmgennie-site.webp", domain: "dmgennie.in", href: "https://www.dmgennie.in", hrefLabel: "Visit dmgennie.in",
  },
  {
    id: "quantmentor",
    name: "QuantMentor",
    label: "In-house product · Beta",
    category: ["AI and Automation", "Web Applications"],
    summary: "An AI tool that turns trading strategies written in plain English into Pine Script that traders can backtest.",
    challenge: "Writing trading strategies as code is a barrier for traders who know their rules but not programming.",
    built: ["Plain-English strategy input", "AI-generated Pine Script", "Dashboard and tools", "Responsive web application"],
    services: [["ai-integration", "AI integration"], ["web-development", "Web apps"]],
    shot: "/shots/quantmentor-dashboard.webp", domain: "quantmentor.org", href: "https://www.quantmentor.org", hrefLabel: "Visit quantmentor.org",
  },
  {
    id: "tripsoul",
    name: "TripSoul",
    label: "QuenchMark venture",
    category: ["Websites"],
    summary: "The website for TripSoul, a QuenchMark travel venture offering personalised trips with custom itineraries and concierge support.",
    challenge: "Premium, personalised travel needs a website that inspires trust and makes it easy to start a conversation.",
    built: ["Brand website", "Trip and package presentation", "Enquiry journeys", "Mobile-first design"],
    services: [["web-development", "Website development"], ["ui-ux-design", "UI/UX design"]],
    shot: "/shots/tripsoul-site.webp", domain: "tripsoul.org", href: "https://www.tripsoul.org", hrefLabel: "Visit tripsoul.org",
  },
  {
    id: "parameterx",
    name: "ParameterX",
    label: "QuenchMark venture",
    category: ["Websites"],
    summary: "The website for ParameterX, a QuenchMark cybersecurity venture providing penetration testing, VAPT and AI security services.",
    challenge: "Security buyers need to understand services quickly and trust the provider before they get in touch.",
    built: ["Service-led company website", "Security scanner experience", "Lead generation journeys", "Responsive design"],
    services: [["web-development", "Website development"], ["ui-ux-design", "UI/UX design"]],
    shot: "/shots/parameterx-site.webp", domain: "parameterx.org", href: "https://www.parameterx.org", hrefLabel: "Visit parameterx.org",
  },
];

export function WorkPage() {
  const m = metaFor("work");
  return (
    <main>
      <PageHero
        crumbs={m.crumbs}
        kicker="Our work"
        title={<>Products we&apos;ve <em>designed, built and run.</em></>}
        lead="QuenchMark Technologies builds and operates its own software products and ventures. They're the clearest proof of how we work — and the same team builds software for our clients."
      >
        <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta="Discuss a similar project">Discuss a Similar Project <ArrowRight /></Link>
      </PageHero>

      {PROJECTS.map((p, i) => (
        <section key={p.id} id={p.id} className={`pg-sec ${i % 2 ? "pg-tint" : "pg-white"}`} data-nav="creme">
          <div className="pg-inner wk-case">
            <Rise className="wk-copy">
              <span className="pg-tag">{p.label}</span>
              <h2>{p.name}</h2>
              <p className="wk-summary">{p.summary}</p>
              <h3>The challenge</h3>
              <p>{p.challenge}</p>
              <h3>What we built</h3>
              <ul className="wk-built">{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
              <p className="wk-cats">{p.category.join(" · ")}</p>
              <div className="pg-actions">
                <Link className="pg-btn pg-btn-dark" to={p.href} {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>{p.hrefLabel} <ArrowRight /></Link>
              </div>
              <p className="wk-services">Related services: {p.services.map(([slug, label], j) => (
                <span key={slug}>{j > 0 && ", "}<Link to={`/services/${slug}`}>{label}</Link></span>
              ))}</p>
            </Rise>
            <Rise className="wk-shot">
              <div className="pg-browser">
                <div className="pg-browser-bar"><i /><i /><i /><em>{p.domain}</em></div>
                <img src={p.shot} alt={`${p.name} — screenshot of ${p.domain}`} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
              </div>
            </Rise>
          </div>
        </section>
      ))}

      <Section kicker="More detail" title={<>Explore our <em>products and ventures.</em></>} tone="white">
        <div className="pg-grid">
          <Link className="pg-card is-link" to="/technologies"><h3>Our products</h3><p>BrokrSuite, DMGennie and QuantMentor in depth, with real product screens.</p><span className="pg-link">View products <ArrowRight /></span></Link>
          <Link className="pg-card is-link" to="/ventures"><h3>Our ventures</h3><p>TripSoul and ParameterX — the companies QuenchMark runs.</p><span className="pg-link">View ventures <ArrowRight /></span></Link>
        </div>
      </Section>

      <CtaBand title={<>Have a project <em>like these?</em></>} text="Tell us what you want to build. We'll share how we'd approach it and what it would take." whatsappText="Hi QuenchMark, I'd like to discuss a project similar to your work." />
    </main>
  );
}
