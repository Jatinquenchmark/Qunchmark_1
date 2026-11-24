import { SERVICES, PROCESS, ENGAGEMENT_MODELS, WORK, serviceBySlug } from "../content/services.js";
import { metaFor } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { EnquiryForm } from "../ReachUs.jsx";
import { PageHero, Section, Faq, CtaBand, WhatsAppCta, Rise, ArrowRight, Check } from "./common.jsx";

export function ProcessSteps({ dark = false }) {
  return (
    <Section kicker="How we work" title={<>A clear process, <em>from idea to launch.</em></>} lead="You always know what is being built, what it costs and what happens next." tone={dark ? "dark" : "white"} nav={dark ? "dark" : "creme"}>
      <ol className="pg-steps">
        {PROCESS.map((p) => (
          <li key={p.title}><h3>{p.title}</h3><p>{p.desc}</p></li>
        ))}
      </ol>
    </Section>
  );
}

export function EngagementModels() {
  return (
    <Section kicker="Engagement models" title={<>Work with us <em>the way that suits you.</em></>} tone="tint">
      <div className="pg-grid">
        {ENGAGEMENT_MODELS.map((m) => (
          <Rise key={m.title} className="pg-card"><h3>{m.title}</h3><p>{m.desc}</p></Rise>
        ))}
      </div>
    </Section>
  );
}

export function ServiceCards({ items = SERVICES }) {
  return (
    <div className="pg-grid">
      {items.map((s, i) => (
        <Link key={s.slug} to={`/services/${s.slug}`} className="pg-card is-link" data-cta={`service-card:${s.slug}`}>
          <span className="pg-card-num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.name}</h3>
          <p>{s.short}</p>
          <span className="pg-link">Learn more <ArrowRight /></span>
        </Link>
      ))}
    </div>
  );
}

/* ---------- /services ---------- */
export function ServicesIndex() {
  const m = metaFor("services");
  return (
    <main>
      <PageHero
        crumbs={m.crumbs}
        kicker="Services"
        title={<>Technology services to <em>build, scale and transform</em> your business.</>}
        lead="From your first website to enterprise platforms and AI, QuenchMark Technologies takes products from concept to design, development, launch and long-term support."
      >
        <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta="Request a Free Quote">Request a Free Quote <ArrowRight /></Link>
        <WhatsAppCta text="Hi QuenchMark, I'd like to discuss a project." track="services-hero" />
      </PageHero>
      <Section kicker="What we do" title={<>Our <em>services.</em></>} lead="Each service is delivered by the same team, so your website, app, backend and integrations work together.">
        <ServiceCards />
      </Section>
      <ProcessSteps dark />
      <EngagementModels />
      <CtaBand title={<>Not sure which service <em>you need?</em></>} text="Tell us what you're trying to achieve. We'll recommend the simplest approach that fits your goals and budget." whatsappText="Hi QuenchMark, I'm not sure which service I need — can you help?" />
    </main>
  );
}

/* ---------- /services/:slug ---------- */
export function ServicePage({ slug }) {
  const s = serviceBySlug(slug);
  const m = metaFor(`service:${slug}`);
  const related = s.related.map(serviceBySlug).filter(Boolean);
  return (
    <main>
      <PageHero crumbs={m.crumbs} kicker={s.name} title={s.h1} lead={s.intro}>
        <Link className="pg-btn pg-btn-dark" to="#quote" data-cta={`Request a Quote:${s.slug}`}>Request a Quote <ArrowRight /></Link>
        <Link className="pg-btn pg-btn-ghost" to="#quote" data-cta={`Free Consultation:${s.slug}`}>Book a Free Consultation</Link>
        <WhatsAppCta text={s.whatsapp} label="WhatsApp" track={`service:${s.slug}`} />
      </PageHero>

      <Section kicker="The challenge" title={<>Sound <em>familiar?</em></>} tone="white">
        <div className="pg-split">
          <Rise className="pg-panel">
            <h3>Common problems</h3>
            <ul className="pg-checks pg-x">
              {s.problems.map((p) => <li key={p}><span aria-hidden="true">!</span><span>{p}</span></li>)}
            </ul>
          </Rise>
          <Rise className="pg-panel">
            <h3>How we solve them</h3>
            <ul className="pg-checks">
              {s.solutions.map((p) => <li key={p}><span><Check /></span><span>{p}</span></li>)}
            </ul>
          </Rise>
        </div>
      </Section>

      <Section kicker="What we offer" title={<>{s.name} <em>services.</em></>} tone="tint">
        <div className="pg-grid">
          {s.offerings.map((o) => <Rise key={o.title} className="pg-card"><h3>{o.title}</h3><p>{o.desc}</p></Rise>)}
        </div>
      </Section>

      <Section kicker="Why it matters" title={<>Business <em>benefits.</em></>}>
        <div className="pg-split">
          <Rise className="pg-panel">
            <h3>What you gain</h3>
            <ul className="pg-checks">{s.benefits.map((b) => <li key={b}><span><Check /></span><span>{b}</span></li>)}</ul>
          </Rise>
          <Rise className="pg-panel">
            <h3>Example use cases</h3>
            <ul className="pg-checks">{s.useCases.map((u) => <li key={u}><span><Check /></span><span>{u}</span></li>)}</ul>
          </Rise>
        </div>
      </Section>

      <Section kicker="Technology" title={<>Technologies <em>we use.</em></>} lead="We choose technology for your requirements, budget and long-term maintainability — not for trends." tone="dark" nav="dark">
        <ul className="pg-chips">{s.tech.map((t) => <li key={t}>{t}</li>)}</ul>
      </Section>

      <ProcessSteps />

      <Section kicker="Our work" title={<>Work <em>we&apos;ve delivered.</em></>} lead="Client projects and the software products we design, build and run ourselves." tone="tint">
        <div className="pg-grid">
          {s.work.map((k) => WORK[k]).map((w) => (
            <Link key={w.title} to={w.href} className="pg-card is-link">
              <span className="pg-tag">{w.type}</span>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
              <span className="pg-link">View project <ArrowRight /></span>
            </Link>
          ))}
        </div>
      </Section>

      <EngagementModels />

      <Faq items={s.faqs} title={<>{s.name}: <em>FAQs</em></>} tone="white" />

      <section className="pg-sec pg-tint" id="quote" data-nav="creme">
        <div className="pg-inner pg-form-wrap">
          <div className="pg-form-side">
            <span className="hs-kicker">Get a quote</span>
            <h2>Tell us about your <em>project.</em></h2>
            <p>Share a few details and we&apos;ll get back to you within 24 hours with next steps. The consultation and estimate are free.</p>
            <div className="pg-actions">
              <WhatsAppCta text={s.whatsapp} track={`service-form:${s.slug}`} />
            </div>
            {related.length > 0 && (
              <div className="pg-related">
                <h3 className="pg-related-title">Related services</h3>
                <ul>
                  {related.map((r) => <li key={r.slug}><Link className="pg-link" to={`/services/${r.slug}`}>{r.name} <ArrowRight /></Link></li>)}
                </ul>
              </div>
            )}
          </div>
          <EnquiryForm defaultService={s.name} />
        </div>
      </section>

      <CtaBand title={<>Ready to start your <em>{s.name.toLowerCase()}</em> project?</>} text="Free consultation, a written scope and a transparent estimate before any work begins." whatsappText={s.whatsapp} />
    </main>
  );
}
