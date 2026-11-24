import { useState } from "react";
import { BROKRSUITE, BROKR_FEATURES, BROKR_AUDIENCES, BROKR_PROBLEMS, BROKR_FAQS, BROKR_SHOTS } from "../content/brokrsuite.js";
import { metaFor } from "../site/routes.js";
import { useNav } from "../site/nav-context.js";
import { BrokrForm } from "./BrokrForm.jsx";
import { PageHero, Section, Faq, WhatsAppCta, Rise, ArrowRight, Check } from "./common.jsx";

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.27 1.23-2.5 1.25-2.57-.03-.01-2.39-.92-2.41-3.64ZM14.1 5.86c.63-.77 1.06-1.83.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27Z" /></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#34a853" d="M3.6 2.3 13.4 12l-9.8 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Z" /><path fill="#fbbc04" d="m16.7 15.3-3.3-3.3 3.3-3.3 3.9 2.2c.9.5.9 1.8 0 2.3l-3.9 2.1Z" /><path fill="#ea4335" d="M13.4 12 3.6 21.7c.3.2.8.2 1.2 0l11.9-6.4L13.4 12Z" /><path fill="#4285f4" d="M13.4 12 16.7 8.7 4.8 2.3c-.4-.2-.9-.2-1.2 0L13.4 12Z" /></svg>
);

export function StoreBadges() {
  return (
    <div className="pg-stores">
      <a className="pg-store" href={BROKRSUITE.appStore} target="_blank" rel="noopener noreferrer" aria-label="Download BrokrSuite on the App Store">
        <AppleIcon /><span><small>Download on the</small><b>App Store</b></span>
      </a>
      <a className="pg-store" href={BROKRSUITE.playStore} target="_blank" rel="noopener noreferrer" aria-label="Get BrokrSuite on Google Play">
        <PlayIcon /><span><small>Get it on</small><b>Google Play</b></span>
      </a>
    </div>
  );
}

export function BrokrSuitePage() {
  const m = metaFor("brokrsuite");
  const nav = useNav();
  const [interest, setInterest] = useState({ value: "Book a demo", n: 0 });
  const toForm = (value) => {
    setInterest((p) => ({ value, n: p.n + 1 }));
    nav?.scrollToId("demo");
  };
  return (
    <main className="bs-page">
      <PageHero
        crumbs={m.crumbs}
        kicker="BrokrSuite · Real estate CRM"
        title={<>Your entire real estate business. <em>One powerful platform.</em></>}
        lead={BROKRSUITE.description}
        aside={
          <div className="bs-hero-visual">
            <div className="pg-browser">
              <div className="pg-browser-bar"><i /><i /><i /><em>brokrsuite.in</em></div>
              <img src="/shots/brokrsuite-site.webp" alt="BrokrSuite real estate CRM website" width="1440" height="900" fetchPriority="high" />
            </div>
          </div>
        }
      >
        <button type="button" className="pg-btn pg-btn-dark" onClick={() => toForm("Book a demo")} data-cta="Book a Free Demo">Book a Free Demo <ArrowRight /></button>
        <button type="button" className="pg-btn pg-btn-ghost" onClick={() => toForm("Request pricing")} data-cta="Request Pricing">Request Pricing</button>
        <WhatsAppCta text={BROKRSUITE.whatsapp} label="WhatsApp" track="brokrsuite-hero" />
      </PageHero>

      <section className="pg-sec pg-white bs-tagline" data-nav="creme">
        <div className="pg-inner">
          <p className="bs-tag-line">Manage smarter. <span>Sell better.</span> Grow faster.</p>
          <StoreBadges />
        </div>
      </section>

      <Section kicker="The problem" title={<>Real estate shouldn&apos;t run on <em>scattered chats and spreadsheets.</em></>} lead="Most brokers aren't short of deals — they're short of one place to keep track of them." tone="tint">
        <ul className="pg-checks pg-x bs-problems">
          {BROKR_PROBLEMS.map((p) => <li key={p}><span aria-hidden="true">!</span><span>{p}</span></li>)}
        </ul>
      </Section>

      <Section kicker="Features" title={<>Everything you need to <em>run your real estate business.</em></>} lead="BrokrSuite brings your properties, leads, clients, follow-ups and team into one system your whole business works from.">
        <div className="pg-grid bs-features">
          {BROKR_FEATURES.map((f) => (
            <Rise key={f.id} className="pg-card" id={`feature-${f.id}`}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul className="bs-points">{f.points.map((p) => <li key={p}><Check /> {p}</li>)}</ul>
            </Rise>
          ))}
        </div>
      </Section>

      <section className="pg-sec pg-dark bs-mobile" data-nav="dark">
        <div className="pg-inner bs-mobile-grid">
          <Rise className="pg-head">
            <span className="hs-kicker">Mobile apps</span>
            <h2>Your real estate CRM. <em>Wherever you go.</em></h2>
            <p>Manage properties, leads and clients directly from your phone — on a site visit, in the car or between meetings. BrokrSuite is available on iPhone and Android.</p>
            <div className="pg-actions"><StoreBadges /></div>
          </Rise>
          <div className="pg-phones">
            {BROKR_SHOTS.map((s) => (
              <div className="pg-phone" key={s.src}><img src={s.src} alt={s.alt} loading="lazy" decoding="async" width="390" height="844" /></div>
            ))}
          </div>
        </div>
      </section>

      <Section kicker="Who it's for" title={<>Built for <em>modern real estate businesses.</em></>} tone="tint">
        <div className="pg-grid">
          {BROKR_AUDIENCES.map((a) => <Rise key={a.title} className="pg-card"><h3>{a.title}</h3><p>{a.desc}</p></Rise>)}
        </div>
      </Section>

      <Section kicker="Benefits" title={<>What changes when you <em>switch to BrokrSuite.</em></>}>
        <div className="pg-split">
          <Rise className="pg-panel">
            <h3>Organise your business</h3>
            <ul className="pg-checks">
              {["Centralise properties, clients and team information", "Organise daily operations and follow-ups", "Reduce dependence on spreadsheets and manual processes", "Publish and manage property listings"].map((b) => <li key={b}><span><Check /></span><span>{b}</span></li>)}
            </ul>
          </Rise>
          <Rise className="pg-panel">
            <h3>Lead your team</h3>
            <ul className="pg-checks">
              {["Assign leads and properties to the right people", "See team activity and performance", "Improve coordination across your team", "Run operations from your phone"].map((b) => <li key={b}><span><Check /></span><span>{b}</span></li>)}
            </ul>
          </Rise>
        </div>
      </Section>

      <Faq items={BROKR_FAQS} title={<>BrokrSuite <em>FAQs</em></>} />

      <section className="pg-sec pg-white" id="demo" data-nav="creme">
        <div className="pg-inner pg-form-wrap">
          <div className="pg-form-side">
            <span className="hs-kicker">Book a demo</span>
            <h2>See BrokrSuite <em>with your business in mind.</em></h2>
            <p>Book a free demo or request pricing. Our team will walk you through BrokrSuite and answer your questions — no obligation.</p>
            <div className="pg-actions">
              <WhatsAppCta text={BROKRSUITE.whatsapp} label="Talk to our team on WhatsApp" track="brokrsuite-form" />
            </div>
            <p className="bs-more">Prefer to explore first? Visit <a href={BROKRSUITE.site} target="_blank" rel="noopener">brokrsuite.in</a> or download the app.</p>
            <StoreBadges />
          </div>
          <BrokrForm interest={interest} />
        </div>
      </section>
    </main>
  );
}
