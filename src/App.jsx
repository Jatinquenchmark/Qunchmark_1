import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "./App.css";
import { products } from "./brands";
import { TechnologiesPage, HomeHero } from "./Showcase";
import { VenturesPage } from "./VenturesPage";
import { TechTeaser, ClosingCTA } from "./HomeSections";
import { ReachUsPage } from "./ReachUs";
import { validateEnquiry, GENERAL_ENQUIRY, PUBLIC_EMAIL, whatsappLink, WHATSAPP_DISPLAY } from "./lib/enquiry";
import { WhatsAppFloat, WhatsAppIcon } from "./WhatsApp";
import { keyFromPath, metaFor, SITE } from "./site/routes.js";
import { Link } from "./site/nav.jsx";
import { NavContext } from "./site/nav-context.js";
import { attribution, captureAttribution, installClickTracking, track } from "./lib/track";
import { SERVICES } from "./content/services.js";
import { ServicesIndex, ServicePage } from "./pages/Services.jsx";
import { BrokrSuitePage } from "./pages/BrokrSuite.jsx";
import { WorkPage } from "./pages/Work.jsx";
import { IndustriesPage } from "./pages/Industries.jsx";
import { InsightsIndex, ArticlePage } from "./pages/Insights.jsx";
import { AboutPage } from "./pages/About.jsx";
import { PrivacyPage, TermsPage, NotFoundPage } from "./pages/Legal.jsx";
import { ServicesOverview, BrokrHome, HomeProcess, IndustriesStrip, WhyUs, HomeFaq } from "./pages/HomeExtras.jsx";

const logoImg = "/quenchmark-logo.png";

/* keep <head> in step with the current page (the prerendered HTML already has
   the right tags; this keeps them correct as visitors navigate in-app) */
