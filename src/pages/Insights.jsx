import { Fragment } from "react";
import { ARTICLES, articleBySlug } from "../content/articles.js";
import { serviceBySlug } from "../content/services.js";
import { metaFor } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero, Section, Faq, CtaBand, Rise, ArrowRight, Breadcrumbs } from "./common.jsx";

const fmt = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/* "[text](/path)" → <Link> */
function inline(text) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<Link key={i++} to={m[2]}>{m[1]}</Link>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Block({ b }) {
  if (b.h2) return <h2>{b.h2}</h2>;
  if (b.h3) return <h3>{b.h3}</h3>;
  if (b.note) return <p className="pg-note">{inline(b.note)}</p>;
  if (b.ul) return <ul>{b.ul.map((x, i) => <li key={i}>{inline(x)}</li>)}</ul>;
  if (b.ol) return <ol>{b.ol.map((x, i) => <li key={i}>{inline(x)}</li>)}</ol>;
  return <p>{inline(b.p)}</p>;
}

export function ArticleCard({ a }) {
  return (
    <Link to={`/insights/${a.slug}`} className="pg-card is-link">
      <span className="pg-tag">{a.category}</span>
      <h3>{a.title}</h3>
      <p>{a.excerpt}</p>
      <span className="pg-link">Read article · {a.readMins} min <ArrowRight /></span>
    </Link>
  );
}

export function InsightsIndex() {
  const m = metaFor("insights");
  return (
    <main>
      <PageHero crumbs={m.crumbs} kicker="Insights" title={<>Practical guides for <em>building better software.</em></>} lead="Straight answers to the questions business owners ask before starting a software, website, app or AI project." />
      <Section kicker="Latest" title={<>Articles</>}>
        <div className="pg-grid">{ARTICLES.map((a) => <ArticleCard key={a.slug} a={a} />)}</div>
      </Section>
      <CtaBand title={<>Have a question <em>about your project?</em></>} text="Ask us directly — we're happy to give honest, practical advice." whatsappText="Hi QuenchMark, I have a question about a software project." />
    </main>
  );
}

export function ArticlePage({ slug }) {
  const a = articleBySlug(slug);
  const m = metaFor(`insight:${slug}`);
  const svc = serviceBySlug(a.service);
  const more = ARTICLES.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <main>
      <article>
        <header className="pg-hero" data-nav="creme">
          <span className="pg-hero-glow" aria-hidden="true" />
          <div className="pg-inner">
            <Breadcrumbs crumbs={m.crumbs} />
            <div className="pg-hero-copy">
              <span className="hs-kicker">{a.category}</span>
              <h1>{a.title}</h1>
              <p className="pg-lead">{a.excerpt}</p>
              <p className="pg-meta">
                <span>By <Link to={a.author.url}>{a.author.name}</Link></span>
                <span>Published <time dateTime={a.published}>{fmt(a.published)}</time></span>
                {a.updated !== a.published && <span>Updated <time dateTime={a.updated}>{fmt(a.updated)}</time></span>}
                <span>{a.readMins} min read</span>
              </p>
            </div>
          </div>
        </header>
        <section className="pg-sec pg-white" data-nav="creme">
          <div className="pg-inner pg-article">
            <div className="pg-prose">
              {a.body.map((b, i) => <Fragment key={i}><Block b={b} /></Fragment>)}
            </div>
            <aside className="pg-aside" aria-label="Related">
              {svc && (
                <div className="pg-card">
                  <span className="pg-tag">Our service</span>
                  <h3>{svc.name}</h3>
                  <p>{svc.short}</p>
                  <Link className="pg-link" to={`/services/${svc.slug}`}>Learn more <ArrowRight /></Link>
                </div>
              )}
              <div className="pg-card">
                <h3>Get a free estimate</h3>
                <p>Tell us about your project and get a written scope and estimate.</p>
                <Link className="pg-btn pg-btn-dark" to="/reach-us#enquiry" data-cta={`article:${a.slug}`}>Request a Quote <ArrowRight /></Link>
              </div>
            </aside>
          </div>
        </section>
      </article>
      {a.faqs?.length > 0 && <Faq items={a.faqs} />}
      <Section kicker="Keep reading" title={<>More <em>insights</em></>}>
        <Rise className="pg-grid">{more.map((x) => <ArticleCard key={x.slug} a={x} />)}</Rise>
      </Section>
      <CtaBand title={<>Ready to <em>get started?</em></>} text="Free consultation and a transparent estimate before any work begins." whatsappText={svc?.whatsapp || "Hi QuenchMark, I'd like to discuss a project."} />
    </main>
  );
}
