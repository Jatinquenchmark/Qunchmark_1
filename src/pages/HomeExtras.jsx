import { SERVICES } from "../content/services.js";
import { INDUSTRIES } from "../content/industries.js";
import { BROKRSUITE, BROKR_FEATURES } from "../content/brokrsuite.js";
import { HOME_FAQS } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { Section, Faq, WhatsAppCta, Rise, ArrowRight, Check } from "./common.jsx";
import { ServiceCards, ProcessSteps } from "./Services.jsx";
import { StoreBadges } from "./BrokrSuite.jsx";
import "./home-extras.css";

const FEATURED = ["web-development", "mobile-app-development", "software-development", "saas-development", "ai-integration", "ui-ux-design", "cloud-devops", "dedicated-development-team"];

export function ServicesOverview() {
  const items = FEATURED.map((slug) => SERVICES.find((s) => s.slug === slug));
  return (
    <Section id="services" kicker="01 — What we do" title={<>End-to-end technology services, <em>one accountable team.</em></>} lead="Strategy, design, development, launch and support — so your website, app, backend and integrations are built to work together.">
      <ServiceCards items={items} />
      <div className="hm-more">
        <Link className="pg-btn pg-btn-ghost" to="/services">View all services <ArrowRight /></Link>
      </div>
    </Section>
  );
}

export function BrokrHome() {
  const highlights = BROKR_FEATURES.filter((f) => ["clients", "team", "properties", "listings"].includes(f.id));
  return (
    <section className="pg-sec hm-brokr" id="brokrsuite" data-nav="dark">
      <div className="pg-inner hm-brokr-grid">
        <Rise className="hm-brokr-copy">
          <span className="hs-kicker">02 — Our product · BrokrSuite</span>
          <h2>Your entire real estate business. <em>One powerful platform.</em></h2>
          <p>BrokrSuite is our real estate CRM and business management platform. Brokers, property dealers and agencies use it to manage their team, clients, follow-ups and property inventory — and publish listings — from one app on iPhone and Android.</p>
          <ul className="hm-brokr-list">
            {highlights.map((f) => <li key={f.id}><Check /> <span><b>{f.title}</b> — {f.points[0].toLowerCase()}</span></li>)}
          </ul>
          <div className="pg-actions">
            <Link className="pg-btn pg-btn-light" to="/brokrsuite#demo" data-cta="Book a BrokrSuite Demo">Book a Free Demo <ArrowRight /></Link>
            <Link className="pg-btn pg-btn-outline-light" to="/brokrsuite">Explore BrokrSuite</Link>
          </div>
          <StoreBadges />
        </Rise>
        <Rise className="hm-brokr-visual">
          <div className="pg-phones">
            <div className="pg-phone"><img src="/shots/brokrsuite-app-explore.webp" alt="BrokrSuite app — property listings" loading="lazy" decoding="async" width="390" height="844" /></div>
            <div className="pg-phone"><img src="/shots/brokrsuite-app-property-detail.webp" alt="BrokrSuite app — property details" loading="lazy" decoding="async" width="390" height="844" /></div>
          </div>
          <p className="hm-brokr-tag">Manage smarter. Sell better. Grow faster. <a href={BROKRSUITE.site} target="_blank" rel="noopener">brokrsuite.in</a></p>
        </Rise>
      </div>
    </section>
  );
}

export function HomeProcess() {
  return <ProcessSteps />;
}

export function IndustriesStrip() {
  return (
    <Section kicker="04 — Industries" title={<>Solutions for <em>your industry.</em></>} lead="From real estate — where we run our own product — to healthcare, education, retail, logistics and more." tone="tint">
      <ul className="hm-industries">
        {INDUSTRIES.map((i) => (
          <li key={i.id}><Link to={`/industries#${i.id}`}>{i.name} <ArrowRight /></Link></li>
        ))}
      </ul>
    </Section>
  );
}

const WHY = [
  { title: "We build our own products", desc: "We design, launch and run SaaS products like BrokrSuite — so we understand what it takes to ship software and support real users." },
  { title: "One team, end to end", desc: "Design, web, mobile, backend, AI and cloud under one roof, so nothing gets lost between vendors." },
  { title: "Transparent from day one", desc: "A written scope and estimate before work starts, regular demos during it and honest advice throughout." },
  { title: "Built to scale", desc: "Modern, maintainable technology chosen for your long-term needs, not trends." },
  { title: "You own everything", desc: "The source code, designs and data we create for you belong to you." },
  { title: "Support after launch", desc: "Maintenance, monitoring and improvements, so your software keeps getting better." },
];

const STACK = {
  "Web": ["React", "Next.js", "TypeScript", "Node.js"],
  "Mobile": ["React Native", "Flutter", "Swift", "Kotlin"],
  "AI": ["OpenAI", "Anthropic Claude", "Google Gemini", "RAG"],
  "Data & cloud": ["PostgreSQL", "AWS", "Vercel", "Docker"],
};

export function WhyUs() {
  return (
    <Section kicker="05 — Why QuenchMark" title={<>Reasons businesses <em>choose us.</em></>}>
      <div className="pg-grid">
        {WHY.map((w) => <Rise key={w.title} className="pg-card"><h3>{w.title}</h3><p>{w.desc}</p></Rise>)}
      </div>
      <Rise className="hm-stack">
        <h3>Technologies we work with</h3>
        <div className="hm-stack-grid">
          {Object.entries(STACK).map(([group, items]) => (
            <div key={group}>
              <span>{group}</span>
              <ul className="pg-chips">{items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </Rise>
    </Section>
  );
}

export function HomeFaq() {
  return <Faq items={HOME_FAQS} kicker="06 — FAQ" title={<>Questions, <em>answered.</em></>} tone="tint" />;
}

export function HomeQuickContact() {
  return (
    <div className="hm-quick">
      <WhatsAppCta text="Hi QuenchMark, I'd like to discuss a project." track="home-quick" />
    </div>
  );
}
