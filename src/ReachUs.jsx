import { useEffect, useRef, useState } from "react";
import { SERVICES, BUDGETS, CONTACT_METHODS, PUBLIC_EMAIL, LIMITS, validateEnquiry, whatsappLink, WHATSAPP_DISPLAY } from "./lib/enquiry";
import { WhatsAppIcon } from "./WhatsApp";
import "./reachus.css";

/* Reach Us — the lead-generation page that replaced Careers.
   Hero → services → why QuenchMark → enquiry form → closing CTA. */

function useInView(threshold = 0.18) {
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

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* one line-icon per service, drawn on a 24px grid */
const ICONS = {
  web: <><rect x="3" y="4" width="18" height="14" rx="2.5" /><path d="M3 8.5h18M8 21h8M12 18v3" /><path d="m9.5 12.5-1.5 1.5 1.5 1.5M14.5 12.5l1.5 1.5-1.5 1.5" /></>,
  mobile: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" /><path d="M9.5 7h5M9.5 10h3" /></>,
  software: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.8" /><rect x="13.5" y="3" width="7.5" height="4.5" rx="1.5" /><rect x="13.5" y="10.5" width="7.5" height="10.5" rx="1.8" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" /></>,
  ai: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><rect x="6.5" y="6.5" width="11" height="11" rx="3" /><path d="M10 14.5 11.6 9.5h.8L14 14.5M10.6 12.8h2.8" /></>,
  design: <><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3Z" /><circle cx="7.5" cy="11" r="1.1" /><circle cx="10.5" cy="7" r="1.1" /><circle cx="15" cy="7.5" r="1.1" /></>,
  marketing: <><path d="M3 20h18" /><path d="M5 16l4.5-5 3.5 3 6-7" /><path d="M15 7h4v4" /></>,
  other: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" /></>,
};
const ServiceIcon = ({ k }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[k]}</svg>
);

const WHY = [
  { title: "Custom solutions for every business", desc: "Nothing off-the-shelf — every build is shaped around your goals, users and budget." },
  { title: "Web, mobile, AI, and digital expertise", desc: "One team across websites, apps, automation, design and growth marketing." },
  { title: "Scalable and modern technology", desc: "Proven, modern stacks engineered to grow with your business, not hold it back." },
  { title: "Transparent communication", desc: "Clear scope, honest timelines and regular updates — you always know where things stand." },
  { title: "Dedicated project support", desc: "A point of contact who stays with you from first call to launch and beyond." },
];

const STEPS = [
  { title: "Share your requirements", desc: "Tell us about your idea using the form." },
  { title: "We review and reach out", desc: "Our team contacts you, usually within 24 hours." },
  { title: "Get a clear plan", desc: "Scope, timeline and next steps tailored to you." },
];

const EMPTY = { name: "", company: "", email: "", phone: "", service: "", budget: "", description: "", contactMethod: "Email", website: "" };
const FIELD_ORDER = ["name", "email", "phone", "service", "budget", "description", "contactMethod"];

