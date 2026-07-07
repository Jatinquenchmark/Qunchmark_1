import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import { getProject } from "@theatre/core";
import "./App.css";
import logoImg from "./assets/quenchmark-logo.png";
import tripsoulLogo from "./assets/tripsoul-logo.png";
import parameterxLogo from "./assets/parameterx-logo.png";
import quantmentorLogo from "./assets/quantmentor-logo.png";
import tripsoulShot from "./assets/tripsoul-shot.png";
import parameterxShot from "./assets/parameterx-shot.png";
import quantmentorShot from "./assets/quantmentor-shot.png";

/* ---------- Theatre.js: cinematic hero entrance ---------- */
const tkf = (position, value, connectedRight = true) => ({
  id: `kf_${position}_${value}`.replace(/[.\-]/g, "_"),
  position, connectedRight, handles: [0.5, 0, 0.25, 1], type: "bezier", value,
});
const ttrack = (name, keyframes) => ({ type: "BasicKeyframedTrack", __debugName: name, keyframes });
const HERO_STATE = {
  sheetsById: {
    Stage: {
      staticOverrides: { byObject: {} },
      sequence: {
        subUnitsPerUnit: 30,
        length: 2.4,
        type: "PositionalSequence",
        tracksByObject: {
          Hero: {
            trackData: {
              tHmO: ttrack("hmO", [tkf(0, 0), tkf(0.85, 1)]),
              tHmY: ttrack("hmY", [tkf(0, 42), tkf(1, 0)]),
              tHmB: ttrack("hmB", [tkf(0, 14), tkf(0.8, 0)]),
              tHfO: ttrack("hfO", [tkf(0.55, 0), tkf(1.5, 1)]),
              tHfY: ttrack("hfY", [tkf(0.55, 50), tkf(1.5, 0)]),
            },
            trackIdByPropPath: {
              '["hmO"]': "tHmO",
              '["hmY"]': "tHmY",
              '["hmB"]': "tHmB",
              '["hfO"]': "tHfO",
              '["hfY"]': "tHfY",
            },
          },
        },
      },
    },
  },
  definitionVersion: "0.4.0",
  revisionHistory: [],
};

let theatreHero = null;
function setupTheatreHero() {
  if (theatreHero) return theatreHero;
  try {
    const project = getProject("Quenchmark", { state: HERO_STATE });
    const sheet = project.sheet("Stage");
    const obj = sheet.object("Hero", { hmO: 1, hmY: 0, hmB: 0, hfO: 1, hfY: 0 });
    obj.onValuesChange((v) => {
      const main = document.querySelector(".hero-main");
      const flow = document.querySelector(".hero-flow");
      if (main) {
        main.style.setProperty("--hm-o", v.hmO);
        main.style.setProperty("--hm-y", `${v.hmY}px`);
        main.style.setProperty("--hm-b", `${v.hmB}px`);
      }
      if (flow) {
        flow.style.setProperty("--hf-o", v.hfO);
        flow.style.setProperty("--hf-y", `${v.hfY}px`);
      }
    });
    theatreHero = { project, sheet };
    return theatreHero;
  } catch (e) {
    console.warn("Theatre.js hero setup failed:", e);
    return null;
  }
}

/* ---------- line icons ---------- */
const Icon = {
  travel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c0-1.1.9-2 2-2h3l5-6 2 .5L11 10h4l2-2 1.5.5L16 12l2.5 3.5L17 16l-2-2h-4l3 5.5-2 .5-5-6H4a2 2 0 0 1-2-2Z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5M4 19h16" />
      <path d="m7 14 3-3 3 2 5-6" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8a4 4 0 0 0 0 8 4 4 0 0 0 0-8Z" />
    </svg>
  ),
  down: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
};

