import { useEffect, useRef, useState } from "react";
import { ventures } from "./brands";
import "./ventures.css";
import { Aurora } from "./fx";

/* Quenchmark Ventures — dark, tech-styled page. Each venture is shown as a
   bento "dashboard" of tiles: its real live site, phone screen, what it does and
   what it offers. Copy is short and factual; screens are real captures. */

const pad = (n) => String(n).padStart(2, "0");

function useInView(threshold = 0.15) {
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
const DOWN = "M12 5v14M6 13l6 6 6-6";
const RIGHT = "M5 12h14M13 6l6 6-6 6";

/* line icons (24px grid, stroked) */
const ICONS = {
  plane: "M2 16l20-6-20-6 3 6-3 6zM5 10h7",
  bed: "M3 18V7M3 13h18v5M21 18v-5a3 3 0 0 0-3-3h-7v3M7 11.5a1.5 1.5 0 1 0 0-.01",
  home: "M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6",
  bag: "M4 8h16v12H4zM9 8V5h6v3M4 13h16",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  wallet: "M3 7h16a2 2 0 0 1 2 2v9H3zM3 7l13-3v3M16 13h2",
  headset: "M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3z",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
  app: "M3 5h18v14H3zM3 9h18M7 7h.01",
  building: "M4 21V5l8-3v19M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
  cloud: "M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9z",
  network: "M12 4v5M5 20v-4h14v4M12 9a2.5 2.5 0 1 0 0-.01M12 12v4M5 16a2 2 0 1 0 0 .01",
  code: "M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14",
  chip: "M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4",
  brain: "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V4.5A2.5 2.5 0 0 0 9 4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
};
function Ico({ name }) {
  return (
    <svg className="vz-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Mark({ brand, size = 44 }) {
  return <span className="vz-mark" style={{ "--s": `${size}px` }}><img src={brand.markLogo} alt="" /></span>;
}

/* tile with a border light that follows the cursor */
function Tile({ className = "", i = 0, label, children }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`vz-tile ${className}`} style={{ "--i": i }} onMouseMove={onMove}>
      {label && <span className="vz-label">{label}</span>}
      {children}
    </div>
  );
}

const [TRIPSOUL, PARAMETERX] = ventures;

const VENTURES = [
  {
    brand: TRIPSOUL,
    accent: "#a78bfa",
    accent2: "#f472b6",
    line: "Personalised multi-day tours.",
    about: "TripSoul plans multi-day tours and books flights, hotels, villas and homestays, and holiday packages.",
    offerLabel: "Books",
    offers: [["plane", "Flights"], ["bed", "Hotels"], ["home", "Villas & Homestays"], ["bag", "Holiday Packages"]],
    tiers: ["Essential Soul", "Comfort Soul", "Luxury Soul"],
    destinations: ["India", "Vietnam", "Bali", "Dubai", "Singapore", "Maldives", "Thailand", "Turkey", "Malaysia", "Sri Lanka", "Nepal", "Bhutan", "Mauritius", "Seychelles", "Kazakhstan", "Hong Kong", "Qatar"],
    shots: [["Homepage", "/shots/tripsoul-site.webp"]],
    mobile: "/shots/tripsoul-mobile.webp",
  },
  {
    brand: PARAMETERX,
    accent: "#22d3ee",
    accent2: "#3b82f6",
    line: "Penetration testing and security assessments.",
    about: "ParameterX runs penetration testing, VAPT and security assessments for web, cloud, network, AI and blockchain systems.",
    offerLabel: "Services",
    offers: [
      ["app", "Application Pentest"], ["building", "Enterprise Pentest"], ["target", "Red Team Assessment"],
      ["cloud", "Cloud Pentest"], ["network", "Network Pentest"], ["code", "Source Code Audit"],
      ["chip", "IoT Pentest"], ["brain", "AI Security Assessment"], ["cube", "Blockchain Security"],
    ],
    shots: [
      ["Homepage", "/shots/parameterx-site.webp"],
      ["Services", "/shots/parameterx-services.webp"],
      ["Scanner", "/shots/parameterx-scanner.webp"],
    ],
    mobile: "/shots/parameterx-mobile.webp",
  },
];

