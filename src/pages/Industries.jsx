import { INDUSTRIES } from "../content/industries.js";
import { metaFor } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero, Section, CtaBand, Rise, ArrowRight, Check } from "./common.jsx";

export function IndustriesPage() {
  const m = metaFor("industries");
  return (
    <main>
      <PageHero
        crumbs={m.crumbs}
        kicker="Industries"
        title={<>Technology solutions <em>for your industry.</em></>}
        lead="Every industry has its own workflows, customers and regulations. Here's how QuenchMark Technologies can help businesses in your sector with websites, apps, custom software, AI and automation."
      >
        <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta="Discuss Your Project">Discuss Your Project <ArrowRight /></Link>
      </PageHero>
      <Section kicker="Who we help" title={<>Industries <em>we serve.</em></>} lead="Real estate is where we run our own product, BrokrSuite. For other industries, these are solutions we can design and build around your needs.">
        <div className="pg-grid-2">
          {INDUSTRIES.map((ind) => (
            <Rise key={ind.id} className="pg-card ind-card" id={ind.id}>
              <h3>{ind.name}</h3>
              <p>{ind.lead}</p>
              <ul className="bs-points">{ind.builds.map((b) => <li key={b}><Check /> {b}</li>)}</ul>
              {ind.link && <Link className="pg-link" to={ind.link.href}>{ind.link.label} <ArrowRight /></Link>}
            </Rise>
          ))}
        </div>
      </Section>
      <CtaBand title={<>Don&apos;t see <em>your industry?</em></>} text="Most business problems — managing customers, operations, data and communication — are solved the same way. Tell us about yours." whatsappText="Hi QuenchMark, I'd like to discuss a software project for my industry." />
    </main>
  );
}