const IMG = "https://images.unsplash.com/photo-";
const ventures = [
  {
    icon: Icon.travel, tag: "Travel Tech", category: "Travel Tech", title: "TripSoul",
    desc: "Curated premium travel experiences — personalized planning, tailored itineraries, and local expert support.",
    link: "https://www.tripsoul.org",
    logo: tripsoulLogo,
    shot: tripsoulShot,
    image: `${IMG}1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80`,
    accent: "rgba(176, 122, 60, 0.42)",
    facts: [
      { label: "Focus", value: "Premium Travel" },
      { label: "Model", value: "B2C" },
      { label: "Status", value: "Live" },
    ],
    highlights: ["Personalized trip planning", "Tailored itineraries", "On-ground local experts"],
  },
  {
    icon: Icon.shield, tag: "Cybersecurity", category: "Cybersecurity", title: "ParameterX",
    desc: "Advanced cybersecurity and technology solutions — threat detection, monitoring, and enterprise security infrastructure.",
    link: "https://www.parameterx.org",
    logo: parameterxLogo,
    logoDark: true,
    shot: parameterxShot,
    image: `${IMG}1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80`,
    accent: "rgba(42, 84, 128, 0.46)",
    facts: [
      { label: "Focus", value: "Enterprise Security" },
      { label: "Model", value: "B2B" },
      { label: "Status", value: "Live" },
    ],
    highlights: ["Real-time threat detection", "Vulnerability assessments", "Security infrastructure"],
  },
  {
    icon: Icon.chart, tag: "AI Finance", category: "AI Finance", title: "QuantMentor",
    desc: "AI-powered finance — algorithmic trading support, market analytics, and custom strategy building.",
    link: "https://www.quantmentor.org",
    logo: quantmentorLogo,
    logoDark: true,
    shot: quantmentorShot,
    image: `${IMG}1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80`,
    accent: "rgba(40, 110, 82, 0.44)",
    facts: [
      { label: "Focus", value: "AI Trading" },
      { label: "Model", value: "B2C" },
      { label: "Status", value: "Live" },
    ],
    highlights: ["Algorithmic trading support", "Market analytics", "Custom strategy building"],
  },
  {
    icon: Icon.spark, tag: "AI & Automation", category: "AI & Automation", title: "DMGennie",
    desc: "AI-powered Instagram automation — smart DM replies, lead capture, and engagement workflows for creators and businesses.",
    link: "https://www.dmgennie.org",
    live: false,
    image: `${IMG}1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=80`,
    accent: "rgba(112, 58, 130, 0.44)",
    facts: [
      { label: "Focus", value: "Social Automation" },
      { label: "Model", value: "SaaS" },
      { label: "Status", value: "Live" },
    ],
    highlights: ["Smart DM auto-replies", "Lead capture", "Engagement workflows"],
  },
];

const services = [
  { icon: Icon.travel, title: "Travel Tech", desc: "AI-driven travel platforms with smart pricing, route optimization, and curated experiences." },
  { icon: Icon.shield, title: "Cybersecurity", desc: "Enterprise-grade protection, vulnerability assessments, and real-time threat monitoring." },
  { icon: Icon.chart, title: "Algo Trading", desc: "Non-custodial algorithmic trading infrastructure with sub-second execution and custom strategies." },
  { icon: Icon.spark, title: "AI & Automation", desc: "Custom AI solutions, LLM integrations, and intelligent automation for business workflows." },
];

const features = [
  { no: "01", title: "Innovation First", desc: "We push boundaries with cutting-edge tech solutions that define the future." },
  { no: "02", title: "Scale with Purpose", desc: "Every venture we build is designed for long-term, sustainable growth." },
  { no: "03", title: "Execution Driven", desc: "Ideas are nothing without execution. We ship fast, and iterate faster." },
  { no: "04", title: "Trust & Transparency", desc: "Transparency in operations, honesty with partners, and trust with users." },
];

const reviews = [
  { name: "Aarav Mehta", role: "Startup Founder", rating: 5, date: "2 weeks ago", text: "Quenchmark transformed our security posture overnight. ParameterX is the real deal — fast, reliable, and proactive.", image: `${IMG}1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80` },
  { name: "Sara Lin", role: "Product Lead", rating: 5, date: "1 month ago", text: "Their tech-first, human-centered approach is rare. Every detail felt considered and intentional.", image: `${IMG}1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80` },
  { name: "Daniel Cruz", role: "Investor", rating: 4, date: "1 month ago", text: "From research to trading infrastructure, the depth across their ventures genuinely impressed us.", image: `${IMG}1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80` },
  { name: "Priya Nair", role: "Travel Partner", rating: 5, date: "3 weeks ago", text: "TripSoul made our itinerary effortless — the on-ground local expert support was a real game changer.", image: `${IMG}1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80` },
  { name: "Marcus Webb", role: "CTO", rating: 5, date: "2 months ago", text: "ParameterX caught vulnerabilities our previous vendor missed. The real-time monitoring is rock solid.", image: `${IMG}1463453091185-61582044d556?auto=format&fit=crop&w=200&q=80` },
  { name: "Ananya Rao", role: "Content Creator", rating: 5, date: "1 week ago", text: "DMGennie automated my DMs and tripled my lead capture. Setup took only a few minutes.", image: `${IMG}1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80` },
];
const ratingAvg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