/* ---------------- enquiry form ---------------- */
function EnquiryForm({ preset }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [serverMsg, setServerMsg] = useState("");
  const [receipt, setReceipt] = useState({ ref: "", confirmation: false });
  const startedAt = useRef(0); // when the form appeared (spam time-trap)
  const formRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  // a service card was clicked: pre-select it (preset.n changes on every click)
  const [seenPreset, setSeenPreset] = useState(preset.n);
  if (preset.n !== seenPreset) {
    setSeenPreset(preset.n);
    if (preset.service) {
      setValues((v) => ({ ...v, service: preset.service }));
      setErrors((e) => ({ ...e, service: undefined }));
      if (status === "sent") setStatus("idle");
    }
  }

  useEffect(() => {
    const el = resultRef.current;
    if (!el || (status !== "sent" && status !== "error")) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "center", behavior: "smooth" }); // keep it clear of the floating navbar
  }, [status]);

  const set = (name) => (e) => {
    const value = e.target.value;
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (touched[name]) setErrors((er) => ({ ...er, [name]: validateEnquiry(next).errors[name] }));
      return next;
    });
  };
  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateEnquiry(values).errors[name] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const { errors: found } = validateEnquiry(values);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    setErrors(found);
    if (Object.keys(found).length) {
      const first = FIELD_ORDER.find((f) => found[f]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerMsg("");
    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, elapsedMs: Date.now() - startedAt.current }),
      });
      const json = await r.json().catch(() => ({}));
      if (r.ok && json.ok) {
        setReceipt({ ref: json.ref || "", confirmation: !!json.confirmation });
        setStatus("sent");
        setValues(EMPTY);
        setTouched({});
        return;
      }
      if (json.fields) setErrors(json.fields);
      setServerMsg(json.error || `Something went wrong. Please try again, or email us at ${PUBLIC_EMAIL}.`);
      setStatus("error");
    } catch {
      setServerMsg(`We couldn't reach our server. Check your connection and try again, or email us at ${PUBLIC_EMAIL}.`);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="ru-form ru-sent" role="status" tabIndex={-1} ref={resultRef}>
        <div className="modal-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3>Thank you — your enquiry is on its way.</h3>
        <p>Our team has received your project details and will get in touch within 24 hours.{receipt.confirmation ? " A confirmation email is on its way to your inbox." : ""}</p>
        {receipt.ref && <span className="ru-ref">Reference {receipt.ref}</span>}
        <button type="button" className="btn btn-outline" onClick={() => { startedAt.current = Date.now(); setStatus("idle"); }}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const err = (name) => (touched[name] || status === "error") && errors[name];
  const fieldProps = (name) => ({
    id: `ru-${name}`,
    name,
    value: values[name],
    onChange: set(name),
    onBlur: blur(name),
    "aria-invalid": err(name) ? "true" : undefined,
    "aria-describedby": err(name) ? `ru-${name}-err` : undefined,
  });
  const errNode = (name) => (err(name) ? <span className="ru-err" id={`ru-${name}-err`}>{errors[name]}</span> : null);
  const mailtoFallback = `mailto:${PUBLIC_EMAIL}?subject=${encodeURIComponent(`Business Enquiry – ${values.service || "QuenchMark"}`)}&body=${encodeURIComponent(
    `Name: ${values.name}\nCompany: ${values.company}\nEmail: ${values.email}\nPhone/WhatsApp: ${values.phone}\nService: ${values.service}\nBudget: ${values.budget}\nPreferred contact: ${values.contactMethod}\n\n${values.description}`
  )}`;

  return (
    <form className="ru-form" onSubmit={submit} noValidate ref={formRef} aria-busy={status === "sending"}>
      <div className="field">
        <label htmlFor="ru-name">Full Name <span aria-hidden="true">*</span></label>
        <input type="text" autoComplete="name" required maxLength={LIMITS.name} placeholder="Your full name" {...fieldProps("name")} />
        {errNode("name")}
      </div>
      <div className="field">
        <label htmlFor="ru-company">Business / Company Name <em>(optional)</em></label>
        <input type="text" autoComplete="organization" maxLength={LIMITS.company} placeholder="Company name" {...fieldProps("company")} />
      </div>
      <div className="field">
        <label htmlFor="ru-email">Email Address <span aria-hidden="true">*</span></label>
        <input type="email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} placeholder="you@company.com" {...fieldProps("email")} />
        {errNode("email")}
      </div>
      <div className="field">
        <label htmlFor="ru-phone">Phone / WhatsApp <span aria-hidden="true">*</span> <em>(with country code)</em></label>
        <input type="tel" autoComplete="tel" inputMode="tel" required maxLength={LIMITS.phone} placeholder="+91 98765 43210" {...fieldProps("phone")} />
        {errNode("phone")}
      </div>
      <div className="field">
        <label htmlFor="ru-service">Service Required <span aria-hidden="true">*</span></label>
        <div className="ru-select">
          <select required {...fieldProps("service")}>
            <option value="" disabled>Choose a service</option>
            {SERVICES.map((s) => <option key={s.key} value={s.title}>{s.title}</option>)}
          </select>
        </div>
        {errNode("service")}
      </div>
      <div className="field">
        <label htmlFor="ru-budget">Estimated Budget <em>(optional)</em></label>
        <div className="ru-select">
          <select {...fieldProps("budget")}>
            <option value="">Select a range</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        {errNode("budget")}
      </div>
      <div className="field field-full">
        <label htmlFor="ru-description">Project Description <span aria-hidden="true">*</span></label>
        <textarea rows="5" required maxLength={LIMITS.description} placeholder="What are you looking to build? Share goals, features, timeline — whatever helps us understand your project." {...fieldProps("description")} />
        <div className="ru-hint-row">
          {errNode("description")}
          <span className="ru-count" aria-hidden="true">{values.description.length}/{LIMITS.description}</span>
        </div>
      </div>
      <fieldset className="field field-full ru-methods" aria-describedby={err("contactMethod") ? "ru-contactMethod-err" : undefined}>
        <legend>Preferred Contact Method <span aria-hidden="true">*</span></legend>
        <div className="ru-pills">
          {CONTACT_METHODS.map((m) => (
            <label key={m} className={`ru-pill ${values.contactMethod === m ? "is-on" : ""}`}>
              <input type="radio" name="contactMethod" value={m} checked={values.contactMethod === m} onChange={set("contactMethod")} />
              {m}
            </label>
          ))}
        </div>
        {errNode("contactMethod")}
      </fieldset>

      {/* honeypot: hidden from people and assistive tech; bots fill it in */}
      <div className="ru-hp" aria-hidden="true">
        <label htmlFor="ru-website">Website</label>
        <input id="ru-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      {status === "error" && (
        <div className="ru-alert field-full" role="alert" tabIndex={-1} ref={resultRef}>
          <strong>Your enquiry wasn&apos;t sent.</strong> {serverMsg}{" "}
          <a href={mailtoFallback}>Email these details instead →</a>
        </div>
      )}

      <div className="ru-submit-row field-full">
        <button type="submit" className="btn btn-solid ru-submit" disabled={status === "sending"}>
          {status === "sending" ? (<><span className="ru-spinner" aria-hidden="true" /> Sending…</>) : <>Send Enquiry <span aria-hidden="true">→</span></>}
        </button>
        <span className="ru-privacy">We reply within 24 hours. Your details are only used to respond to your enquiry.</span>
      </div>
      <span className="sr-only" aria-live="polite">{status === "sending" ? "Sending your enquiry" : ""}</span>
    </form>
  );
}