/* ---------- hero ---------- */
function Hero({ onJump }) {
  return (
    <section className="vz-hero" data-nav="dark">
      <div className="vz-beam" aria-hidden="true" />
      <Aurora colors={["#8b5cf6", "#ec4899", "#06b6d4"]} />
      <div className="vz-wrap vz-hero-in">
        <span className="vz-kicker">Quenchmark Ventures</span>
        <h1 className="vz-title">Companies,<br /><span className="fx-gradient-text">run by Quenchmark.</span></h1>
        <p className="vz-sub">A travel company and a cybersecurity firm. Built and operated by our team.</p>
        <div className="vz-launch">
          {VENTURES.map(({ brand: b, accent }, i) => (
            <button type="button" key={b.key} className="fx-border" style={{ "--a": accent, "--fx-c": accent, "--i": i }} onClick={() => onJump(b.chapter)}>
              <Mark brand={b} size={42} />
              <span className="vz-launch-txt"><b>{b.title}</b><em>{b.category}</em></span>
              <span className="vz-live"><i />Live</span>
              <span className="vz-launch-go"><Arrow d={DOWN} /></span>
            </button>
          ))}
        </div>
      </div>
      <div className="vz-ticker" aria-hidden="true">
        <div className="vz-ticker-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {["Travel", "Flights", "Hotels", "Holiday packages", "Cybersecurity", "Penetration testing", "VAPT", "Cloud security", "AI security"].map((t) => (
                <span key={t}>{t}<i>/</i></span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- floating dock: shows while the venture dashboards are on screen ---------- */
function Switcher({ active, shown, onJump }) {
  return (
    <div className={`vz-switch ${shown ? "is-shown" : ""}`} aria-hidden={!shown}>
      <div className="vz-switch-in" role="tablist" aria-label="Ventures">
        {VENTURES.map(({ brand: b, accent }, i) => (
          <button
            type="button"
            role="tab"
            key={b.key}
            aria-selected={i === active}
            className={i === active ? "is-on" : ""}
            style={{ "--a": accent }}
            tabIndex={shown ? 0 : -1}
            onClick={() => onJump(b.chapter)}
          >
            <span>{pad(i + 1)}</span>{b.title}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- one venture as a dashboard ---------- */
function Dashboard({ v, n }) {
  const b = v.brand;
  const [ref, seen] = useInView(0.08);
  const [shot, setShot] = useState(0);
  const isTrip = !!v.tiers;
  return (
    <section
      ref={ref}
      id={b.chapter}
      className={`vz-dash vz-${b.key} ${seen ? "is-in" : ""}`}
      style={{ "--a": v.accent, "--a2": v.accent2, "--fx-c": v.accent }}
      data-nav="dark"
    >
      <div className="vz-dash-glow" aria-hidden="true" />
      <Aurora colors={[v.accent, v.accent2, v.accent]} className="is-soft" />
      <div className="vz-wrap">
        {/* header */}
        <header className="vz-head">
          <span className="vz-no">{pad(n)} / {pad(VENTURES.length)}</span>
          <div className="vz-head-row">
            <Mark brand={b} size={64} />
            <div className="vz-head-txt">
              <span className="vz-cat">{b.category}</span>
              <h2>{b.title}</h2>
            </div>
            <a className="vz-visit" href={b.link} target="_blank" rel="noopener noreferrer">{b.domain} <Arrow /></a>
          </div>
          <p className="vz-line">{v.line}</p>
        </header>

        {/* bento */}
        <div className={`vz-bento ${isTrip ? "is-trip" : "is-px"}`}>
          <Tile className="t-screen" i={0} label="// live site">
            {v.shots.length > 1 && (
              <div className="vz-tabs" role="tablist" aria-label={`${b.title} screens`}>
                {v.shots.map(([label], k) => (
                  <button type="button" role="tab" key={label} aria-selected={k === shot} className={k === shot ? "is-on" : ""} onClick={() => setShot(k)}>{label}</button>
                ))}
              </div>
            )}
            <div className="vz-browser fx-border">
              <div className="vz-bar"><span><i /><i /><i /></span><em>{b.domain}</em><span className="vz-live"><i />Live</span></div>
              <div className="vz-screens">
                {v.shots.map(([label, src], k) => (
                  <img key={src} src={src} alt={k === shot ? `${b.title}: ${label}` : ""} className={k === shot ? "is-on" : ""} loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
          </Tile>

          <Tile className="t-about" i={1} label="// what it does">
            <p>{v.about}</p>
          </Tile>

          <Tile className="t-phone" i={2} label="// mobile">
            <div className="vz-phone"><img src={v.mobile} alt={`${b.title} on a phone`} loading="lazy" decoding="async" /></div>
          </Tile>

          <Tile className="t-offers" i={3} label={`// ${v.offerLabel.toLowerCase()}`}>
            <ul className="vz-offers">
              {v.offers.map(([icon, t], k) => (
                <li key={t} style={{ "--k": k }}>
                  <span className="vz-offer-ico"><Ico name={icon} /></span>
                  <span className="vz-offer-no">{pad(k + 1)}</span>
                  <b>{t}</b>
                </li>
              ))}
            </ul>
          </Tile>

          {isTrip && (
            <Tile className="t-tiers" i={4} label="// travel tiers">
              <div className="vz-tiers">
                {v.tiers.map((t, k) => (
                  <div key={t} className="vz-tier" style={{ "--k": k }}>
                    <span>{pad(k + 1)}</span>
                    <b>{t}</b>
                    <i aria-hidden="true" />
                  </div>
                ))}
              </div>
            </Tile>
          )}

          {isTrip && (
            <Tile className="t-dest" i={5} label={`// destinations · ${v.destinations.length}`}>
              <div className="vz-marquee">
                <div className="vz-marquee-track">
                  {[0, 1].map((k) => (
                    <span key={k} aria-hidden={k === 1}>
                      {v.destinations.map((d) => <span key={d} className="vz-chip">{d}</span>)}
                    </span>
                  ))}
                </div>
              </div>
            </Tile>
          )}
        </div>
      </div>
    </section>
  );
}

function Closing({ nav }) {
  return (
    <section className="vz-end" data-nav="dark">
      <Aurora colors={["#8b5cf6", "#ec4899", "#06b6d4"]} className="is-soft" />
      <div className="vz-wrap vz-end-in">
        <span className="vz-kicker">Quenchmark</span>
        <h2>Open a <span className="fx-gradient-text">venture.</span></h2>
        <div className="vz-end-links">
          {VENTURES.map(({ brand: b, accent }) => (
            <a key={b.key} href={b.link} target="_blank" rel="noopener noreferrer" style={{ "--a": accent }}>
              <Mark brand={b} size={40} />
              <span><b>{b.title}</b><em>{b.domain}</em></span>
              <Arrow />
            </a>
          ))}
        </div>
        <div className="vz-end-actions">
          <button type="button" className="vz-btn vz-btn-solid" onClick={nav.contact}>Contact us <Arrow d={RIGHT} /></button>
          <button type="button" className="vz-btn" onClick={() => nav.open("technologies")}>See Technologies</button>
        </div>
      </div>
    </section>
  );
}

export function VenturesPage({ nav }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const bodyRef = useRef(null);

  // which venture is on screen, and whether the dock should show
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      const vh = window.innerHeight;
      let next = 0;
      VENTURES.forEach(({ brand }, i) => {
        const el = document.getElementById(brand.chapter);
        if (el && el.getBoundingClientRect().top <= vh * 0.5) next = i;
      });
      setActive((prev) => (prev === next ? prev : next));
      const body = bodyRef.current;
      if (body) {
        const r = body.getBoundingClientRect();
        const on = r.top < vh * 0.6 && r.bottom > vh * 0.5;
        setShown((prev) => (prev === on ? prev : on));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(probe); };
    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) nav.scrollToY(el.getBoundingClientRect().top + window.scrollY - 60);
  };

  return (
    <main className="vz">
      <Hero onJump={jump} />
      <div className="vz-body" ref={bodyRef}>
        <Switcher active={active} shown={shown} onJump={jump} />
        {VENTURES.map((v, i) => <Dashboard key={v.brand.key} v={v} n={i + 1} />)}
      </div>
      <Closing nav={nav} />
    </main>
  );
}