const stats = [
  { num: 4, suffix: "+", label: "Active Ventures" },
  { num: 50, suffix: "+", label: "Team Members" },
  { num: 10, suffix: "K+", label: "Users Served" },
  { num: 99.9, suffix: "%", decimals: 1, label: "Uptime" },
];

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

/* scroll-linked cinematic zoom: each section grows as it passes through the
   viewport — recedes (small) below, full at centre, swells + fades as it exits
   upward, "zooming through" into the next section. */
function useScrollZoom() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".zoom-sec"));
    if (!els.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const dead = 0.2; // plateau where the centred section stays full-size
      // READ phase — measure every section first (one layout flush)
      const vals = els.map((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = (center - vh / 2) / vh; // 0 = centred, + below, - above
        let t = (Math.abs(d) - dead) / (1 - dead);
        t = Math.max(0, Math.min(1, t));
        // scale only (no opacity fade) — much lighter to composite while scrolling
        if (d >= 0) return { s: 1 - t * 0.05 };
        return { s: 1 + t * 0.06 };
      });
      // WRITE phase — apply all styles after reads, so no read/write thrash
      for (let i = 0; i < els.length; i++) {
        els[i].style.setProperty("--zs", vals[i].s.toFixed(4));
      }
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
  }, []);
}

/* headline that splits into words, each flipping up in 3D (plays once revealed) */
function Words3D({ segments, start = 300, step = 85, wild = false }) {
  let idx = -1;
  return (
    <span className="words3d">
      {segments.map((seg, si) =>
        seg.text.split(" ").filter(Boolean).map((w, wi) => {
          idx += 1;
          const i = idx;
          const dir = i % 2 ? 1 : -1;
          const style = wild
            ? {
                animationDelay: `${start + i * step}ms`,
                "--tx": `${dir * (70 + ((i * 23) % 60))}px`,
                "--ty": `${(((i * 13) % 3) - 1) * 52}px`,
                "--tz": `${-360 - (i % 4) * 130}px`,
                "--rx": `${(((i * 7) % 3) - 1) * 55}deg`,
                "--ry": `${dir * (50 + ((i * 29) % 40))}deg`,
                "--rz": `${dir * (8 + ((i * 11) % 10))}deg`,
              }
            : {
                animationDelay: `${start + i * step}ms`,
                "--tx": "0px",
                "--ty": "24px",
                "--tz": "-70px",
                "--rx": "-38deg",
                "--ry": "0deg",
                "--rz": "0deg",
              };
          return (
            <span className="w3d" key={`${si}-${wi}`}>
              <span
                className={`w3d-inner ${seg.className || ""}`}
                style={style}
              >
                {w}
              </span>
              {" "}
            </span>
          );
        })
      )}
    </span>
  );
}

