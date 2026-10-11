import { useEffect, useRef, useState } from "react";
import { products } from "./brands";
import "./home.css";

/* Home page sections below the hero. They share one system: full-width
   sections with alternating backgrounds, a 1240px content column, and the same
   numbered heading pattern ("02 — Ventures"). */

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

const Arrow = ({ d = "M7 17 17 7M8 7h9v9" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const RIGHT = "M5 12h14M13 6l6 6-6 6";

function Icon({ brand, size = 44 }) {
  return (
    <span className={`sp-icon ${brand.logoShape === "wide" ? "is-wide" : ""}`} style={{ "--s": `${size}px`, "--c": brand.color }}>
      <img src={brand.markLogo} alt="" />
    </span>
  );
}

/* shared section heading: numbered kicker + title on the left, copy + action on the right */
export function SectionHead({ no, kicker, title, text, action, dark = false }) {
  return (
    <div className={`hs-head ${dark ? "is-dark" : ""}`}>
      <div>
        <span className="hs-kicker">{no} — {kicker}</span>
        <h2>{title}</h2>
      </div>
      {(text || action) && (
        <div className="hs-head-side">
          {text && <p>{text}</p>}
          {action}
        </div>
      )}
    </div>
  );
}

/* ---------- 02 — Technologies: an interactive showcase of the three products.
   The list on the left picks a product (and advances on its own); the stage on the
   right shows that product's real site and phone screens. ---------- */
const SHOWCASE = {
  brokr: {
    shot: "/shots/brokrsuite-site.webp",
    phone: "/shots/brokrsuite-app-explore.webp",
    chips: ["Web, iOS & Android", "WhatsApp inquiries", "Team roles"],
  },
  dmg: {
    shot: "/shots/dmgennie-site.webp",
    phone: "/shots/dmgennie-mobile.webp",
    chips: ["Official Meta API", "Comment-to-DM", "Lead capture"],
  },
  qm: {
    shot: "/shots/quantmentor-site.webp",
    phone: "/shots/quantmentor-mobile.webp",
    chips: ["Pine Script v5", "Paper trading", "Non-custodial"],
  },
};
const CYCLE_MS = 6500;

export function TechTeaser({ onOpen }) {
  const [ref, seen] = useInView(0.15);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // advance through the products while the section is on screen and not hovered
  useEffect(() => {
    if (!seen || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % products.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, seen]);

  const cur = products[active];
  return (
    <section ref={ref} className={`hs hs-dark tx ${seen ? "is-in" : ""} ${paused ? "is-paused" : ""}`} id="technologies" data-nav="dark" style={{ "--c": cur.color, "--cycle": `${CYCLE_MS}ms` }}>
      <div className="tx-grid-bg" aria-hidden="true" />
      <div className="hs-inner">
        <SectionHead
          dark
          no="02"
          kicker="Quenchmark Technologies"
          title={<>Software we <em>build</em> and run.</>}
          text="Three products, made in-house, for real estate teams, Instagram creators and traders."
          action={
            <button type="button" className="hs-btn hs-btn-light" onClick={() => onOpen()}>
              Explore Technologies <Arrow d={RIGHT} />
            </button>
          }
        />

        <div className="tx-body" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="tx-list" role="tablist" aria-label="Products">
            {products.map((b, i) => {
              const on = i === active;
              return (
                <div key={b.key} className={`tx-item ${on ? "is-on" : ""}`} style={{ "--bc": b.color }}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="tx-stage"
                    className="tx-tab"
                    onClick={() => setActive(i)}
                  >
                    <span className="tx-no">0{i + 1}</span>
                    <Icon brand={b} size={40} />
                    <span className="tx-name">
                      <b>{b.title}</b>
                      <em>{b.category}</em>
                    </span>
                    <span className={`tt-status ${b.status === "Beta" ? "is-beta" : ""}`}><i />{b.status}</span>
                  </button>
                  <div className="tx-detail" aria-hidden={!on}>
                    <div className="tx-detail-in">
                      <p>{b.tagline}</p>
                      <span className="tx-chips">{SHOWCASE[b.key].chips.map((c) => <span key={c}>{c}</span>)}</span>
                      <span className="tx-links">
                        <button type="button" tabIndex={on ? 0 : -1} onClick={() => onOpen(b.chapter)}>See details <Arrow d={RIGHT} /></button>
                        <a href={b.link} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1}>{b.domain} <Arrow /></a>
                      </span>
                    </div>
                  </div>
                  <span className="tx-progress" aria-hidden="true"><i key={`${active}-${paused}`} /></span>
                </div>
              );
            })}
          </div>

          <div className="tx-stage" id="tx-stage" role="tabpanel" aria-label={`${cur.title} screens`}>
            <span className="tx-glow" aria-hidden="true" />
            <div className="tx-browser">
              <div className="tx-bar">
                <span><i /><i /><i /></span>
                <em>{cur.domain}</em>
                <span className="tx-live"><i />{cur.status === "Beta" ? "beta" : "live"}</span>
              </div>
              <div className="tx-screens">
                {products.map((b, i) => (
                  <img key={b.key} src={SHOWCASE[b.key].shot} alt={i === active ? `${b.title} website` : ""} className={i === active ? "is-on" : ""} loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
            <div className="tx-phone">
              {products.map((b, i) => (
                <img key={b.key} src={SHOWCASE[b.key].phone} alt={i === active ? `${b.title} on a phone` : ""} className={i === active ? "is-on" : ""} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- closing call to action ---------- */
export function ClosingCTA({ nav }) {
  const [ref, seen] = useInView(0.15);
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <section ref={ref} className={`cx ${seen ? "is-in" : ""}`} data-nav="creme">
      <div className="cx-card" onMouseMove={onMove}>
        <span className="cx-light" aria-hidden="true" />
        <span className="cx-ring" aria-hidden="true" />
        <div className="cx-copy">
          <span className="hs-kicker">Work with us</span>
          <h2>Let&apos;s build something <em>that lasts.</em></h2>
        </div>
        <div className="cx-side">
          <div className="cx-actions">
            <button type="button" className="hs-btn hs-btn-light" onClick={nav.contact}>Partner with us <Arrow d={RIGHT} /></button>
            <button type="button" className="hs-btn hs-btn-ghost-light" onClick={nav.careers}>Join the team</button>
          </div>
          <a className="cx-mail" href="mailto:official@quenchmark.org">official@quenchmark.org</a>
        </div>
      </div>
    </section>
  );
}