function applyHead(meta) {
  document.title = meta.title;
  const set = (selector, attr, value, create) => {
    let el = document.head.querySelector(selector);
    if (!el && create) { el = create(); document.head.appendChild(el); }
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", meta.description);
  set('link[rel="canonical"]', "href", meta.canonical);
  set('meta[property="og:url"]', "content", meta.canonical);
  set('meta[property="og:title"]', "content", meta.title);
  set('meta[property="og:description"]', "content", meta.description);
  set('meta[property="og:type"]', "content", meta.ogType || "website");
  set('meta[name="twitter:title"]', "content", meta.title);
  set('meta[name="twitter:description"]', "content", meta.description);
  set('meta[name="robots"]', "content", meta.noindex ? "noindex, follow" : "index, follow");
  document.head.querySelectorAll("script[data-ld]").forEach((n) => n.remove());
  for (const obj of meta.ld || []) {
    const sc = document.createElement("script");
    sc.type = "application/ld+json";
    sc.dataset.ld = "";
    sc.textContent = JSON.stringify(obj);
    document.head.appendChild(sc);
  }
}

/* reveal-on-scroll wrapper */
function Reveal({ children, className = "", delay = 0, variant = "up" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal reveal-${variant} ${shown ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* soft, premium ambient atmosphere — slow warm light motes drifting in 3D
   (three.js). Site-wide background that gently re-tints to the section in view. */
const HERO_VERT = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uSize;
  attribute float aSpeed;
  attribute float aPhase;
  attribute float aScale;
  varying float vGlow;
  void main() {
    vec3 p = position;
    float range = 14.0;
    // slow upward drift, wrapping; scroll nudges it along
    p.y = mod(position.y + uTime * aSpeed * 0.4 + uScroll * aSpeed * 3.0 + range * 0.5, range) - range * 0.5;
    // lazy lateral sway
    p.x += sin(uTime * 0.18 + aPhase) * 0.5;
    // a soft glow gathers under the cursor
    float d = distance(p.xz, uMouse);
    float near = exp(-d * d * 0.05) * uHover;
    float twinkle = (sin(uTime * 0.7 + aPhase) * 0.5 + 0.5) * 0.18;
    vGlow = clamp(near + twinkle, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * (1.0 + near * 1.8) / -mv.z;
  }
`;
const HERO_FRAG = `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vGlow;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d); // feathered round mote
    vec3 col = mix(uColorA, uColorB, vGlow);
    gl_FragColor = vec4(col, soft * (0.055 + vGlow * 0.24));
  }
`;
// subtle tint per section theme — the atmosphere shifts faintly as you scroll
const THEME_GLOW = {
  creme: "#a9b0c2",
  sand: "#a3abc0",
  pink: "#adb3c6",
  dark: "#8f97b0",
};
function HeroThree() {
  const ref = useRef(null);
  useEffect(() => {
    // three.js is fetched on demand, so it never weighs down the other pages
    let dead = false;
    let cleanup = () => {};
    function setup(THREE) {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25); // soft motes: no need for full retina
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    // a cloud of soft motes scattered through a 3D volume
    const COUNT = 420;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    const rand = (a, b) => a + Math.random() * (b - a);
    for (let k = 0; k < COUNT; k++) {
      positions[k * 3] = rand(-13, 13);
      positions[k * 3 + 1] = rand(-7, 7);
      positions[k * 3 + 2] = rand(-6, 5);
      speeds[k] = rand(0.3, 1.1);
      phases[k] = rand(0, Math.PI * 2);
      scales[k] = rand(0.45, 1.6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uHover: { value: 0 },
      uSize: { value: 17 * dpr },
      uColorA: { value: new THREE.Color("#a6adbd") }, // soft cool-grey base
      uColorB: { value: new THREE.Color(THEME_GLOW.creme) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: HERO_VERT,
      fragmentShader: HERO_FRAG,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0 plane
    const ndc = new THREE.Vector2(999, 999);
    const hit = new THREE.Vector3();
    let hoverTarget = 0;
    const camTarget = { x: 0, y: 0 };
    const glowTarget = new THREE.Color(THEME_GLOW.creme);

    function resize() {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    function onMove(e) {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
      hoverTarget = 1;
      camTarget.x = ndc.x * 0.6;
      camTarget.y = ndc.y * 0.4;
    }
    function onLeave() { hoverTarget = 0; camTarget.x = 0; camTarget.y = 0; }

    // re-tint to whichever section sits in the middle of the viewport
    let scrollRaf = 0;
    const navNodes = Array.from(document.querySelectorAll("[data-nav]"));
    function probe() {
      scrollRaf = 0;
      uniforms.uScroll.value = window.scrollY / (window.innerHeight || 1);
      const y = window.innerHeight / 2;
      let theme = "creme";
      for (const el of navNodes) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) theme = el.getAttribute("data-nav");
      }
      glowTarget.set(THEME_GLOW[theme] || THEME_GLOW.creme);
    }
    function onScroll() { if (!scrollRaf) scrollRaf = requestAnimationFrame(probe); }

    const startedAt = performance.now();
    let raf = 0;
    function tick() {
      // don't spend GPU time while the tab is in the background
      if (document.hidden) { raf = requestAnimationFrame(tick); return; }
      const t = (performance.now() - startedAt) / 1000;
      uniforms.uTime.value = reduce ? 0 : t;
      uniforms.uHover.value += (hoverTarget - uniforms.uHover.value) * 0.05;
      uniforms.uColorB.value.lerp(glowTarget, 0.04);
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        uniforms.uMouse.value.set(hit.x, hit.y);
      }
      camera.position.x += (camTarget.x - camera.position.x) * 0.04;
      camera.position.y += (camTarget.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }

    resize();
    probe();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
    }
    import("./three-lite.js").then((THREE) => { if (!dead) cleanup = setup(THREE) || cleanup; });
    return () => { dead = true; cleanup(); };
  }, []);
  return <canvas ref={ref} className="hero-three" aria-hidden="true" />;
}

/* 3D connected globe (routes + nodes) rotating behind the statement (three.js) */
function StatementThree() {
  const ref = useRef(null);
  useEffect(() => {
    // three.js is fetched on demand, so it never weighs down the other pages
    let dead = false;
    let cleanup = () => {};
    function setup(THREE) {
    const canvas = ref.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // a connected globe: travel routes / a scaling network / trade links
    const group = new THREE.Group();
    scene.add(group);
    const R = 2;
    const onSphere = (r) => {
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u, phi = Math.acos(2 * v - 1);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(R, 30, 20),
      new THREE.MeshBasicMaterial({ color: 0xcaa063, wireframe: true, transparent: true, opacity: 0.14 })
    );
    group.add(sphere);

    // city nodes on the surface
    const NODES = 80;
    const npos = new Float32Array(NODES * 3);
    const nodeVecs = [];
    for (let i = 0; i < NODES; i++) {
      const p = onSphere(R * 1.01);
      nodeVecs.push(p);
      npos[i * 3] = p.x; npos[i * 3 + 1] = p.y; npos[i * 3 + 2] = p.z;
    }
    const ngeo = new THREE.BufferGeometry();
    ngeo.setAttribute("position", new THREE.BufferAttribute(npos, 3));
    const nodes = new THREE.Points(
      ngeo,
      new THREE.PointsMaterial({ color: 0xe6cfa2, size: 0.05, transparent: true, opacity: 0.55 })
    );
    group.add(nodes);

    // arcs connecting nodes — routes / links bulging off the surface
    const arcMat = new THREE.LineBasicMaterial({ color: 0xd9b06a, transparent: true, opacity: 0.4 });
    for (let i = 0; i < 8; i++) {
      const a = nodeVecs[(Math.random() * NODES) | 0];
      const b = nodeVecs[(Math.random() * NODES) | 0];
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.5);
      const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(36);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat));
    }
    group.rotation.x = -0.2;

    let mx = 0, my = 0;
    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 2 - 1;
      my = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    let raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(host);
    const startedAt = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return; // pause render while offscreen
      const t = reduce ? 0 : (performance.now() - startedAt) / 1000;
      group.rotation.y = t * 0.16 + mx * 0.45;
      group.rotation.x = -0.2 + my * 0.3;
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    resize();
    tick();
    window.addEventListener("resize", resize);
    host.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      host.removeEventListener("mousemove", onMove);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
      renderer.dispose();
    };
    }
    import("./three-lite.js").then((THREE) => { if (!dead) cleanup = setup(THREE) || cleanup; });
    return () => { dead = true; cleanup(); };
  }, []);
  return <canvas ref={ref} className="stmt-three" aria-hidden="true" />;
}

/* ---------- NAVBAR ---------- */
const NAV_LINKS = [
  ["Services", "/services", (p) => p === "services" || p.startsWith("service:")],
  ["BrokrSuite", "/brokrsuite", (p) => p === "brokrsuite"],
  ["Work", "/work", (p) => p === "work" || p === "technologies" || p === "ventures"],
  ["Industries", "/industries", (p) => p === "industries"],
  ["Insights", "/insights", (p) => p === "insights" || p.startsWith("insight:")],
  ["About", "/about", (p) => p === "about"],
];

function Navbar({ page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("creme");
  const close = () => setMenuOpen(false);

  // match the navbar colour to whichever section sits under it
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll("[data-nav]"));
    let raf = 0, last = "";
    const probe = () => {
      raf = 0;
      const y = 54; // a point just under the floating navbar
      let next = "creme";
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) next = el.getAttribute("data-nav");
      }
      if (next !== last) { last = next; setTheme(next); }
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
  }, [page]);

  return (
    <header className="nav-wrap">
      <nav className={`nav nav-theme-${theme}`} aria-label="Main">
        <Link to="/" className="brand brand-button" onClick={close} aria-label="QuenchMark Technologies home">
          <span className="brand-logo-wrap">
            <img src={logoImg} alt="QuenchMark" className="brand-logo" width="160" height="48" />
          </span>
        </Link>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`} id="primary-nav">
          {NAV_LINKS.map(([label, to, isCurrent]) => (
            <li key={to}>
              <Link to={to} className={isCurrent(page) ? "is-current" : ""} aria-current={isCurrent(page) ? "page" : undefined} onClick={close}>{label}</Link>
            </li>
          ))}
          <li className="nav-mobile-only"><Link to="/contact" onClick={close}>Contact</Link></li>
          <li className="nav-mobile-only"><Link to="/reach-us#enquiry" className={page === "reach-us" ? "is-current" : ""} onClick={close} data-cta="nav-mobile-quote">Get a Free Quote</Link></li>
        </ul>

        <div className="nav-right">
          <Link to="/reach-us#enquiry" className="btn btn-solid nav-cta" aria-current={page === "reach-us" ? "page" : undefined} data-cta="nav-quote">Get a Free Quote</Link>
        </div>

        <button className={`burger ${menuOpen ? "open" : ""}`} aria-label="Menu" aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="footer" data-nav="creme">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="QuenchMark Technologies home">
            <span className="brand-logo-wrap">
              <img src={logoImg} alt="QuenchMark" className="brand-logo" width="160" height="48" loading="lazy" />
            </span>
          </Link>
          <p>{SITE.name} — {SITE.tagline.charAt(0).toLowerCase() + SITE.tagline.slice(1)}</p>
          <div className="footer-contact">
            <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
            <a className="wa-inline" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp {WHATSAPP_DISPLAY}</a>
            <span>Based in India · Working worldwide</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          {SERVICES.slice(0, 7).map((s) => <Link key={s.slug} to={`/services/${s.slug}`}>{s.name}</Link>)}
          <Link to="/services">All services →</Link>
        </div>
        <div className="footer-col">
          <h4>BrokrSuite</h4>
          <Link to="/brokrsuite">Real estate CRM</Link>
          <Link to="/brokrsuite#demo" data-cta="footer-brokr-demo">Book a demo</Link>
          <a href="https://apps.apple.com/in/app/brokrsuite/id6807412019" target="_blank" rel="noopener noreferrer">App Store</a>
          <a href="https://play.google.com/store/apps/details?id=com.brokrsuite.app" target="_blank" rel="noopener noreferrer">Google Play</a>
          <a href="https://www.brokrsuite.in" target="_blank" rel="noopener">brokrsuite.in</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/work">Our work</Link>
          {products.filter((p) => p.key !== "brokr").map((p) => <Link key={p.key} to="/technologies">{p.title}</Link>)}
          <Link to="/ventures">Ventures</Link>
          <Link to="/industries">Industries</Link>
          <Link to="/insights">Insights</Link>
        </div>
        <div className="footer-col">
          <h4>Get in touch</h4>
          <Link to="/reach-us#enquiry" data-cta="footer-quote">Request a free quote</Link>
          <Link to="/contact">Contact</Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          <a href={`mailto:${PUBLIC_EMAIL}`}>Email us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {2026} {SITE.name}. All rights reserved.</span>
        <span className="footer-legal"><Link to="/privacy-policy">Privacy Policy</Link> · <Link to="/terms">Terms of Use</Link></span>
      </div>
    </footer>
  );
}

