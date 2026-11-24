/* Shared lead-enquiry rules — imported by the Reach Us form (browser) and by the
   /api/enquiry serverless function, so both sides validate exactly the same way. */

import { SERVICES as SERVICE_PAGES } from "../content/services.js";

export const PUBLIC_EMAIL = "official@quenchmark.org";

export const SERVICES = [
  {
    key: "web",
    formService: "Website & Web Application Development",
    title: "Website Development",
    desc: "Business websites, landing pages, e-commerce platforms, and custom web applications.",
  },
  {
    key: "mobile",
    formService: "Mobile App Development",
    title: "Mobile App Development",
    desc: "Android, iOS, and cross-platform applications.",
  },
  {
    key: "software",
    formService: "Custom Software Development",
    title: "Custom Software Development",
    desc: "CRM systems, ERP solutions, business dashboards, and automation.",
  },
  {
    key: "ai",
    formService: "AI Integration, Agents & Chatbots",
    title: "AI & Automation",
    desc: "AI integrations, chatbots, intelligent workflows, and process automation.",
  },
  {
    key: "design",
    formService: "UI/UX & Product Design",
    title: "UI/UX & Graphic Design",
    desc: "Website interfaces, app designs, branding, and digital creatives.",
  },
  {
    key: "marketing",
    formService: "Digital Marketing & SEO",
    title: "Digital Marketing & SEO",
    desc: "Search optimization, content marketing, social media, and lead generation.",
  },
  {
    key: "other",
    formService: "Other Services",
    title: "Other Services",
    desc: "Customized technology solutions based on client requirements.",
  },
];

/* the Contact page's simpler form posts here too, under this label */
export const GENERAL_ENQUIRY = "General Enquiry";

/* the form's "Service Required" options: every service page, plus extras */
export const FORM_SERVICES = [...SERVICE_PAGES.map((s) => s.name), "Digital Marketing & SEO", "Other Services"];
/* older labels still accepted (e.g. from a cached page) */
export const SERVICE_TITLES = SERVICES.map((s) => s.title);

export const BUDGETS = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

export const CONTACT_METHODS = ["Email", "WhatsApp", "Phone"];

export const LIMITS = { name: 100, company: 120, email: 254, phone: 24, description: 5000 };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);
const cleanMultiline = (v, max) =>
  String(v ?? "").replace(/\r\n?/g, "\n").replace(/\n{4,}/g, "\n\n\n").trim().slice(0, max);

/* returns { data, errors } — errors maps field name → message; empty when valid */
export function validateEnquiry(input = {}) {
  const data = {
    name: clean(input.name, LIMITS.name),
    company: clean(input.company, LIMITS.company),
    email: clean(input.email, LIMITS.email).toLowerCase(),
    phone: clean(input.phone, LIMITS.phone),
    service: clean(input.service, 80),
    budget: clean(input.budget, 40),
    description: cleanMultiline(input.description, LIMITS.description),
    contactMethod: clean(input.contactMethod, 20),
  };
  const errors = {};

  if (data.name.length < 2) errors.name = "Please enter your full name.";

  if (!data.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address, like name@company.com.";

  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone) errors.phone = "Please enter your phone or WhatsApp number.";
  else if (!/^\+/.test(data.phone) || !/^\+[\d\s\-().]+$/.test(data.phone) || digits.length < 8 || digits.length > 15)
    errors.phone = "Include your country code, e.g. +91 98765 43210.";

  if (![...FORM_SERVICES, ...SERVICE_TITLES, GENERAL_ENQUIRY].includes(data.service)) errors.service = "Please choose the service you need.";

  if (data.budget && !BUDGETS.includes(data.budget)) errors.budget = "Please choose a budget from the list.";

  if (data.description.length < 20)
    errors.description = "Please tell us a little more about your project (at least 20 characters).";

  if (!CONTACT_METHODS.includes(data.contactMethod)) errors.contactMethod = "Please choose how we should contact you.";

  return { data, errors };
}

/* ---------- BrokrSuite demo / pricing leads ---------- */
export const TEAM_SIZES = ["Just me", "2–5", "6–20", "21–50", "50+"];
export const BROKR_INTERESTS = ["Book a demo", "Request pricing", "General question"];

export function validateBrokrLead(input = {}) {
  const data = {
    name: clean(input.name, LIMITS.name),
    company: clean(input.company, LIMITS.company),
    email: clean(input.email, LIMITS.email).toLowerCase(),
    phone: clean(input.phone, LIMITS.phone),
    city: clean(input.city, 80),
    teamSize: clean(input.teamSize, 20),
    currentSoftware: clean(input.currentSoftware, 120),
    interest: clean(input.interest, 40) || "Book a demo",
    requirements: cleanMultiline(input.requirements, 2000),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = "Please enter your full name.";
  if (!data.email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address, like name@company.com.";
  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone) errors.phone = "Please enter your phone or WhatsApp number.";
  else if (!/^\+/.test(data.phone) || !/^\+[\d\s\-().]+$/.test(data.phone) || digits.length < 8 || digits.length > 15)
    errors.phone = "Include your country code, e.g. +91 98765 43210.";
  if (data.teamSize && !TEAM_SIZES.includes(data.teamSize)) errors.teamSize = "Please choose a team size from the list.";
  if (!BROKR_INTERESTS.includes(data.interest)) errors.interest = "Please choose what you'd like.";
  return { data, errors };
}

/* attribution sent with every enquiry (see src/lib/track.js) — cleaned, never trusted */
export function cleanAttribution(input = {}) {
  const keys = ["pageUrl", "landingPage", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
  return Object.fromEntries(keys.map((k) => [k, clean(input?.[k], 200)]));
}

/* WhatsApp — opens a chat with QuenchMark directly (wa.me works on phones and desktop) */
export const WHATSAPP_NUMBER = "918851484102";
export const WHATSAPP_DISPLAY = "+91 88514 84102";
export const whatsappLink = (text = "Hi QuenchMark, I'd like to discuss a project.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
