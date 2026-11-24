import { useEffect, useRef, useState } from "react";
import { Link } from "../site/nav.jsx";
import { whatsappLink } from "../lib/enquiry.js";
import { WhatsAppIcon } from "../WhatsApp.jsx";
import "./pages.css";

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

/* fades a block in when it scrolls into view. Content stays visible without JS
   (the hiding rule only applies under html.js — see index.html). */
export function Rise({ as = "div", className = "", children, ...rest }) {
  const Tag = as;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`rise ${inView ? "is-in" : ""} ${className}`} {...rest}>{children}</Tag>;
}

export function Breadcrumbs({ crumbs = [] }) {
  if (!crumbs.length) return null;
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <nav className="pg-crumbs" aria-label="Breadcrumb">
      <ol>
        {all.map((c, i) => (
          <li key={c.path}>
            {i < all.length - 1 ? <Link to={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function WhatsAppCta({ text, label = "Chat on WhatsApp", className = "", track }) {
  return (
    <a className={`pg-btn pg-btn-wa ${className}`} href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" data-track={track}>
      <WhatsAppIcon /> {label}
    </a>
  );
}

/* page hero used by every inner page */
export function PageHero({ crumbs, kicker, title, lead, children, aside, className = "" }) {
  return (
    <section className={`pg-hero ${aside ? "has-aside" : ""} ${className}`} data-nav="creme">
      <span className="pg-hero-glow" aria-hidden="true" />
      <div className="pg-inner">
        <Breadcrumbs crumbs={crumbs} />
        <div className="pg-hero-grid">
          <div className="pg-hero-copy">
            {kicker && <span className="hs-kicker">{kicker}</span>}
            <h1>{title}</h1>
            {lead && <p className="pg-lead">{lead}</p>}
            {children && <div className="pg-actions">{children}</div>}
          </div>
          {aside && <div className="pg-hero-aside">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

export function Section({ id, kicker, title, lead, tone = "white", children, className = "", nav = "creme" }) {
  return (
    <section id={id} className={`pg-sec pg-${tone} ${className}`} data-nav={nav}>
      <div className="pg-inner">
        {(kicker || title) && (
          <Rise className="pg-head">
            {kicker && <span className="hs-kicker">{kicker}</span>}
            {title && <h2>{title}</h2>}
            {lead && <p>{lead}</p>}
          </Rise>
        )}
        {children}
      </div>
    </section>
  );
}

/* accessible FAQ accordion — native <details>, readable without JS */
export function Faq({ items, title = "Frequently asked questions", kicker = "FAQ", tone = "tint" }) {
  return (
    <Section kicker={kicker} title={title} tone={tone}>
      <div className="pg-faq">
        {items.map((f) => (
          <details key={f.q}>
            <summary><h3>{f.q}</h3><span className="pg-faq-icon" aria-hidden="true" /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* closing call to action band */
export function CtaBand({ title, text, primary = { to: "/reach-us#enquiry", label: "Request a Free Quote" }, whatsappText, secondary }) {
  return (
    <section className="cx pg-cx" data-nav="creme">
      <div className="cx-card pg-cx-card">
        <span className="cx-ring" aria-hidden="true" />
        <div className="cx-copy">
          <span className="hs-kicker">Let&apos;s talk</span>
          <h2>{title}</h2>
          {text && <p className="pg-cx-text">{text}</p>}
        </div>
        <div className="cx-side">
          <div className="cx-actions">
            <Link className="hs-btn hs-btn-light" to={primary.to} data-cta={primary.label}>{primary.label} <ArrowRight /></Link>
            {secondary && <Link className="hs-btn hs-btn-ghost-light" to={secondary.to} data-cta={secondary.label}>{secondary.label}</Link>}
            {whatsappText && <WhatsAppCta text={whatsappText} track="cta-band" />}
          </div>
          <a className="cx-mail" href="mailto:official@quenchmark.org">official@quenchmark.org</a>
        </div>
      </div>
    </section>
  );
}