/* ---------- HOME ---------- */
function Home({ nav }) {
  return (
    <main>
      <HeroThree />
      <HomeHero nav={nav} />
      <ServicesOverview />
      <BrokrHome />
      <TechTeaser onOpen={(chapter) => nav.open("technologies", chapter)} />
      <HomeProcess />
      <IndustriesStrip />
      <WhyUs />

      {/* statement */}
      <section
        className="statement-band"
        data-nav="dark"
        onMouseMove={(e) => {
          const el = e.currentTarget;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--sx", `${e.clientX - r.left}px`);
          el.style.setProperty("--sy", `${e.clientY - r.top}px`);
          el.style.setProperty("--so", "1");
        }}
        onMouseLeave={(e) => e.currentTarget.style.setProperty("--so", "0")}
      >
        <span className="statement-spot" aria-hidden="true" />
        <StatementThree />
        <Reveal>
          <p className="statement statement-shimmer">Design it. Build it. Scale it.</p>
        </Reveal>
      </section>

      {/* LEADERSHIP */}
      <section className="band band-mist zoom-sec premium-section" data-nav="pink">
        <div className="leadership">
          <Reveal className="leadership-copy" variant="left">
            <span className="kicker">Leadership</span>
            <h2>Built with a founder-led vision</h2>
            <p>
              Prince Saini is the Founder of QuenchMark, building technology-driven products and businesses across AI, SaaS, travel and digital services. He focuses on creating scalable solutions that solve real-world problems through innovation and thoughtful execution.
            </p>
            <p><Link className="pg-link" to="/about">More about QuenchMark →</Link></p>
          </Reveal>
          <Reveal className="founder-card" delay={120}>
            <span className="founder-initials">PS</span>
            <h3>Prince Saini</h3>
            <strong>Founder, QuenchMark</strong>
            <p>Entrepreneur | Product Builder | Founder</p>
          </Reveal>
        </div>
      </section>

      <HomeFaq />
      <ClosingCTA nav={nav} />
    </main>
  );
}