/* heading that reveals word-by-word, each rising from behind a mask */
function SplitText({ text, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const words = text.split(" ");
  return (
    <span ref={ref} className={`split ${shown ? "is-in" : ""} ${className}`}>
      {words.map((w, i) => (
        <span className="split-word" key={i}>
          <span className="split-inner" style={{ transitionDelay: `${i * 70}ms` }}>{w}</span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/* card that tilts in 3D toward the cursor with a moving light-glare sweep */
function TiltCard({ children, className = "", max = 9 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", (-(py - 0.5) * 2 * max).toFixed(2) + "deg");
    el.style.setProperty("--ry", ((px - 0.5) * 2 * max).toFixed(2) + "deg");
    el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    el.style.setProperty("--glare", "1");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--glare", "0");
  };
  return (
    <div className="tilt" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className={`tilt-inner ${className}`}>
        {children}
        <span className="tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

/* button that leans toward the cursor and springs back on leave */
function MagneticButton({ children, className = "", onClick, strength = 0.35 }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength * 1.2).toFixed(1)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <a ref={ref} className={`btn magnetic ${className}`} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </a>
  );
}

/* count-up number that animates when scrolled into view */
function CountUp({ to, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const dur = 1500;
        let start = null;
        const tick = (ts) => {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
          else setVal(to);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

/* row of 5 stars filled to `rating` */
function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`star ${n <= rating ? "filled" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9z" />
        </svg>
      ))}
    </span>
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
    gl_FragColor = vec4(col, soft * (0.13 + vGlow * 0.5));
  }
`;
// subtle tint per section theme — the atmosphere shifts faintly as you scroll
const THEME_GLOW = {
  creme: "#b8ada2",
  sand: "#b3a695",
  pink: "#bdaba4",
  dark: "#a89e94",
};
function HeroThree() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 9);
    camera.lookAt(0, 0, 0);

    // a cloud of soft motes scattered through a 3D volume
    const COUNT = 800;
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
      uSize: { value: 22 * dpr },
      uColorA: { value: new THREE.Color("#b4a89d") }, // soft warm-grey base
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

    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const heroEl = document.getElementById("home");
    const io = heroEl
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 })
      : null;
    if (io && heroEl) io.observe(heroEl);
    function tick() {
      raf = requestAnimationFrame(tick);
      if (!visible) return; // pause GPU work while the hero is scrolled off-screen
      const t = clock.getElapsedTime();
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
      if (io) io.disconnect();
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return; // pause render while offscreen
      const t = reduce ? 0 : clock.getElapsedTime();
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

/* scramble/decode text — letters shuffle then resolve into the target */
const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*!?";
function scrambleStr(t) {
  return t
    .split("")
    .map((c) => (c === " " || c === "." ? c : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]))
    .join("");
}
function Scramble({ text, className = "", active = true }) {
  const [out, setOut] = useState(() => scrambleStr(text));
  const ran = useRef(false);
  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    let ticks = 0, timer;
    const run = () => {
      ticks += 1;
      const reveal = Math.floor(ticks / 2);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || ch === ".") { s += ch; continue; }
        s += i < reveal ? ch : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
      }
      setOut(s);
      if (reveal <= text.length) timer = setTimeout(run, 45);
      else setOut(text);
    };
    timer = setTimeout(run, 45);
    return () => clearTimeout(timer);
  }, [active, text]);
  return <span className={className}>{out}</span>;
}

/* ---------- NAVBAR ---------- */
function Navbar({ nav, page }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("creme");
  const [scrolling, setScrolling] = useState(false);

  // compact the navbar while actively scrolling; relax it when scrolling stops
  useEffect(() => {
    let timer;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => setScrolling(false), 550);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const sectionLinks = [["Home", "home"], ["About", "about"], ["Ventures", "ventures"], ["Services", "services"]];
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
      <nav className={`nav nav-theme-${theme} ${scrolling ? "is-scrolling" : ""}`}>
        <span className="brand" onClick={() => { nav.section("home"); close(); }}>
          <img src={logoImg} alt="Quenchmark" className="brand-logo" />
          <span className="brand-name">Quenchmark</span>
        </span>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {sectionLinks.map(([label, id]) => (
            <li key={id}><a onClick={() => { nav.section(id); close(); }}>{label}</a></li>
          ))}
          <li><a onClick={() => { nav.contact(); close(); }}>Contact</a></li>
          <li className="nav-mobile-only"><a onClick={() => { nav.careers(); close(); }}>Careers</a></li>
        </ul>

        <button className="btn btn-solid nav-cta" onClick={() => nav.careers()}>Careers</button>

        <button className={`burger ${menuOpen ? "open" : ""}`} aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          <span></span><span></span><span></span>
        </button>
      </nav>

      <button
        className={`nav-mini nav-theme-${theme} ${scrolling ? "is-on" : ""}`}
        aria-label="Back to top"
        onClick={() => nav.section("home")}
      >
        <img src={logoImg} alt="Quenchmark" className="nav-mini-logo" />
      </button>
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
            <img src={logoImg} alt="Quenchmark" className="brand-logo" />
            <span className="brand-name">Quenchmark</span>
          </div>
          <p>Empowering ventures in Travel, Technology, Cybersecurity &amp; AI Finance.</p>
          <div className="footer-contact">
            <a href="mailto:official@quenchmark.org">official@quenchmark.org</a>
            <span>Based in India 🇮🇳</span>
          </div>
          <div className="footer-social">
            <a href="https://www.instagram.com/quench_mark?igsh=ZHRtZTZyZ3pzZmI5" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/quench-mark/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Ventures</h4>
          <a onClick={() => nav.section("ventures")}>TripSoul</a>
          <a onClick={() => nav.section("ventures")}>ParameterX</a>
          <a onClick={() => nav.section("ventures")}>Algo Trading</a>
          <a onClick={() => nav.section("ventures")}>Quench AI</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a onClick={() => nav.section("about")}>About</a>
          <a onClick={() => nav.section("services")}>Services</a>
          <a onClick={() => nav.careers()}>Careers</a>
          <a onClick={() => nav.contact()}>Contact</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a>Terms &amp; Conditions</a>
          <a>Privacy Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Quenchmark Group. All rights reserved.</span>
        <span>Building digital futures.</span>
      </div>
    </footer>
  );
}

/* central Quenchmark hub wired to the 4 ventures; the picked spoke energises
   and the hub glows that venture's colour */
const HUB = [
  { c: "#d99a4e", c2: "#bd7d32" }, // TripSoul — amber
  { c: "#5a8fcc", c2: "#36639b" }, // ParameterX — blue
  { c: "#57a87b", c2: "#347d54" }, // QuantMentor — green
  { c: "#9b6fbe", c2: "#6f4593" }, // DMGennie — violet
];
function HubStage({ onPick }) {
  const [active, setActive] = useState(0);
  const v = ventures[active];
  const { c, c2 } = HUB[active];
  const cx = 180, cy = 180, R = 122;
  const nodes = ventures.map((vt, i) => {
    const ang = ((-90 + i * (360 / ventures.length)) * Math.PI) / 180;
    return { i, vt, x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
  });
  return (
    <div className="hub-wrap">
      <div className="hub-stage" style={{ "--c": c, "--c2": c2 }}>
        <svg className="hub-lines" viewBox="0 0 360 360" aria-hidden="true">
          {nodes.map((n) => (
            <line
              key={n.i}
              x1={cx} y1={cy} x2={n.x} y2={n.y}
              className={`spoke ${n.i === active ? "is-active" : ""}`}
              style={n.i === active ? { stroke: c } : undefined}
            />
          ))}
        </svg>
        {nodes.map((n) => (
          <button
            key={n.vt.title}
            type="button"
            className={`node ${n.i === active ? "is-active" : ""} ${n.vt.logoDark ? "node-dark" : ""}`}
            style={{ left: `${(n.x / 360) * 100}%`, top: `${(n.y / 360) * 100}%`, "--fc": HUB[n.i].c, "--d": `${n.i * 0.6}s` }}
            onMouseEnter={() => setActive(n.i)}
            onFocus={() => setActive(n.i)}
            onClick={() => { setActive(n.i); onPick && onPick(n.i); }}
            aria-label={`${n.vt.title} — view in Ventures`}
          >
            {n.vt.logo
              ? <img className="node-logo" src={n.vt.logo} alt={n.vt.title} />
              : <><span className="node-dot">{n.vt.icon}</span><span className="node-name">{n.vt.title}</span></>}
          </button>
        ))}
        <div className="hub-core">
          <span className="hub-ring" />
          <img src={logoImg} alt="Quenchmark" className="hub-logo" />
        </div>
      </div>
      <div className="hub-caption" key={active}>
        <span className="hub-cat" style={{ color: c2 }}>{v.category}</span>
        <strong className="hub-title">{v.title}</strong>
        <span className="hub-desc">{v.highlights[0]}</span>
      </div>
    </div>
  );
}

/* a titled numbered list that drops down / folds up via a toggle */
function NumColumn({ kicker, title, items, variant }) {
  const [open, setOpen] = useState(false);
  const colRef = useRef(null);
  // auto-fold when the column scrolls out of view
  useEffect(() => {
    const el = colRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) setOpen(false); },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
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

/* ---------- HOME ---------- */
function Home({ nav, introDone }) {
  const [activeVent, setActiveVent] = useState(0);
  const [ventPaused, setVentPaused] = useState(false);
  const [redirect, setRedirect] = useState(null);
  const [frameLoaded, setFrameLoaded] = useState(false);
  useScrollZoom();
  const startVisit = (v) => {
    setFrameLoaded(false);
    setRedirect(v); // opens an in-app frame (or "launching soon" if not live)
  };
  const closeVisit = () => {
    setRedirect(null);
    setFrameLoaded(false);
  };
  useEffect(() => {
    if (ventPaused) return;
    const id = setInterval(() => setActiveVent((i) => (i + 1) % ventures.length), 5000);
    return () => clearInterval(id);
  }, [ventPaused]);
  return (
    <>
      <HeroThree />
      {/* HERO */}
      <section className="hero" id="home" data-nav="creme">
        <div className="hero-inner">
          <div className="hero-main">
            <span className="pill">Quenchmark Venture Group</span>
            <h1>
              Powerful businesses, built <span className="hl">under one vision.</span>
            </h1>
            <p>
              We turn ambitious ideas into businesses that last — building across
              Travel, Cybersecurity &amp; AI&nbsp;Finance, all under one roof.
            </p>
            <div className="actions">
              <a className="btn btn-solid" onClick={() => nav.section("ventures")}>Explore Ventures →</a>
              <a className="btn btn-outline" onClick={() => nav.contact()}>Partner With Us</a>
            </div>
          </div>

          <div className="hero-flow">
            <HubStage
              onPick={(i) => {
                setVentPaused(true);
                setActiveVent(i);
                nav.section("ventures");
              }}
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="band band-tint zoom-sec" id="about" data-nav="sand">
        <Reveal className="section-head">
          <span className="kicker">Who We Are</span>
          <h2 className="about-headline">
            <span className="ah-small">Powering the</span>
            <span className="ah-image">next generation</span>
            <span className="ah-small">of businesses.</span>
          </h2>
        </Reveal>
        <div className="about-split">
          <Reveal className="about-copy" variant="left">
            <p className="lead">
              At Quenchmark Group, we accelerate business growth by combining world-class
              systems, strategic leadership, and innovation-driven operations.
            </p>
            <p className="lead">
              Our ecosystem supports forward-thinking ventures across travel, cybersecurity
              &amp; tech services, and AI-powered financial solutions. We don't just build
              products — we build market-defining companies.
            </p>
          </Reveal>
          <Reveal className="about-photo" variant="up" delay={120}>
            <img
              src={`${IMG}1600880292203-757bb62b4baf?auto=format&fit=crop&w=1100&q=80`}
              alt="The Quenchmark team at work"
            />
            <div className="about-badge">
              <strong>4+</strong>
              <span>ventures built under<br />one vision</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION & HOW WE WORK — two columns, 3D-animated numbers */}
      <section className="band band-mist zoom-sec" id="mission" data-nav="pink">
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

      {/* VENTURES */}
      <section className="band zoom-sec" id="ventures" data-nav="creme">
        <Reveal className="section-head">
          <span className="kicker">Our Ecosystem</span>
          <h2><SplitText text="From one group, many industries." /></h2>
        </Reveal>
        <Reveal variant="zoom">
          <div
            className="vent-showcase"
            onMouseEnter={() => setVentPaused(true)}
            onMouseLeave={() => setVentPaused(false)}
          >
            <div className="vs-bg" key={`bg-${activeVent}`} style={{ backgroundImage: `url(${ventures[activeVent].shot || ventures[activeVent].image})` }} />
            <div className="vs-tint" key={`tint-${activeVent}`} style={{ background: ventures[activeVent].accent }} />
            <div className="vs-left" key={`txt-${activeVent}`}>
              {ventures[activeVent].logo
                ? <span className={`vs-logo-chip ${ventures[activeVent].logoDark ? "is-dark" : ""}`}><img src={ventures[activeVent].logo} alt={ventures[activeVent].title} /></span>
                : <span className="vs-eyebrow">{ventures[activeVent].icon}Our Ventures</span>}
              <h3 className="vs-title">{ventures[activeVent].title}</h3>
              <p className="vs-desc">{ventures[activeVent].desc}</p>
              <ul className="vb-highlights vs-highlights">
                {ventures[activeVent].highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="vb-facts vs-facts">
                {ventures[activeVent].facts.map((f) => (
                  <div className="vb-fact" key={f.label}>
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
              <a
                className="vb-cta"
                role="button"
                tabIndex={0}
                onClick={() => startVisit(ventures[activeVent])}
                onKeyDown={(e) => e.key === "Enter" && startVisit(ventures[activeVent])}
              >
                {ventures[activeVent].live === false ? "Launching soon" : "Visit site →"}
              </a>
            </div>
            <ul className="vs-nav">
              {ventures.map((v, i) => (
                <li
                  key={v.title}
                  className={`vs-item ${i === activeVent ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveVent(i)}
                  onClick={() => setActiveVent(i)}
                >
                  <span className="vs-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="vs-item-text">
                    <span className="vs-item-name">{v.title}</span>
                    <span className="vs-item-cat">{v.category}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* SERVICES & CAPABILITIES */}
      <section className="band band-tint zoom-sec" id="services" data-nav="sand">
        <Reveal className="section-head">
          <span className="kicker">Services &amp; Capabilities</span>
          <h2><SplitText text="What we do, end to end." /></h2>
        </Reveal>
        <div className="grid grid-services">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <TiltCard className="service">
                <span className="service-icon">{s.icon}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATEMENT — dark band with animated glow + shimmering text */}
      <section className="statement-band zoom-sec" data-nav="dark">
        <StatementThree />
        <Reveal>
          <h2 className="statement statement-shimmer">
            Travel smarter. Scale efficiently. Trade intelligently.
          </h2>
        </Reveal>
      </section>

      {/* WHY CHOOSE */}
      <section className="band band-mist zoom-sec" data-nav="pink">
        <Reveal className="section-head">
          <span className="kicker">Why Quenchmark</span>
          <h2><SplitText text="A tech-first, human-centered approach." /></h2>
        </Reveal>
        <div className="grid grid-features">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <TiltCard className="feature">
                <span className="feature-no">{f.no}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS — standalone dark band */}
      <section className="stats-band zoom-sec" data-nav="creme">
        <Reveal>
          <p className="stats-eyebrow">By the Numbers</p>
          <h2 className="stats-title">Built on momentum, measured by impact.</h2>
        </Reveal>
        <Reveal className="stats-strip">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-val"><CountUp to={s.num} suffix={s.suffix} decimals={s.decimals || 0} /></span>
              <span className="stat-lab">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="band band-tint zoom-sec" id="reviews" data-nav="sand">
        <Reveal className="section-head">
          <span className="kicker">Reviews</span>
          <h2><SplitText text="Loved by partners and users." /></h2>
        </Reveal>

        <div className="reviews-wrap">
          <Reveal className="rating-summary" variant="left">
            <div className="rating-big">{ratingAvg}</div>
            <Stars rating={5} />
            <p className="rating-count">Based on {reviews.length * 20}+ verified reviews</p>
            <div className="rating-bars">
              {[
                { s: 5, w: "88%" },
                { s: 4, w: "9%" },
                { s: 3, w: "2%" },
                { s: 2, w: "1%" },
                { s: 1, w: "0%" },
              ].map((b) => (
                <div className="rating-bar" key={b.s}>
                  <span className="rb-label">{b.s}★</span>
                  <span className="rb-track"><span className="rb-fill" style={{ width: b.w }} /></span>
                  <span className="rb-pct">{b.w}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="reviews-grid">
            {reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 70}>
                <TiltCard className="review-card" max={7}>
                  <header className="review-head">
                    <img className="review-avatar" src={r.image} alt={r.name} loading="lazy" />
                    <div className="review-who">
                      <strong>{r.name}</strong>
                      <span>{r.role}</span>
                    </div>
                  </header>
                  <div className="review-meta">
                    <Stars rating={r.rating} />
                    <time>{r.date}</time>
                  </div>
                  <p>{r.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band cta-band zoom-sec" data-nav="creme">
        <Reveal>
          <div
            className="cta"
            onMouseMove={(e) => {
              const el = e.currentTarget;
              const r = el.getBoundingClientRect();
              el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
              el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
            }}
          >
            <span className="cta-spot" aria-hidden="true" />
            <h2><SplitText text="Ready to scale your venture with Quenchmark?" /></h2>
            <p>Partner with us to accelerate your vision. Let's build something lasting.</p>
            <div className="actions">
              <MagneticButton className="btn-light" onClick={() => nav.contact()}>Join Our Mission</MagneticButton>
              <MagneticButton className="btn-outline-light" onClick={() => nav.contact()}>Contact Us</MagneticButton>
            </div>
          </div>
        </Reveal>
      </section>

      {/* launching-soon card for ventures without a live site */}
      {redirect && redirect.live === false && (
        <div className="redirect-overlay" onClick={() => setRedirect(null)}>
          <div className="redirect-card">
            <span className="redirect-orbit" aria-hidden="true">
              <span /><span /><span />
              <img src={logoImg} className="redirect-logo" alt="" />
            </span>
            <h3>Launching soon</h3>
            <p>{redirect.title} isn't live just yet — check back shortly.</p>
            <button className="btn btn-solid" onClick={() => setRedirect(null)}>Got it</button>
          </div>
        </div>
      )}

      {/* live venture opens inside Quenchmark — closing returns to the exact spot */}
      {redirect && redirect.live !== false && (
        <div className="visit-overlay">
          <div className="visit-bar">
            <button className="visit-back" onClick={closeVisit}>
              <span aria-hidden="true">←</span> Back to Quenchmark
            </button>
            <span className="visit-title">{redirect.title}</span>
            <a className="visit-ext" href={redirect.link} target="_blank" rel="noopener noreferrer">
              Open in new tab ↗
            </a>
          </div>
          <div className="visit-stage">
            {!frameLoaded && (
              <div className="visit-loader">
                <span className="redirect-orbit" aria-hidden="true">
                  <span /><span /><span />
                  <img src={logoImg} className="redirect-logo" alt="" />
                </span>
                <p>Loading {redirect.title}…</p>
              </div>
            )}
            <iframe
              className="visit-frame"
              src={redirect.link}
              title={redirect.title}
              onLoad={() => setFrameLoaded(true)}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
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
        <div className="positions">
          {positions.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="position">
                <div className="position-info">
                  <span className="position-dept">{p.dept}</span>
                  <h3>{p.title}</h3>
                  <span className="position-type">{p.type} · Remote-friendly</span>
                </div>
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

  // Theatre.js cinematic hero entrance
  useEffect(() => { setupTheatreHero(); }, []);
  useEffect(() => {
    if (intro !== "done" || !theatreHero) return;
    theatreHero.project.ready.then(() => {
      try {
        theatreHero.sheet.sequence.position = 0;
        theatreHero.sheet.sequence.play({ range: [0, 2.4], iterationCount: 1, rate: 1 });
      } catch (e) { /* no-op */ }
    });
  }, [intro]);

  // buttery momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,          // frame-rate-independent smoothing — silkier than time-based
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

  const scrollToSection = (id) => {
    const lenis = lenisRef.current;
    if (id === "home") {
      if (lenis) lenis.scrollTo(0, { duration: 1.25 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      // tall pinned sections align to their top; normal sections center
      const tall = el.clientHeight > window.innerHeight * 1.4;
      const offset = tall ? 2 : -(window.innerHeight - el.clientHeight) / 2;
      lenis.scrollTo(el, { offset, duration: 1.35 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (page === "home" && pendingSection) {
      scrollToSection(pendingSection);
      setPendingSection(null);
    } else if (!pendingSection) {
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
    contact: () => setPage("contact"),
    careers: () => setPage("careers"),
  };

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
      <div className={`page ${page !== "home" ? "page-locked" : ""} ${intro === "typing" ? "page-hidden" : "revealed"}`}>
        <Navbar nav={nav} page={page} />
        {page === "home" && <Home nav={nav} introDone={intro === "done"} />}
        {page === "contact" && <ContactPage />}
        {page === "careers" && <CareersPage nav={nav} />}
        {page === "home" ? <Footer nav={nav} /> : <MiniFooter />}
      </div>
    </>
  );
}

export default App;
