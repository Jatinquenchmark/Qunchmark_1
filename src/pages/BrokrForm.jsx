import { useEffect, useRef, useState } from "react";
import { validateBrokrLead, TEAM_SIZES, BROKR_INTERESTS, PUBLIC_EMAIL, LIMITS } from "../lib/enquiry.js";
import { attribution, track } from "../lib/track.js";
import "../reachus.css";

/* BrokrSuite demo / pricing enquiry — posts to /api/enquiry with
   formType "brokrsuite", which emails "New BrokrSuite Business Lead". */
const EMPTY = { name: "", company: "", email: "", phone: "", city: "", teamSize: "", currentSoftware: "", interest: "Book a demo", requirements: "", website: "" };
const ORDER = ["name", "phone", "email", "teamSize", "interest"];

export function BrokrForm({ interest }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [ref, setRef] = useState("");
  const startedAt = useRef(0);
  const formRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);
  // a "Request pricing" / "Book a demo" button elsewhere on the page pre-selects the interest
  const [seen, setSeen] = useState(interest?.n || 0);
  if (interest && interest.n !== seen) {
    setSeen(interest.n);
    setValues((v) => ({ ...v, interest: interest.value }));
    if (status === "sent") setStatus("idle");
  }
  useEffect(() => {
    const el = resultRef.current;
    if (el && (status === "sent" || status === "error")) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: "center", behavior: "smooth" }); }
  }, [status]);

  const set = (name) => (e) => {
    const value = e.target.value;
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (touched[name]) setErrors((er) => ({ ...er, [name]: validateBrokrLead(next).errors[name] }));
      return next;
    });
  };
  const blur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateBrokrLead(values).errors[name] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const { errors: found } = validateBrokrLead(values);
    setTouched(Object.fromEntries(ORDER.map((f) => [f, true])));
    setErrors(found);
    if (Object.keys(found).length) {
      formRef.current?.querySelector(`[name="${ORDER.find((f) => found[f])}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const r = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, formType: "brokrsuite", attribution: attribution(), elapsedMs: Date.now() - startedAt.current }),
      });
      const json = await r.json().catch(() => ({}));
      if (r.ok && json.ok) {
        setRef(json.ref || "");
        setStatus("sent");
        track("generate_lead", {
          lead_type: "brokrsuite",
          brokrsuite_interest: values.interest === "Request pricing" ? "pricing" : values.interest === "Book a demo" ? "demo" : "question",
          team_size: values.teamSize || "not_specified",
          form_location: window.location.pathname,
        });
        setValues(EMPTY);
        setTouched({});
        return;
      }
      if (json.fields) setErrors(json.fields);
      setMessage(json.error || `Something went wrong. Please try again, or email us at ${PUBLIC_EMAIL}.`);
      setStatus("error");
    } catch {
      setMessage(`We couldn't reach our server. Check your connection and try again, or email us at ${PUBLIC_EMAIL}.`);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="ru-form ru-sent" role="status" tabIndex={-1} ref={resultRef}>
        <div className="modal-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3>Thank you — we&apos;ll be in touch shortly.</h3>
        <p>Our team will contact you to understand your business and schedule your BrokrSuite walkthrough.</p>
        {ref && <span className="ru-ref">Reference {ref}</span>}
        <button type="button" className="btn btn-outline" onClick={() => { startedAt.current = Date.now(); setStatus("idle"); }}>Send another request</button>
      </div>
    );
  }

  const err = (n) => (touched[n] || status === "error") && errors[n];
  const fp = (n) => ({
    id: `bs-${n}`, name: n, value: values[n], onChange: set(n), onBlur: blur(n),
    "aria-invalid": err(n) ? "true" : undefined,
    "aria-describedby": err(n) ? `bs-${n}-err` : undefined,
  });
  const errNode = (n) => (err(n) ? <span className="ru-err" id={`bs-${n}-err`}>{errors[n]}</span> : null);

  return (
    <form className="ru-form" onSubmit={submit} noValidate ref={formRef} aria-busy={status === "sending"} aria-label="BrokrSuite demo request">
      <fieldset className="field field-full ru-methods">
        <legend>I&apos;d like to</legend>
        <div className="ru-pills">
          {BROKR_INTERESTS.map((m) => (
            <label key={m} className={`ru-pill ${values.interest === m ? "is-on" : ""}`}>
              <input type="radio" name="interest" value={m} checked={values.interest === m} onChange={set("interest")} />
              {m}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="bs-name">Full Name <span aria-hidden="true">*</span></label>
        <input type="text" autoComplete="name" required maxLength={LIMITS.name} placeholder="Your full name" {...fp("name")} />
        {errNode("name")}
      </div>
      <div className="field">
        <label htmlFor="bs-company">Company Name <em>(optional)</em></label>
        <input type="text" autoComplete="organization" maxLength={LIMITS.company} placeholder="Your agency or firm" {...fp("company")} />
      </div>
      <div className="field">
        <label htmlFor="bs-phone">Phone / WhatsApp <span aria-hidden="true">*</span></label>
        <input type="tel" autoComplete="tel" inputMode="tel" required maxLength={LIMITS.phone} placeholder="+91 98765 43210" {...fp("phone")} />
        {errNode("phone")}
      </div>
      <div className="field">
        <label htmlFor="bs-email">Email Address <span aria-hidden="true">*</span></label>
        <input type="email" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} placeholder="you@company.com" {...fp("email")} />
        {errNode("email")}
      </div>
      <div className="field">
        <label htmlFor="bs-city">City <em>(optional)</em></label>
        <input type="text" autoComplete="address-level2" maxLength={80} placeholder="e.g. Gurugram" {...fp("city")} />
      </div>
      <div className="field">
        <label htmlFor="bs-teamSize">Team Size <em>(optional)</em></label>
        <div className="ru-select">
          <select {...fp("teamSize")}>
            <option value="">Select team size</option>
            {TEAM_SIZES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {errNode("teamSize")}
      </div>
      <div className="field field-full">
        <label htmlFor="bs-currentSoftware">Current CRM or software <em>(optional)</em></label>
        <input type="text" maxLength={120} placeholder="e.g. Excel, WhatsApp, another CRM" {...fp("currentSoftware")} />
      </div>
      <div className="field field-full">
        <label htmlFor="bs-requirements">Business requirements <em>(optional)</em></label>
        <textarea rows="3" maxLength={2000} placeholder="What would you like BrokrSuite to help with?" {...fp("requirements")} />
      </div>
      <div className="ru-hp" aria-hidden="true">
        <label htmlFor="bs-website">Website</label>
        <input id="bs-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>
      {status === "error" && (
        <div className="ru-alert field-full" role="alert" tabIndex={-1} ref={resultRef}>
          <strong>Your request wasn&apos;t sent.</strong> {message}
        </div>
      )}
      <div className="ru-submit-row field-full">
        <button type="submit" className="btn btn-solid ru-submit" disabled={status === "sending"}>
          {status === "sending" ? (<><span className="ru-spinner" aria-hidden="true" /> Sending…</>) : <>{values.interest === "Request pricing" ? "Request Pricing" : values.interest === "Book a demo" ? "Book My Free Demo" : "Send Question"} <span aria-hidden="true">→</span></>}
        </button>
        <span className="ru-privacy">We&apos;ll only use your details to respond. See our <a href="/privacy-policy">privacy policy</a>.</span>
      </div>
    </form>
  );
}
