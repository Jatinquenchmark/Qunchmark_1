import { metaFor, SITE } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero, Section, CtaBand, Rise, ArrowRight, Check } from "./common.jsx";
import { ProcessSteps, EngagementModels } from "./Services.jsx";

const VALUES = [
  { title: "Build to last", desc: "We engineer software for durability — maintainable code, sound architecture and documentation, not shortcuts that cost you later." },
  { title: "Honest by default", desc: "Clear scopes, realistic timelines and straight answers, including when something isn't worth building." },
  { title: "Outcomes over output", desc: "We measure success by what the software does for your business, not by the number of features shipped." },
  { title: "Ownership", desc: "We treat your product like our own — because we build and run products of our own." },
];

export function AboutPage() {
  const m = metaFor("about");
  return (
    <main>
      <PageHero
        crumbs={m.crumbs}
        kicker="About QuenchMark Technologies"
        title={<>Your technology partner for <em>building, scaling and transforming</em> businesses.</>}
        lead="QuenchMark Technologies is an India-based technology company. We design, build and maintain software for startups, growing businesses and enterprises — and we build and run software products of our own."
      >
        <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta="Discuss Your Project">Discuss Your Project <ArrowRight /></Link>
        <Link className="pg-btn pg-btn-ghost" to="/work">See our work</Link>
      </PageHero>

      <Section kicker="Who we are" title={<>Builders first.</>}>
        <div className="pg-split">
          <Rise className="pg-panel">
            <h3>What we do</h3>
            <p className="ab-p">We take ideas from first conversation to design, development, launch and ongoing support: websites and web applications, Android and iOS apps, custom business software, SaaS products, AI integration and automation, cloud infrastructure and dedicated development teams.</p>
          </Rise>
          <Rise className="pg-panel">
            <h3>Why that matters to you</h3>
            <p className="ab-p">Because we operate our own products — including <Link to="/brokrsuite">BrokrSuite</Link>, our real estate CRM on iPhone and Android — we know what it takes to launch software, support real users and keep improving it. We bring that experience to every client project.</p>
          </Rise>
        </div>
      </Section>

      <Section kicker="Mission & vision" title={<>Why we <em>exist.</em></>} tone="tint">
        <div className="pg-split">
          <Rise className="pg-panel"><h3>Our mission</h3><p className="ab-p">To help businesses turn ideas into reliable, useful software — delivered with transparency and built to grow with them.</p></Rise>
          <Rise className="pg-panel"><h3>Our vision</h3><p className="ab-p">To be the long-term technology partner businesses trust to build, scale and transform their operations, in India and around the world.</p></Rise>
        </div>
      </Section>

      <Section kicker="Values" title={<>How we <em>work.</em></>}>
        <div className="pg-grid">{VALUES.map((v) => <Rise key={v.title} className="pg-card"><h3>{v.title}</h3><p>{v.desc}</p></Rise>)}</div>
      </Section>

      <ProcessSteps dark />
      <EngagementModels />

      <Section kicker="Leadership" title={<>Founder-led.</>}>
        <Rise className="pg-panel ab-founder">
          <span className="founder-initials">PS</span>
          <div>
            <h3>{SITE.founder}</h3>
            <p className="ab-role">Founder, QuenchMark</p>
            <p className="ab-p">Prince Saini founded QuenchMark to build technology-driven businesses and products across AI, SaaS, travel and digital services — focused on creating scalable solutions to real-world problems through innovation and thoughtful execution.</p>
          </div>
        </Rise>
      </Section>

      <Section kicker="Get in touch" title={<>Contact <em>details.</em></>} tone="tint">
        <ul className="pg-checks">
          <li><span><Check /></span><span>Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></span></li>
          <li><span><Check /></span><span>WhatsApp: <a href="https://wa.me/918851484102" target="_blank" rel="noopener noreferrer">+91 88514 84102</a></span></li>
          <li><span><Check /></span><span>Based in India, working with clients worldwide</span></li>
          <li><span><Check /></span><span>We respond within 24 hours</span></li>
        </ul>
      </Section>

      <CtaBand title={<>Let&apos;s build something <em>that lasts.</em></>} text="Tell us about your goals. We'll recommend the right approach and give you a transparent estimate." whatsappText="Hi QuenchMark, I'd like to discuss a project." />
    </main>
  );
}
