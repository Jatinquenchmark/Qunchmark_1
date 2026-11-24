import { CLIENT_PROJECTS, OWN_PROJECTS } from "../content/work.js";
import { metaFor } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero, Section, CtaBand, Rise, ArrowRight } from "./common.jsx";

/* Portfolio: client websites first, then QuenchMark's own products and
   ventures (clearly labelled). Facts come from src/content/work.js. */

function ServicesLine({ services }) {
  return (
    <p className="wk-services">Related services: {services.map(([slug, label], j) => (
      <span key={slug}>{j > 0 && ", "}<Link to={`/services/${slug}`}>{label}</Link></span>
    ))}</p>
  );
}

function Shot({ p, eager }) {
  return (
    <div className="pg-browser">
      <div className="pg-browser-bar"><i /><i /><i /><em>{p.domain}</em></div>
      <img src={p.shot} alt={`${p.name} — homepage of ${p.domain}`} width="1440" height="900" loading={eager ? "eager" : "lazy"} decoding="async" />
    </div>
  );
}

function ClientCase({ p, i }) {
  return (
    <section id={p.id} className={`pg-sec ${i % 2 ? "pg-tint" : "pg-white"}`} data-nav="creme">
      <div className="pg-inner wk-case">
        <Rise className="wk-copy">
          <span className="pg-tag">{p.label}</span>
          <h2>{p.name}</h2>
          <p className="wk-meta">{p.industry} · {p.location}</p>
          {p.stat && <p className="wk-stat"><b>{p.stat.value}</b> {p.stat.label}</p>}
          <p className="wk-summary">{p.summary}</p>
          <h3>The client</h3>
          <p>{p.client}</p>
          <h3>The brief</h3>
          <p>{p.challenge}</p>
          <h3>What we built</h3>
          <ul className="wk-built">{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
          {(p.appStore || p.playStore) && (
            <p className="wk-stores">
              {p.appStore && <a href={p.appStore} target="_blank" rel="noopener">App Store</a>}
              {p.playStore && <a href={p.playStore} target="_blank" rel="noopener">Google Play</a>}
            </p>
          )}
          <div className="pg-actions">
            <a className="pg-btn pg-btn-dark" href={p.url} target="_blank" rel="noopener" data-cta={`visit:${p.id}`}>Visit {p.domain} <ArrowRight /></a>
            <Link className="pg-btn pg-btn-ghost" to="/reach-us#enquiry" data-cta={`similar:${p.id}`}>Discuss a similar project</Link>
          </div>
          <ServicesLine services={p.services} />
        </Rise>
        <Rise className="wk-shot"><Shot p={p} eager={i === 0} /></Rise>
      </div>
    </section>
  );
}

function OwnCase({ p, i }) {
  return (
    <section id={p.id} className={`pg-sec ${i % 2 ? "pg-tint" : "pg-white"}`} data-nav="creme">
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
          <ServicesLine services={p.services} />
        </Rise>
        <Rise className="wk-shot"><Shot p={p} /></Rise>
      </div>
    </section>
  );
}

export function WorkPage() {
  const m = metaFor("work");
  return (
    <main>
      <PageHero
        crumbs={m.crumbs}
        kicker="Our work"
        title={<>Websites and products <em>we&apos;ve designed and built.</em></>}
        lead="From a society-maintenance platform used by 3,000+ people to client websites in India and Australia and our own SaaS products — here's a selection of what our team has delivered."
      >
        <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta="Discuss a similar project">Discuss Your Project <ArrowRight /></Link>
        <Link className="pg-btn pg-btn-ghost" to="#client-projects">See client projects</Link>
      </PageHero>

      <Section id="client-projects" kicker="Client projects" title={<>Apps and websites we&apos;ve built <em>for our clients.</em></>} lead="Facility management, real estate, live-event ticketing, travel and health — built for businesses in India and Australia." tone="white">
        <div className="wk-index">
          {CLIENT_PROJECTS.map((p) => (
            <Link key={p.id} to={`#${p.id}`} className={`wk-index-card ${p.featured ? "is-featured" : ""}`}>
              <img src={p.shot} alt="" width="1440" height="900" loading="lazy" decoding="async" />
              <span><b>{p.name}</b><em>{p.industry} · {p.location}</em>{p.stat && <strong className="wk-chip">{p.stat.value} {p.stat.label}</strong>}</span>
            </Link>
          ))}
        </div>
      </Section>
      {CLIENT_PROJECTS.map((p, i) => <ClientCase key={p.id} p={p} i={i + 1} />)}

      <Section id="our-products" kicker="Our own products" title={<>Software we <em>build and run ourselves.</em></>} lead="QuenchMark designs, builds and operates its own products and ventures — the same team and standards we bring to client projects." tone="tint">
        <div className="pg-grid">
          <Link className="pg-card is-link" to="/technologies"><h3>Our products in depth</h3><p>BrokrSuite, DMGennie and QuantMentor, with real product screens.</p><span className="pg-link">View products <ArrowRight /></span></Link>
          <Link className="pg-card is-link" to="/ventures"><h3>Our ventures</h3><p>TripSoul and ParameterX — companies QuenchMark runs.</p><span className="pg-link">View ventures <ArrowRight /></span></Link>
        </div>
      </Section>
      {OWN_PROJECTS.map((p, i) => <OwnCase key={p.id} p={p} i={i} />)}

      <CtaBand title={<>Have a project <em>like these?</em></>} text="Tell us what you want to build. We'll share how we'd approach it and what it would take." whatsappText="Hi QuenchMark, I'd like to discuss a project similar to your work." />
    </main>
  );
}
