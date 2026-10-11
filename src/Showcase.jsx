import { useEffect, useRef, useState } from "react";
import { ventures, products } from "./brands";
import "./showcase.css";
import { SectionHead } from "./HomeSections";
import { Aurora } from "./fx";

/* aurora colours per product: its own colour plus two neighbours */
const PRODUCT_AURORA = {
  brokr: ["#7c74ff", "#c084fc", "#38bdf8"],
  dmg: ["#e0559e", "#f97316", "#a855f7"],
  qm: ["#3ea6ff", "#22d3ee", "#6366f1"],
};

/* Every screenshot on these pages is a real capture of the brand's live site
   (or, for BrokrSuite, its published app screens) — nothing is mocked up. */
const CAPTURED = "October 2026";

/* ---------- small helpers ---------- */

/* one-shot "has scrolled into view" flag */
function useInView(threshold = 0.25) {
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

const pad = (n) => String(n).padStart(2, "0");
const Arrow = ({ d = "M7 17 17 7M8 7h9v9" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

function BrandIcon({ brand, className = "" }) {
  return (
    <span className={`sp-icon ${brand.logoShape === "wide" ? "is-wide" : ""} ${className}`}>
      <img src={brand.markLogo} alt="" />
    </span>
  );
}

/* a real screenshot in a browser window */
function BrowserShot({ src, url, alt, className = "" }) {
  return (
    <div className={`fr-browser ${className}`}>
      <div className="fr-bar">
        <span className="fr-dots"><i /><i /><i /></span>
        <span className="fr-url">{url}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

/* a real phone screenshot in a slim device frame */
function PhoneShot({ src, alt, className = "" }) {
  return (
    <div className={`fr-phone ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}

/* ==========================================================================
   TECHNOLOGIES — a dark, keynote-style page: launch hero, a pinned
   horizontal reel of the products, and a spec sheet
   ========================================================================== */

const TECH_SLIDES = [
  {
    brand: products[0],
    desc: "Manage properties, leads, clients, follow-ups and your entire real estate workflow from one powerful platform.",
    features: [
      ["Property Management", "Your entire property inventory in one place."],
      ["Lead Management", "Capture, organise and manage leads."],
      ["Client Management", "Client information and interactions, organised."],
      ["Follow-Ups", "Never miss an important client follow-up."],
      ["Team Management", "Manage agents and sales teams."],
      ["Business Analytics", "Track performance and sales activity."],
    ],
    tabs: [
      ["Homepage", "/shots/brokrsuite-site.webp"],
      ["Modules", "/shots/brokrsuite-modules.webp"],
    ],
    phones: ["/shots/brokrsuite-app-explore.webp", "/shots/brokrsuite-app-property-detail.webp"],
    phoneNote: "The BrokrSuite app on iOS and Android",
  },
  {
    brand: products[1],
    desc: "Automatically send Instagram direct messages when people comment keywords on your posts and reels, using official Meta APIs.",
    features: [
      ["Comment Automation", "Reply to comments and send a DM."],
      ["Story Automation", "Auto-respond to story replies and reactions."],
      ["Live Automation", "Message followers active during lives."],
      ["DM Automation", "Reply automatically to incoming messages."],
      ["Ask For Follow", "Ask people to follow before sending."],
      ["Collect User Data", "Build an email list to re-target."],
    ],
    tabs: [
      ["Homepage", "/shots/dmgennie-site.webp"],
      ["Features", "/shots/dmgennie-features.webp"],
    ],
    phones: ["/shots/dmgennie-mobile.webp"],
    phoneNote: "dmgennie.in on a phone",
  },
  {
    brand: products[2],
    desc: "Backtest, automate and execute your trading strategies through your own broker. Describe an idea in plain English and get TradingView Pine Script v5.",
    features: [
      ["AI Strategy Builder", "Plain English in, Pine Script v5 out."],
      ["Backtest & Analytics", "Win rate, drawdown and Sharpe before you risk capital."],
      ["Broker Automation", "Rule-based strategies run through your own broker."],
      ["Paper Trading", "Validate on a $10k paper account first."],
      ["AI Chart Analysis", "Pattern recognition from a chart screenshot."],
      ["Non-Custodial", "Funds stay in your brokerage account."],
    ],
    tabs: [
      ["Homepage", "/shots/quantmentor-site.webp"],
      ["Tools", "/shots/quantmentor-tools.webp"],
      ["Dashboard", "/shots/quantmentor-dashboard.webp"],
    ],
    phones: ["/shots/quantmentor-mobile.webp"],
    phoneNote: "quantmentor.org on a phone",
    note: "In beta. QuantMentor's site notes that data shown there is for demonstration and is not financial advice.",
  },
];

const SPEC_ROWS = [
  ["What it is", ["Real estate CRM", "Instagram DM automation", "AI trading automation"]],
  ["Built for", ["Brokers, agencies & sales teams", "Creators & businesses on Instagram", "Retail traders"]],
  ["Platforms", ["Web, iOS & Android", "Web", "Web"]],
  ["Connects to", ["WhatsApp inquiries", "Instagram, via the official Meta API", "Zerodha, Upstox, Delta, Binance & more"]],
  ["Getting started", ["Free trial · pricing on request", "Free to start · no credit card", "Free trial"]],
];

/* pinned reel: vertical scroll drives the horizontal track, with a pause on each slide */
function useReel(count) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const raw = p * (count - 1);
      const i = Math.min(count - 2, Math.floor(raw));
      const f = raw - i;
      // hold still for the first and last quarter of each segment
      const t = Math.min(1, Math.max(0, (f - 0.25) / 0.5));
      const x = i + t * t * (3 - 2 * t);
      el.style.setProperty("--x", x.toFixed(4));
      el.style.setProperty("--p", p.toFixed(4));
      const a = Math.round(x);
      setActive((prev) => (prev === a ? prev : a));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);
  return [ref, active];
}

function TechSlide({ slide, i, count, isActive }) {
  const b = slide.brand;
  const [tab, setTab] = useState(0);
  return (
    <div className={`tps ${isActive ? "is-active" : ""}`} style={{ "--c": b.color, "--fx-c": b.color }} aria-hidden={!isActive}>
      <Aurora colors={PRODUCT_AURORA[b.key]} className="is-soft" />
      <div className="tps-info">
        <span className="tps-count">{pad(i + 1)} / {pad(count)}</span>
        <div className="tps-brand">
          <BrandIcon brand={b} />
          <div>
            <span className="tps-cat">{b.category}</span>
            <h2>{b.title}</h2>
          </div>
          <span className={`tps-status ${b.status === "Beta" ? "is-beta" : ""}`}><i />{b.status}</span>
        </div>
        <p className="tps-head">{b.tagline}</p>
        <p className="tps-desc">{slide.desc}</p>
        <ul className="tps-features">
          {slide.features.map(([t, d]) => (
            <li key={t}><b>{t}</b><span>{d}</span></li>
          ))}
        </ul>
        {slide.note && <p className="tps-note">{slide.note}</p>}
        <a className="tps-cta" href={b.link} target="_blank" rel="noopener noreferrer" tabIndex={isActive ? 0 : -1}>
          Visit {b.domain} <Arrow />
        </a>
      </div>
      <div className="tps-media">
        <div className="tps-tabs" role="tablist" aria-label={`${b.title} screenshots`}>
          {slide.tabs.map(([label], k) => (
            <button
              type="button"
              role="tab"
              key={label}
              aria-selected={k === tab}
              className={k === tab ? "is-on" : ""}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="tps-stage">
          <div className="tps-browser fx-border">
            <div className="fr-bar">
              <span className="fr-dots"><i /><i /><i /></span>
              <span className="fr-url">{b.domain}</span>
            </div>
            <div className="tps-screens">
              {slide.tabs.map(([label, src], k) => (
                <img key={src} src={src} alt={`${b.title}: ${label}`} className={k === tab ? "is-on" : ""} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
          <div className={`tps-phones n${slide.phones.length}`}>
            {slide.phones.map((src) => <PhoneShot key={src} src={src} alt={slide.phoneNote} />)}
          </div>
        </div>
        <span className="tps-caption">Real screens from {b.domain}, captured {CAPTURED}.</span>
      </div>
    </div>
  );
}

export function TechnologiesPage({ nav }) {
  const count = TECH_SLIDES.length;
  const [reelRef, active] = useReel(count);
  const [specRef, specSeen] = useInView(0.2);
  return (
    <main className="tp" data-nav="dark">
      <section className="tp-hero" data-nav="dark">
        <div className="tp-beam" aria-hidden="true" />
        <Aurora colors={["#6366f1", "#ec4899", "#06b6d4"]} />
        <span className="tp-kicker">Quenchmark Technologies</span>
        <h1 className="tp-title">Software,<br /><span className="fx-gradient-text">made in-house.</span></h1>
        <p className="tp-sub">
          The product arm of Quenchmark. We design, build and run software for real estate teams,
          Instagram creators and retail traders.
        </p>
        <div className="tp-lineup">
          {products.map((b) => (
            <button type="button" key={b.key} className="fx-border" style={{ "--c": b.color, "--fx-c": b.color }} onClick={() => nav.scrollToId(b.chapter)}>
              <BrandIcon brand={b} />
              <span className="tp-l-name">{b.title}</span>
              <span className={`tp-l-status ${b.status === "Beta" ? "is-beta" : ""}`}>{b.status}</span>
            </button>
          ))}
        </div>
        <span className="tp-scroll" aria-hidden="true">Scroll</span>
      </section>

      <section ref={reelRef} className="tp-reel" style={{ "--n": count }} data-nav="dark">
        <div className="tp-pin">
          <div className="tp-dots" aria-hidden="true">
            {TECH_SLIDES.map((s, k) => (
              <span key={s.brand.key} className={k === active ? "is-on" : ""} style={{ "--c": s.brand.color }}>{s.brand.title}</span>
            ))}
          </div>
          <div className="tp-track">
            {TECH_SLIDES.map((s, k) => (
              <TechSlide key={s.brand.key} slide={s} i={k} count={count} isActive={k === active} />
            ))}
          </div>
          <div className="tp-bar" aria-hidden="true"><i /></div>
        </div>
        {/* one viewport-tall jump target per product */}
        {TECH_SLIDES.map((s, k) => <span key={s.brand.key} id={s.brand.chapter} className="tp-slot" style={{ "--i": k }} />)}
      </section>

      <section ref={specRef} className={`tp-spec ${specSeen ? "is-in" : ""}`} data-nav="dark">
        <Aurora colors={["#4f46e5", "#db2777", "#0891b2"]} className="is-soft" />
        <span className="tp-kicker">Spec sheet</span>
        <h2>Three products, side by side.</h2>
        <div className="tp-table-wrap">
          <table className="tp-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Detail</span></th>
                {products.map((b) => (
                  <th scope="col" key={b.key} style={{ "--c": b.color }}>
                    <BrandIcon brand={b} />
                    <span>{b.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map(([label, cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((c, k) => <td key={products[k].key}>{c}</td>)}
                </tr>
              ))}
              <tr>
                <th scope="row">Status</th>
                {products.map((b) => (
                  <td key={b.key}><span className={`tp-l-status ${b.status === "Beta" ? "is-beta" : ""}`}>{b.status}</span></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="tp-end" data-nav="dark">
        <Aurora colors={["#8b5cf6", "#ec4899", "#0ea5e9"]} className="is-soft" />
        <h2>Built by <span className="fx-gradient-text">Quenchmark.</span></h2>
        <p>Open a product, or talk to us about building the next one.</p>
        <div className="tp-end-actions">
          <button type="button" className="tp-btn tp-btn-solid" onClick={nav.contact}>Partner with Quenchmark</button>
          <button type="button" className="tp-btn" onClick={() => nav.open("ventures")}>See our Ventures →</button>
        </div>
      </section>
    </main>
  );
}

/* ---------- home hero: headline + a fanned deck of every brand in the group ---------- */
export function HomeHero({ nav }) {
  const deck = [...ventures, ...products];
  const mid = (deck.length - 1) / 2;
  return (
    <section className="hx" id="home" data-nav="creme">
      <div className="hx-glow" aria-hidden="true" />
      <div className="hx-inner">
        <div className="hx-top">
          <span className="hx-meta"></span>
        </div>
        <h1 className="hx-title">
          <span className="hx-line"><span>Powerful businesses,</span></span>
          <span className="hx-line"><span>built <em>under one vision.</em></span></span>
        </h1>
        <div className="hx-row">
          <div className="hx-copy">
            <p className="hx-lede">
              Quenchmark builds and runs companies and software in travel, cybersecurity,
              real estate tech, creator tools and AI trading.
            </p>
            <div className="hx-actions">
              <button type="button" className="hx-btn hx-btn-solid" onClick={() => nav.open("ventures")}>
                Explore Ventures <Arrow d="M5 12h14M13 6l6 6-6 6" />
              </button>
              <button type="button" className="hx-btn hx-btn-ghost" onClick={() => nav.open("technologies")}>
                Explore Technologies
              </button>
            </div>
          </div>
          <div className="hx-deck">
            {deck.map((b, i) => {
              const o = i - mid;
              return (
                <button
                  type="button"
                  key={b.key}
                  className={`hx-card ${o > 0 ? "is-right" : ""}`}
                  style={{ "--c": b.color, "--o": o, "--a": Math.abs(o), "--i": i, zIndex: 10 - Math.abs(o) }}
                  onClick={() => nav.open(b.page, b.chapter)}
                  aria-label={`${b.title}: open in ${b.page === "ventures" ? "Ventures" : "Technologies"}`}
                >
                  <span className="hx-card-media" />
                  <span className="hx-card-top">
                    <span>{pad(i + 1)}</span>
                    <span>{b.page === "ventures" ? "Venture" : "Product"}</span>
                  </span>
                  <BrandIcon brand={b} className="hx-card-icon" />
                  <span className="hx-card-foot">
                    <b>{b.title}</b>
                    <em>{b.category}</em>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- home-page Ventures showcase: one big photo card per company ---------- */
const VENTURE_CARDS = {
  tripsoul: {
    quote: "Personalised multi-day tours.",
    facts: ["Flights", "Hotels", "Holiday packages"],
    shot: "/shots/tripsoul-site.webp",
  },
  parameterx: {
    quote: "Penetration testing and security assessments.",
    facts: ["Pentest & VAPT", "Cloud & network", "AI security"],
    shot: "/shots/parameterx-site.webp",
  },
};

export function VenturesTeaser({ onOpen }) {
  const [ref, seen] = useInView(0.2);
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <section ref={ref} className={`hs hs-white vt ${seen ? "is-in" : ""}`} id="ventures" data-nav="creme">
      <div className="hs-inner">
        <SectionHead
          no="01"
          kicker="Quenchmark Ventures"
          title={<>Our <em>ventures.</em></>}
          text="Two companies run by Quenchmark: one in travel, one in cybersecurity."
          action={
            <button type="button" className="hs-btn hs-btn-dark" onClick={() => onOpen()}>
              View ventures <Arrow d="M5 12h14M13 6l6 6-6 6" />
            </button>
          }
        />

        <div className="vt-grid">
          {ventures.map((b, i) => {
            const card = VENTURE_CARDS[b.key];
            return (
              <button
                type="button"
                key={b.key}
                className="vt-card"
                style={{ "--c": b.color, "--i": i }}
                onMouseMove={onMove}
                onClick={() => onOpen(b.chapter)}
                aria-label={`${b.title}: view on the Ventures page`}
              >
                <span className="vt-photo" style={{ backgroundImage: `url(${b.image})` }} aria-hidden="true" />
                <span className="vt-spot" aria-hidden="true" />
                <span className="vt-top">
                  <BrandIcon brand={b} />
                  <span className="vt-cat">{b.category}</span>
                  <span className="vt-no">{pad(i + 1)}</span>
                </span>
                <span className="vt-shot" aria-hidden="true">
                  <span className="vt-shot-bar"><i /><i /><i /><em>{b.domain}</em></span>
                  <img src={card.shot} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="vt-body">
                  <span className="vt-name">{b.title}</span>
                  <span className="vt-quote">{card.quote}</span>
                  <span className="vt-facts">
                    {card.facts.map((f) => <span key={f}>{f}</span>)}
                  </span>
                </span>
                <span className="vt-go" aria-hidden="true"><Arrow /></span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