/* ---------------- page ---------------- */
export function ReachUsPage({ nav }) {
  const [heroRef, heroIn] = useInView(0.1);
  const [svcRef, svcIn] = useInView(0.12);
  const [whyRef, whyIn] = useInView(0.15);
  const [formRef, formIn] = useInView(0.08);
  const [ctaRef, ctaIn] = useInView(0.2);
  const [preset, setPreset] = useState({ service: "", n: 0 });

  const toForm = (service) => {
    if (service) setPreset((p) => ({ service, n: p.n + 1 }));
    nav.scrollToId("enquiry");
  };
  const glow = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <main className="ru">
      {/* hero */}
      <section ref={heroRef} className={`ru-hero ${heroIn ? "is-in" : ""}`} data-nav="creme">
        <div className="aurora" />
        <div className="hero-grain" />
        <span className="ru-orb" aria-hidden="true" />
        <div className="ru-inner ru-hero-grid">
          <div className="ru-hero-copy">
            <span className="kicker">Reach Us · Start a project</span>
            <h1>Let&apos;s Build Something <span className="hl">Great</span> Together.</h1>
            <p>
              Have an idea, a project, or a business challenge? QuenchMark helps businesses turn ideas into powerful digital solutions. Tell us what you need, and our team will get in touch.
            </p>
            <div className="ru-hero-actions">
              <button type="button" className="hs-btn hs-btn-dark" onClick={() => toForm()}>Tell Us About Your Project <Arrow /></button>
              <a className="hs-btn hs-btn-wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
              <a className="ru-mail" href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
            </div>
          </div>
          <ul className="ru-hero-facts" aria-label="Working with QuenchMark">
            <li><strong>24h</strong><span>Typical response time</span></li>
            <li><strong>7</strong><span>Service areas under one roof</span></li>
            <li><strong>1</strong><span>Dedicated point of contact</span></li>
          </ul>
        </div>
      </section>

      {/* services */}
      <section ref={svcRef} className={`ru-sec ru-services ${svcIn ? "is-in" : ""}`} data-nav="sand">
        <div className="ru-inner">
          <div className="ru-head">
            <span className="hs-kicker">What we do</span>
            <h2>Services built around <em>your goals.</em></h2>
            <p>Pick what you need — or tap a card to start an enquiry for that service.</p>
          </div>
          <div className="ru-grid">
            {SERVICES.map((s, i) => (
              <button
                type="button"
                key={s.key}
                className={`ru-card ${s.key === "other" ? "ru-card-wide" : ""}`}
                style={{ "--i": i }}
                onMouseMove={glow}
                onClick={() => toForm(s.title)}
                aria-label={`${s.title}: ${s.desc} Start an enquiry`}
              >
                <span className="ru-card-light" aria-hidden="true" />
                <span className="ru-card-top">
                  <span className="ru-card-icon"><ServiceIcon k={s.key} /></span>
                  <span className="ru-card-no">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="ru-card-title">{s.title}</span>
                <span className="ru-card-desc">{s.desc}</span>
                <span className="ru-card-cta">Enquire <Arrow /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* why QuenchMark */}
      <section ref={whyRef} className={`ru-sec ru-why ${whyIn ? "is-in" : ""}`} data-nav="creme">
        <div className="ru-inner ru-why-grid">
          <div className="ru-head ru-head-left">
            <span className="hs-kicker">Why QuenchMark</span>
            <h2>Why Work With <em>QuenchMark?</em></h2>
            <p>We build the way we build our own ventures — with focus, discipline and an eye on long-term results.</p>
            <button type="button" className="hs-btn hs-btn-dark" onClick={() => toForm()}>Tell Us About Your Project <Arrow /></button>
          </div>
          <ol className="ru-why-list">
            {WHY.map((w, i) => (
              <li key={w.title} style={{ "--i": i }}>
                <span className="ru-check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                <div>
                  <h3>{w.title}</h3>
                  <p>{w.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* enquiry form */}
      <section ref={formRef} id="enquiry" className={`ru-sec ru-enquiry ${formIn ? "is-in" : ""}`} data-nav="sand">
        <div className="ru-inner ru-enquiry-grid">
          <div className="ru-enquiry-intro">
            <span className="hs-kicker">Start your project</span>
            <h2>Tell Us About <em>Your Project</em></h2>
            <p>A few details are all we need. The more you share, the more useful our first conversation will be.</p>
            <ol className="ru-steps">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="ru-step-no">{i + 1}</span>
                  <div><strong>{s.title}</strong><span>{s.desc}</span></div>
                </li>
              ))}
            </ol>
            <div className="ru-direct">
              <span>Prefer to talk directly?</span>
              <a className="wa-inline" href={whatsappLink()} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp {WHATSAPP_DISPLAY}</a>
              <a href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
            </div>
          </div>
          <div className="ru-form-card">
            <EnquiryForm preset={preset} />
          </div>
        </div>
      </section>

      {/* closing CTA */}
      <section ref={ctaRef} className={`cx ru-cx ${ctaIn ? "is-in" : ""}`} data-nav="creme">
        <div className="cx-card" onMouseMove={glow}>
          <span className="cx-light" aria-hidden="true" />
          <span className="cx-ring" aria-hidden="true" />
          <div className="cx-copy">
            <span className="hs-kicker">Let&apos;s talk</span>
            <h2>Your Next Big Idea <em>Starts Here.</em></h2>
          </div>
          <div className="cx-side">
            <p className="ru-cx-text">Share your requirements and let&apos;s create something exceptional.</p>
            <div className="cx-actions">
              <button type="button" className="hs-btn hs-btn-light" onClick={() => toForm()}>Send an Enquiry <Arrow /></button>
              <a className="hs-btn hs-btn-ghost-light" href={`mailto:${PUBLIC_EMAIL}`}>Email Us</a>
            </div>
            <a className="cx-mail" href={`mailto:${PUBLIC_EMAIL}`}>{PUBLIC_EMAIL}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
