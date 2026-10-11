import { Fragment, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import "./App.css";
import { ventures, products } from "./brands";
import { TechnologiesPage, HomeHero, VenturesTeaser } from "./Showcase";
import { VenturesPage } from "./VenturesPage";
import { TechTeaser, ClosingCTA } from "./HomeSections";

const logoImg = "/quenchmark-logo.png";

const positions = [
  { title: "HR & Operations", dept: "People", type: "Full-time" },
  { title: "Graphic Designer", dept: "Design", type: "Full-time" },
  { title: "Web Developer", dept: "Engineering", type: "Full-time" },
  { title: "AI Research", dept: "Research", type: "Full-time" },
  { title: "SEO & Content Writing", dept: "Marketing", type: "Full-time" },
];

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
  }, []);
  return <canvas ref={ref} className="hero-three" aria-hidden="true" />;
}

/* 3D connected globe (routes + nodes) rotating behind the statement (three.js) */
function StatementThree() {
  const ref = useRef(null);
  useEffect(() => {
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
  }, []);
  return <canvas ref={ref} className="stmt-three" aria-hidden="true" />;
}

/* types out text part-by-part with a blinking caret */
function Typewriter({ parts, speed = 42, startDelay = 350, onDone }) {
  const total = parts.reduce((s, p) => s + p.text.length, 0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    let i = 0, timer;
    const startId = setTimeout(function tick() {
      i += 1;
      setCount(i);
      if (i < total) timer = setTimeout(tick, speed);
      else if (onDone) timer = setTimeout(onDone, 450);
    }, startDelay);
    return () => { clearTimeout(startId); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let remaining = count;
  return (
    <>
      {parts.map((p, idx) => {
        const show = Math.max(0, Math.min(p.text.length, remaining));
        remaining -= p.text.length;
        const slice = p.text.slice(0, show);
        if (!slice) return null;
        return p.className
          ? <span key={idx} className={p.className}>{slice}</span>
          : <span key={idx}>{slice}</span>;
      })}
      {count < total && <span className="tw-caret" aria-hidden="true" />}
    </>
  );
}

/* light / dark switch — the choice is saved and applied before paint (see index.html) */
function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-anim"), 450);
    try { localStorage.setItem("qm-theme", next); } catch { /* storage blocked: theme still applies for this visit */ }
    setTheme(next);
  };
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={flip}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
    >
      <span className={`tt-icon ${dark ? "" : "is-on"}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      </span>
      <span className={`tt-icon ${dark ? "is-on" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      </span>
    </button>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar({ nav, page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("creme");
  // [label, target, kind] — "section" scrolls the home page, "page" opens a full page
  const links = [
    ["Home", "home", "section"], ["About", "about", "section"], ["Ventures", "ventures", "page"],
    ["Technologies", "technologies", "page"], ["Approach", "approach", "section"],
  ];
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
      <nav className={`nav nav-theme-${theme}`}>
        <button type="button" className="brand brand-button" onClick={() => { nav.section("home"); close(); }} aria-label="Quenchmark home">
          <span className="brand-logo-wrap">
            <img src={logoImg} alt="Quenchmark" className="brand-logo" />
          </span>
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map(([label, id, kind]) => (
            <li key={id}>
              <button
                type="button"
                className={kind === "page" && page === id ? "is-current" : ""}
                onClick={() => { if (kind === "page") nav.open(id); else nav.section(id); close(); }}
              >
                {label}
              </button>
            </li>
          ))}
          <li><button type="button" onClick={() => { nav.contact(); close(); }}>Contact</button></li>
          <li className="nav-mobile-only"><button type="button" onClick={() => { nav.careers(); close(); }}>Careers</button></li>
        </ul>

        <div className="nav-right">
          <ThemeToggle />
          <button className="btn btn-solid nav-cta" onClick={() => nav.careers()}>Careers</button>
        </div>

        <button className={`burger ${menuOpen ? "open" : ""}`} aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </nav>
    </header>
  );
}

/* ---------- FOOTER ---------- */
function Footer({ nav }) {
  return (
    <footer className="footer" data-nav="creme">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-logo-wrap">
              <img src={logoImg} alt="Quenchmark" className="brand-logo" />
            </span>
          </div>
          <p>Building and scaling digital-first ventures across cybersecurity, AI, finance, travel, SaaS and automation.</p>
          <div className="footer-contact">
            <a href="mailto:official@quenchmark.org">official@quenchmark.org</a>
            <span>India-based, global vision</span>
          </div>
        </div>
        <div className="footer-col">
          <h4>Ventures</h4>
          {ventures.map((v) => (
            <button type="button" key={v.key} onClick={() => nav.open("ventures", v.chapter)}>{v.title}</button>
          ))}
        </div>
        <div className="footer-col">
          <h4>Technologies</h4>
          {products.map((p) => (
            <button type="button" key={p.key} onClick={() => nav.open("technologies", p.chapter)}>{p.title}</button>
          ))}
        </div>
        <div className="footer-col">
          <h4>What we do</h4>
          <button type="button" onClick={() => nav.open("ventures", "v-parameterx")}>Cybersecurity</button>
          <button type="button" onClick={() => nav.open("ventures", "v-tripsoul")}>Travel</button>
          <button type="button" onClick={() => nav.open("technologies")}>SaaS products</button>
          <button type="button" onClick={() => nav.section("approach")}>Our approach</button>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <button type="button" onClick={() => nav.section("about")}>About</button>
          <button type="button" onClick={() => nav.contact()}>Contact</button>
          <button type="button" onClick={() => nav.careers()}>Careers</button>
          <a href="mailto:official@quenchmark.org">Email Us</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Quenchmark. All rights reserved.</span>
        <span>Building digital futures.</span>
      </div>
    </footer>
  );
}

const flow = [
  { title: "Discover", desc: "We identify untapped market opportunities through deep research and analysis." },
  { title: "Design", desc: "Architect scalable solutions with user-centric design and cutting-edge tech." },
  { title: "Build", desc: "Develop and iterate rapidly with agile methodologies and quality-first approach." },
  { title: "Scale", desc: "Deploy, monitor, and optimize for growth with data-driven strategies." },
];

const values = [
  { title: "Build to last", desc: "We engineer ventures for durability — real businesses, not vanity metrics." },
  { title: "Ship with conviction", desc: "A bias to action. We move fast, decide clearly, and back ourselves." },
  { title: "Honest by default", desc: "Transparency with partners, candor with our teams, trust with users." },
  { title: "People over hype", desc: "Great teams build great companies — so we invest in people first." },
];

/* a titled numbered list that drops down / folds up via a toggle */
function NumColumn({ kicker, title, items, variant }) {
  const [open, setOpen] = useState(false);
  const colRef = useRef(null);
  // auto-fold when the column scrolls out of view (only after it has been seen,
  // so a column opened from the nav isn't closed before you arrive)
  useEffect(() => {
    const el = colRef.current;
    if (!el) return;
    let seen = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) seen = true;
        else if (seen) setOpen(false);
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // the nav's "Approach" link opens every column
  useEffect(() => {
    const openAll = () => setOpen(true);
    window.addEventListener("qm:open-approach", openAll);
    return () => window.removeEventListener("qm:open-approach", openAll);
  }, []);
  return (
    <Reveal className="m2-col" variant={variant}>
      <span className="kicker">{kicker}</span>
      <h2 className="m2-title">{title}</h2>
      <button
        className={`flow-toggle ${open ? "is-open" : ""}`}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{open ? "Close flow" : "Open the flow"}</span>
        <span className="flow-count">{items.length}</span>
        <svg className="m2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div className={`num-collapse ${open ? "" : "is-closed"}`} ref={colRef}>
        <div className={`num-list ${open ? "is-open" : "is-closed"}`}>
          {items.map((it, i) => (
            <div className="num-item" key={it.title} style={{ "--i": i }}>
              <span className="num3d">{String(i + 1).padStart(2, "0")}</span>
              <div className="num-text">
                <h4>{it.title}</h4>
                <p>{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- ABOUT: a staged entrance — heading words rise, the highlight sweeps,
   sector tags pop in, then the three principles are drawn in sequence ---------- */
const ABOUT_SECTORS = ["Cybersecurity", "AI products", "Financial research", "Travel tech", "SaaS platforms", "Automation"];
const ABOUT_PRINCIPLES = ["Create focused companies", "Operate with discipline", "Scale through systems"];
function AboutSection() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const lead = "A multi-venture company building practical".split(" ");
  const mark = "digital businesses.".split(" ");
  return (
    <section ref={ref} className={`hs hs-cream about-anim ${inView ? "is-in" : ""}`} id="about" data-nav="sand">
      <span className="about-orb" aria-hidden="true" />
      <div className="about-premium">
        <div className="about-premium-copy">
          <span className="kicker">03 — About Quenchmark</span>
          <h2 aria-label="A multi-venture company building practical digital businesses.">
            {lead.map((w, i) => (
              <Fragment key={i}><span className="aw" aria-hidden="true"><span style={{ "--i": i }}>{w}</span></span>{" "}</Fragment>
            ))}
            <span className="about-mark" aria-hidden="true">
              {mark.map((w, i) => (
                <Fragment key={w}><span className="aw"><span style={{ "--i": lead.length + i }}>{w}</span></span>{i < mark.length - 1 ? " " : ""}</Fragment>
              ))}
            </span>
          </h2>
          <p>
            Quenchmark is a multi-venture company focused on creating, operating and scaling high-value digital businesses. We work across cybersecurity, AI-powered products, financial research, travel technology, SaaS platforms and automation-driven solutions.
          </p>
          {/* sectors scroll continuously left → right; the list is doubled for a seamless loop */}
          <div className="about-marquee" aria-label="Sectors we work in">
            <ul className="about-marquee-track">
              {[0, 1].map((copy) =>
                ABOUT_SECTORS.map((t) => (
                  <li key={`${copy}-${t}`} aria-hidden={copy === 1}>{t}</li>
                ))
              )}
            </ul>
          </div>
        </div>
        <ol className="about-principles">
          <span className="about-thread" aria-hidden="true" />
          {ABOUT_PRINCIPLES.map((title, i) => (
            <li className="principle" key={title} style={{ "--i": i }}>
              <span className="principle-num" aria-hidden="true">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <span className="principle-text">
                <strong>{title}</strong>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- HOME ---------- */
function Home({ nav }) {
  return (
    <>
      <HeroThree />
      {/* 00 — hero */}
      <HomeHero nav={nav} />

      {/* 01 — ventures: photo showcase; the full story lives on its own page */}
      <VenturesTeaser onOpen={(chapter) => nav.open("ventures", chapter)} />

      {/* 02 — technologies: the product arm, with real product screens */}
      <TechTeaser onOpen={(chapter) => nav.open("technologies", chapter)} />

      {/* 03 — about + how we work */}
      <AboutSection />

      {/* MISSION & HOW WE WORK */}
      <section className="band band-mist zoom-sec" id="approach" data-nav="pink">
        <div className="m2-grid">
          <NumColumn
            kicker="Our Mission"
            title="One vision — ventures that outlast the trend."
            items={values}
            variant="left"
          />
          <NumColumn
            kicker="How We Work"
            title="From spark to scale, a disciplined path."
            items={flow}
            variant="right"
          />
        </div>
      </section>

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
          <h2 className="statement statement-shimmer">
            Travel smarter. Scale efficiently. Trade intelligently.
          </h2>
        </Reveal>
      </section>

      {/* LEADERSHIP */}
      <section className="band band-mist zoom-sec premium-section" data-nav="pink">
        <div className="leadership">
          <Reveal className="leadership-copy" variant="left">
            <span className="kicker">Leadership</span>
            <h2>Built with a founder-led vision</h2>
            <p>
              Prince Saini is the Founder of Quenchmark, building technology-driven ventures across AI, SaaS, travel, and digital products. He focuses on creating scalable businesses that solve real-world problems through innovation and thoughtful execution.
            </p>
          </Reveal>
          <Reveal className="founder-card" delay={120}>
            <span className="founder-initials">PS</span>
            <h3>Prince Saini</h3>
            <strong>Founder, Quenchmark</strong>
            <p>Entrepreneur | Venture Builder | Product Founder</p>
          </Reveal>
        </div>
      </section>

      {/* closing call to action */}
      <ClosingCTA nav={nav} />
    </>
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
function ContactPage() {
  const [showThanks, setShowThanks] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
    setShowThanks(true);
  };
  return (
    <main className="screen" data-nav="creme">
      <div className="aurora" />
      <div className="hero-grain" />
      <div className="screen-inner contact-split">
        <Reveal className="contact-intro">
          <span className="kicker">Contact Us</span>
          <h2>Let's build something <span className="hl">together.</span></h2>
          <p>
            Ready to scale your venture with Quenchmark? Connect with Us Today.
          </p>
          <ul className="contact-points">
            <li><span>Email</span>official@quenchmark.org</li>
            <li><span>Based in</span>India 🇮🇳</li>
            <li><span>Response</span>Within 24 hours</li>
          </ul>
        </Reveal>

        <Reveal className="contact-card" delay={120}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Full Name <span>*</span></label>
              <input type="text" required placeholder="Your full name" />
            </div>
            <div className="field">
              <label>Email Address <span>*</span></label>
              <input type="email" required placeholder="you@example.com" />
            </div>
            <div className="field">
              <label>Phone Number <span>*</span></label>
              <input type="tel" required placeholder="+91 98765 43210" />
            </div>
            <div className="field">
              <label>Company <em>(Optional)</em></label>
              <input type="text" placeholder="Company name" />
            </div>
            <div className="field field-full">
              <label>Your Message <span>*</span></label>
              <textarea required rows="3" placeholder="Tell us a bit about what you're looking for..."></textarea>
            </div>
            <button type="submit" className="btn btn-solid form-submit">Submit →</button>
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

/* ---------- CAREERS PAGE ---------- */
function CareersPage({ nav }) {
  return (
    <main className="screen" data-nav="creme">
      <div className="aurora" />
      <div className="hero-grain" />
      <div className="screen-inner careers-inner">
        <Reveal>
          <span className="kicker">Careers · We're Hiring</span>
          <h2>Build the future <span className="hl">with us.</span></h2>
          <p className="careers-sub">Curious, driven people wanted across these open roles.</p>
        </Reveal>
        <Reveal className="positions-head" delay={60}>
          <span className="positions-count">{positions.length} open roles</span>
          <span className="positions-note">All roles are remote-friendly</span>
        </Reveal>
        <div className="positions">
          {positions.map((p, i) => (
            <Reveal key={p.title} delay={120 + i * 60} className="position-row">
              <div className="position">
                <span className="position-dept">{p.dept}</span>
                <h3 className="position-title">{p.title}</h3>
                <span className="position-type">{p.type}</span>
                <button
                  className="btn btn-solid position-apply"
                  onClick={() => window.open("https://forms.gle/HAvVvmagcmJvxzn88", "_blank", "noopener,noreferrer")}
                >
                  Apply →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="careers-cta" delay={140 + positions.length * 60}>
          <span className="careers-cta-text">
            Don&apos;t see a role that fits? We&apos;d still like to hear from you.
          </span>
          <button type="button" className="btn btn-outline careers-cta-btn" onClick={() => nav.contact()}>
            Contact us for more info →
          </button>
        </Reveal>
      </div>
    </main>
  );
}

/* ---------- APP (lightweight page switcher) ---------- */
function App() {
  const [page, setPage] = useState("home");
  const [pendingSection, setPendingSection] = useState(null);
  const [intro, setIntro] = useState("typing"); // typing -> moving -> done
  const lenisRef = useRef(null);

  // buttery momentum scrolling
  useEffect(() => {
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
    if (id === "approach") {
      // open both "flow" dropdowns, and land the section's top under the navbar
      window.dispatchEvent(new Event("qm:open-approach"));
      // land just under the floating navbar; measured after the open state renders
      requestAnimationFrame(() => {
        const nav = document.querySelector(".nav-wrap");
        const navH = nav ? nav.offsetHeight + 12 : 112;
        const y = el.getBoundingClientRect().top + window.scrollY - navH;
        if (lenis) lenis.scrollTo(y, immediate ? { immediate: true } : { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: "smooth" });
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

  const nav = {
    section: (id) => {
      if (page === "home") {
        scrollToSection(id);
      } else {
        setPendingSection(id);
        setPage("home");
      }
    },
    /* open a full page (ventures / technologies), optionally at a chapter */
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
    contact: () => setPage("contact"),
    careers: () => setPage("careers"),
  };
  const fullPage = page === "home" || page === "ventures" || page === "technologies";

  return (
    <>
      {intro !== "done" && (
        <div className={`intro ${intro === "moving" ? "intro-exit" : ""}`}>
          <h1 className="intro-title">
            <Typewriter
              parts={[
                { text: "Powerful businesses, built " },
                { text: "under one vision.", className: "hl" },
              ]}
              onDone={() => {
                setIntro("moving");
                setTimeout(() => setIntro("done"), 1000);
              }}
            />
          </h1>
        </div>
      )}
      <div className={`page ${fullPage ? "" : "page-locked"} ${intro === "typing" ? "page-hidden" : "revealed"}`}>
        <Navbar nav={nav} page={page} />
        {page === "home" && <Home nav={nav} />}
        {page === "ventures" && <VenturesPage nav={nav} />}
        {page === "technologies" && <TechnologiesPage nav={nav} />}
        {page === "contact" && <ContactPage />}
        {page === "careers" && <CareersPage nav={nav} />}
        {fullPage ? <Footer nav={nav} /> : <MiniFooter />}
      </div>
    </>
  );
}

export default App;