/* ---------- slim footer for subpages ---------- */
function MiniFooter() {
  return (
    <footer className="mini-footer">
      <span>© 2026 Quenchmark Group</span>
      <span className="dot-sep" />
      <a href="mailto:official@quenchmark.org">official@quenchmark.org</a>
      <span className="dot-sep" />
      <span>Based in India 🇮🇳</span>
    </footer>
  );
}

/* ---------- CONTACT PAGE ---------- */
/* a short general-enquiry form; posts to the same /api/enquiry endpoint as Reach Us */
function ContactPage({ nav }) {
  const [showThanks, setShowThanks] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [message, setMessage] = useState("");
  const startedAt = useRef(0); // when the form appeared (spam time-trap)
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.target;
    const f = new FormData(form);
    const payload = {
      name: f.get("name"),
      email: f.get("email"),
      phone: f.get("phone"),
      company: f.get("company"),
      description: f.get("message"),
      service: GENERAL_ENQUIRY,
      contactMethod: "Email",
      website: f.get("website"),
      formType: "development",
      attribution: attribution(),
      elapsedMs: Date.now() - startedAt.current,
    };
    const { errors } = validateEnquiry(payload);
    const first = Object.values(errors)[0];
    if (first) { setMessage(first); setStatus("error"); return; }
    setStatus("sending");
    setMessage("");
    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok || !json.ok) throw new Error(json.error || `Something went wrong. Please email us at ${PUBLIC_EMAIL}.`);
      form.reset();
      setStatus("idle");
      setShowThanks(true);
      track("generate_lead", { lead_type: "development", service: GENERAL_ENQUIRY, form_location: "/contact" });
    } catch (err) {
      setMessage(err.message && !/fetch/i.test(err.message) ? err.message : `We couldn't reach our server. Please try again or email us at ${PUBLIC_EMAIL}.`);
      setStatus("error");
    }
  };
  return (
    <main className="screen" data-nav="creme">
      <div className="aurora" />
      <div className="hero-grain" />
      <div className="screen-inner contact-split">
        <Reveal className="contact-intro">
          <span className="kicker">Contact Us</span>
          <h1>Let&apos;s build something <span className="hl">together.</span></h1>
          <p>
            Questions, ideas or a project in mind? Send us a message and we&apos;ll reply within 24 hours.
          </p>
          <ul className="contact-points">
            <li><span>Email</span><a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a></li>
            <li><span>WhatsApp</span><a className="wa-inline" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> {WHATSAPP_DISPLAY}</a></li>
            <li><span>Based in</span>India 🇮🇳</li>
            <li><span>Response</span>Within 24 hours</li>
            <li><span>Projects</span><button type="button" className="contact-link" onClick={() => nav.reachUs()}>Start a project enquiry →</button></li>
          </ul>
        </Reveal>

        <Reveal className="contact-card" delay={120}>
          <form className="contact-form" onSubmit={handleSubmit} noValidate aria-busy={status === "sending"}>
            <div className="field">
              <label htmlFor="ct-name">Full Name <span>*</span></label>
              <input id="ct-name" name="name" type="text" autoComplete="name" required placeholder="Your full name" />
            </div>
            <div className="field">
              <label htmlFor="ct-email">Email Address <span>*</span></label>
              <input id="ct-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label htmlFor="ct-phone">Phone Number <span>*</span></label>
              <input id="ct-phone" name="phone" type="tel" autoComplete="tel" required placeholder="+91 98765 43210" />
            </div>
            <div className="field">
              <label htmlFor="ct-company">Company <em>(Optional)</em></label>
              <input id="ct-company" name="company" type="text" autoComplete="organization" placeholder="Company name" />
            </div>
            <div className="field field-full">
              <label htmlFor="ct-message">Your Message <span>*</span></label>
              <textarea id="ct-message" name="message" required rows="3" placeholder="Tell us a bit about what you're looking for..."></textarea>
            </div>
            <div className="ru-hp" aria-hidden="true">
              <label htmlFor="ct-website">Website</label>
              <input id="ct-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            {status === "error" && <p className="contact-error field-full" role="alert">{message}</p>}
            <button type="submit" className="btn btn-solid form-submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Submit →"}
            </button>
          </form>
        </Reveal>
      </div>

      {showThanks && (
        <div className="modal-overlay" onClick={() => setShowThanks(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" aria-label="Close" onClick={() => setShowThanks(false)}>×</button>
            <div className="modal-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3>Thank you!</h3>
            <p>Your message has been received. Our team will get back to you within 24 hours.</p>
            <button className="btn btn-solid" onClick={() => setShowThanks(false)}>Done</button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- which component renders for a page key ---------- */
function PageView({ page, nav }) {
  if (page.startsWith("service:")) return <ServicePage key={page} slug={page.slice(8)} />;
  if (page.startsWith("insight:")) return <ArticlePage key={page} slug={page.slice(8)} />;
  switch (page) {
    case "home": return <Home nav={nav} />;
    case "services": return <ServicesIndex />;
    case "brokrsuite": return <BrokrSuitePage />;
    case "work": return <WorkPage />;
    case "industries": return <IndustriesPage />;
    case "insights": return <InsightsIndex />;
    case "about": return <AboutPage />;
    case "ventures": return <VenturesPage nav={nav} />;
    case "technologies": return <TechnologiesPage nav={nav} />;
    case "contact": return <ContactPage nav={nav} />;
    case "reach-us": return <ReachUsPage nav={nav} />;
    case "privacy-policy": return <PrivacyPage />;
    case "terms": return <TermsPage />;
    default: return <NotFoundPage />;
  }
}

/* pages with their own scroll choreography (pinned / centred chapters) */
const LEGACY_SCROLL = new Set(["home", "ventures", "technologies"]);

/* ---------- APP (lightweight page switcher) ----------
   `initialPath` is passed by the build-time prerenderer; in the browser the
   current URL is used. */
function App({ initialPath }) {
  const [page, setPage] = useState(() => keyFromPath(initialPath ?? window.location.pathname));
  const [pendingSection, setPendingSection] = useState(() =>
    typeof window !== "undefined" && initialPath === undefined && window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : null
  );
  const lenisRef = useRef(null);

  // buttery momentum scrolling + analytics bootstrapping
  useEffect(() => {
    captureAttribution();
    installClickTracking();
    const lenis = new Lenis({
      lerp: 0.13,           // follows the wheel closely: smooth, without the trailing "lag" feel
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (id, immediate = false) => {
    const lenis = lenisRef.current;
    if (id === "home") {
      if (lenis) lenis.scrollTo(0, { duration: 1.25 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (id === "enquiry" || !LEGACY_SCROLL.has(page)) {
      // land the target just under the floating navbar (Reach Us: the form itself)
      const land = (instant) => {
        const target = id === "enquiry"
          ? (window.innerWidth <= 1000 ? el.querySelector(".ru-form-card") : el.querySelector(".ru-inner")) || el
          : el;
        const navEl = document.querySelector(".nav-wrap");
        const navH = (navEl ? navEl.offsetHeight : 96) + 16; // the navbar is sticky at top: 0
        // offsetTop ignores entrance transforms, so we land where things settle
        let top = 0;
        for (let n = target; n; n = n.offsetParent) top += n.offsetTop;
        const y = Math.max(0, top - navH);
        if (lenis) lenis.scrollTo(y, instant ? { immediate: true } : { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: instant ? "auto" : "smooth" });
      };
      requestAnimationFrame(() => {
        land(immediate);
        // arriving from another page, the layout can still shift for a moment:
        // re-measure once it settles and correct the jump
        if (immediate) setTimeout(() => land(true), 300);
      });
      return;
    }
    if (lenis) {
      // tall pinned sections align to their top; normal sections center
      const tall = el.clientHeight > window.innerHeight * 1.4;
      const offset = tall ? 2 : -(window.innerHeight - el.clientHeight) / 2;
      lenis.scrollTo(el, immediate ? { offset, immediate: true } : { offset, duration: 1.35 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (pendingSection) {
      // wait a frame so Lenis has measured the freshly rendered page
      const id = pendingSection;
      setPendingSection(null);
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      requestAnimationFrame(() => {
        if (lenisRef.current) lenisRef.current.resize();
        // jumping deep into a full page lands instantly; home keeps its glide
        scrollToSection(id, page !== "home");
      });
    } else {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: "auto" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // keep the URL and <head> in step with the page
  useEffect(() => {
    const meta = metaFor(page);
    if (page !== "notfound") {
      const current = window.location.pathname;
      if (current.replace(/\/+$/, "") !== meta.path.replace(/\/+$/, "") || (current !== "/" && current.endsWith("/"))) {
        // an old/alias URL for this same page is replaced; a new page is pushed
        const same = keyFromPath(current) === page;
        window.history[same ? "replaceState" : "pushState"]({ page }, "", meta.path + window.location.search + window.location.hash);
      }
    }
    applyHead(meta);
    track("page_view_spa", { page_path: meta.path, page_type: page.split(":")[0] });
  }, [page]);

  // browser back / forward
  useEffect(() => {
    const onPop = () => setPage(keyFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const nav = {
    /* go to any path, e.g. "/services/web-development" or "/reach-us#enquiry" or "#quote" */
    go: (to) => {
      const [path, hash] = to.split("#");
      if (!path) { if (hash) scrollToSection(hash); return; }
      const key = keyFromPath(path);
      if (key === page) scrollToSection(hash || "home");
      else { setPendingSection(hash || null); setPage(key); }
    },
    section: (id) => {
      if (page === "home") {
        scrollToSection(id);
      } else {
        setPendingSection(id);
        setPage("home");
      }
    },
    /* open a full page by key (ventures / technologies …), optionally at a chapter */
    open: (target, anchor) => {
      if (target === page) {
        if (anchor) scrollToSection(anchor);
        else scrollToSection("home");
      } else {
        setPendingSection(anchor || null);
        setPage(target);
      }
    },
    scrollToId: (id) => scrollToSection(id),
    scrollToY: (y) => {
      if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.1 });
      else window.scrollTo({ top: y, behavior: "smooth" });
    },
    contact: () => nav.go("/contact"),
    /* every "Reach Us" / "Get a quote" button lands on the enquiry form */
    reachUs: () => nav.go("/reach-us#enquiry"),
  };
  const fullPage = page !== "contact";

  return (
    <NavContext.Provider value={nav}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className={`page ${fullPage ? "" : "page-locked"} revealed`}>
        <Navbar page={page} />
        <div id="main-content" tabIndex={-1}>
          <PageView page={page} nav={nav} />
        </div>
        {fullPage ? <Footer /> : <MiniFooter />}
        <WhatsAppFloat />
      </div>
    </NavContext.Provider>
  );
}

export default App;
