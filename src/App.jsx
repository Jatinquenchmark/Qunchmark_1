import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import { getProject } from "@theatre/core";
import "./App.css";

const logoImg = "/quenchmark-logo.png";
const logoMarkImg = "/favicon-512.png";

/* ---------- Theatre.js: cinematic hero entrance ---------- */
const tkf = (position, value, connectedRight = true) => ({
  id: `kf_${position}_${value}`.replace(/[.-]/g, "_"),
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
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V5M4 19h16" />
      <path d="m7 14 3-3 3 2 5-6" />
    </svg>
  ),
};

const IMG = "https://images.unsplash.com/photo-";
const ventures = [
  {
    tag: "Travel Tech", category: "Travel Tech", title: "TripSoul",
    logo: "/tripsoul-logo.png",
    markLogo: "/tripsoul-logo.png",
    logoShape: "wide",
    desc: "Curated premium travel experiences — personalized planning, tailored itineraries, and local expert support.",
    link: "https://www.tripsoul.org",
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
    tag: "Cybersecurity", category: "Cybersecurity", title: "ParameterX",
    logo: "/parameterx-logo.png",
    markLogo: "/parameterx-logo.png",
    logoShape: "wide",
    desc: "Advanced cybersecurity and technology solutions — threat detection, monitoring, and enterprise security infrastructure.",
    link: "https://www.parameterx.org",
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
    logo: null,
    futureLogo: "/quantmentor-logo.png",
    desc: "AI-powered finance — algorithmic trading support, market analytics, and custom strategy building.",
    link: "https://www.quantmentor.org",
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
    tag: "AI & Automation", category: "AI & Automation", title: "DMGennie",
    logo: "/dmgennie-logo.png",
    markLogo: "/dmgennie-logo.png",
    logoShape: "wide",
    desc: "AI-powered Instagram automation — smart DM replies, lead capture, and engagement workflows for creators and businesses.",
    link: "https://www.dmgennie.org",
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

function VentureLogo({ venture, className = "", decorative = false, variant = "logo" }) {
  const src = variant === "mark" ? venture.markLogo || venture.logo : venture.logo;
  const brandClass = `${venture.title.toLowerCase().replace(/[^a-z0-9]+/g, "")}-logo`;
  if (src) {
    return (
      <img
        src={src}
        alt={decorative ? "" : `${venture.title} logo`}
        className={`venture-logo ${brandClass} ${variant === "mark" ? "is-mark" : ""} ${venture.logoShape === "wide" ? "is-wide" : ""} ${className}`}
      />
    );
  }
  return (
    <span className={`venture-logo-fallback ${brandClass} ${className}`} aria-hidden="true">
      {venture.icon}
    </span>
  );
}

const stats = [
  { num: 4, suffix: "+", label: "Active Ventures" },
  { num: 5, suffix: "+", label: "Business Verticals" },
  { text: "Multiple", label: "Digital Products" },
  { text: "India-based", label: "Global Vision" },
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
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const d = (center - vh / 2) / vh; // 0 = centred, + below, - above
        let t = (Math.abs(d) - dead) / (1 - dead);
        t = Math.max(0, Math.min(1, t));
        let scale, opacity;
        if (d >= 0) {
          // entering from below — rises up from a slightly smaller state
          scale = 1 - t * 0.1;
          opacity = 1 - t * 0.5;
        } else {
          // exiting upward — swells past the viewer and dissolves
          scale = 1 + t * 0.12;
          opacity = 1 - t * 0.55;
        }
        el.style.setProperty("--zs", scale.toFixed(4));
        el.style.setProperty("--zo", Math.max(0, opacity).toFixed(3));
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
    gl_FragColor = vec4(col, soft * (0.055 + vGlow * 0.24));
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
    const COUNT = 760;
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
    function tick() {
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
      <nav className={`nav nav-theme-${theme}`}>
        <span className="brand" onClick={() => { nav.section("home"); close(); }} aria-label="Quenchmark home">
          <span className="brand-logo-wrap">
            <img src={logoImg} alt="Quenchmark" className="brand-logo" />
          </span>
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
          <a onClick={() => nav.section("ventures")}>ParameterX</a>
          <a onClick={() => nav.section("ventures")}>QuantMentor</a>
          <a onClick={() => nav.section("ventures")}>TripSoul</a>
          <a onClick={() => nav.section("ventures")}>DMGennie</a>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a onClick={() => nav.section("services")}>Cybersecurity Services</a>
          <a onClick={() => nav.section("services")}>AI &amp; Automation</a>
          <a onClick={() => nav.section("services")}>SaaS Platforms</a>
          <a onClick={() => nav.section("services")}>Business Consulting</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a onClick={() => nav.section("about")}>About</a>
          <a onClick={() => nav.contact()}>Contact</a>
          <a onClick={() => nav.careers()}>Careers</a>
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
            className={`node orbit-node ${n.i === active ? "is-active" : ""}`}
            style={{ left: `${(n.x / 360) * 100}%`, top: `${(n.y / 360) * 100}%`, "--fc": HUB[n.i].c, "--d": `${n.i * 0.6}s` }}
            onMouseEnter={() => setActive(n.i)}
            onFocus={() => setActive(n.i)}
            onClick={() => { setActive(n.i); onPick && onPick(n.i); }}
            aria-label={`${n.vt.title} — view in Ventures`}
          >
            <VentureLogo venture={n.vt} className="node-logo" decorative variant="mark" />
            <span className="node-name venture-label">{n.vt.title}</span>
          </button>
        ))}
        <div className="hub-core">
          <span className="hub-ring" />
          <img src={logoMarkImg} alt="Quenchmark" className="hub-logo orbit-center-logo quenchmark-logo" />
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
function Home({ nav }) {
  const [activeVent, setActiveVent] = useState(1);
  const [ventPaused, setVentPaused] = useState(false);
  useScrollZoom();
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
            <span className="pill"><span className="pill-dot" />Quenchmark Venture Group</span>
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
      <section className="band band-tint premium-section zoom-sec" id="about" data-nav="sand">
        <div className="about-premium">
          <Reveal className="about-premium-copy" variant="left">
            <span className="kicker">About Quenchmark</span>
            <h2>A multi-venture company building practical digital businesses.</h2>
            <p>
              Quenchmark is a multi-venture company focused on creating, operating and scaling high-value digital businesses. We work across cybersecurity, AI-powered products, financial research, travel technology, SaaS platforms and automation-driven solutions.
            </p>
          </Reveal>
          <Reveal className="about-principles" delay={120}>
            {["Create focused companies", "Operate with discipline", "Scale through systems"].map((item, i) => (
              <div className="principle" key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* MISSION & HOW WE WORK */}
      <section className="band band-mist zoom-sec" id="services" data-nav="pink">
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
      <section className="band zoom-sec premium-section" id="ventures" data-nav="creme">
        <Reveal className="section-head">
          <span className="kicker">02 — Our Ecosystem</span>
          <h2><SplitText text="From one group, many industries." /></h2>
        </Reveal>
        <Reveal variant="zoom">
          <div
            className="vent-showcase"
            onMouseEnter={() => setVentPaused(true)}
            onMouseLeave={() => setVentPaused(false)}
          >
            <div className="vs-bg" key={`bg-${activeVent}`} style={{ backgroundImage: `url(${ventures[activeVent].image})` }} />
            <div className="vs-tint" key={`tint-${activeVent}`} style={{ background: ventures[activeVent].accent }} />
            <div className="vs-left" key={`txt-${activeVent}`}>
              <span className="vs-eyebrow">
                <VentureLogo venture={ventures[activeVent]} className="vs-eyebrow-logo" decorative variant="mark" />
                Our Ventures
              </span>
              {ventures[activeVent].logo && (
                <div className="vs-brand-card showcase-logo-badge">
                  <VentureLogo venture={ventures[activeVent]} className="vs-brand-logo" />
                </div>
              )}
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
              <a className="vb-cta" href={ventures[activeVent].link} target="_blank" rel="noopener noreferrer">
                Visit site →
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
                  <span className="vs-item-mark showcase-list-logo" aria-hidden="true">
                    <VentureLogo venture={v} className="vs-item-logo" decorative variant="mark" />
                  </span>
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

      {/* STATS */}
      <section className="stats-band credibility-band zoom-sec" data-nav="creme">
        <Reveal>
          <p className="stats-eyebrow">Credibility</p>
          <h2 className="stats-title">A focused venture group with a broad operating field.</h2>
        </Reveal>
        <Reveal className="stats-strip">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-val">
                {s.text || <CountUp to={s.num} suffix={s.suffix} decimals={s.decimals || 0} />}
              </span>
              <span className="stat-lab">{s.label}</span>
            </div>
          ))}
        </Reveal>
      </section>

      {/* STATEMENT */}
      <section className="statement-band zoom-sec" data-nav="dark">
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
function CareersPage() {
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
      } catch { /* no-op */ }
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
