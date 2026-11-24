import { metaFor, SITE } from "../site/routes.js";
import { Link } from "../site/nav.jsx";
import { PageHero } from "./common.jsx";

/* NOTE FOR THE COMPANY: these are plain-language starting points written to
   reflect how this website actually handles data. Have them reviewed by a
   legal professional before relying on them (see docs/MANUAL_SETUP_REQUIRED.md). */
const UPDATED = "24 November 2026";

export function PrivacyPage() {
  const m = metaFor("privacy-policy");
  return (
    <main>
      <PageHero crumbs={m.crumbs} kicker="Legal" title="Privacy Policy" lead={`Last updated: ${UPDATED}`} />
      <section className="pg-sec pg-white" data-nav="creme">
        <div className="pg-inner pg-legal">
          <p>This policy explains how {SITE.name} (&quot;QuenchMark&quot;, &quot;we&quot;, &quot;us&quot;) collects and uses information when you visit www.quenchmark.org or contact us through it.</p>
          <h2>Information you give us</h2>
          <p>When you submit an enquiry, demo request or contact form, we collect the details you provide, such as your name, company, email address, phone or WhatsApp number, city, team size and the information you share about your project or requirements.</p>
          <h2>How we use it</h2>
          <ul>
            <li>To respond to your enquiry and discuss your project or product interest.</li>
            <li>To send you a confirmation that we received your message.</li>
            <li>To keep a record of our communication with you.</li>
          </ul>
          <p>We do not sell your personal information, and we do not add you to marketing lists without your consent.</p>
          <h2>Information collected automatically</h2>
          <p>We use Google Tag Manager and Google Analytics to understand how visitors use the website — for example, which pages are visited and which buttons are clicked. These tools use cookies and similar technologies and collect information such as your approximate location, device and browser. We do not send names, email addresses, phone numbers or message contents to analytics services.</p>
          <p>To understand which pages and campaigns bring enquiries, we store the page you first landed on, the referring website and any campaign (UTM) parameters in your browser, and include them with enquiries you choose to send.</p>
          <h2>Service providers</h2>
          <p>We use trusted providers to run this website: Vercel (hosting), Resend (sending enquiry emails) and Google (analytics). They process data on our behalf and only as needed to provide their services. If you contact us on WhatsApp, WhatsApp&apos;s own privacy policy applies to that conversation.</p>
          <h2>How long we keep it</h2>
          <p>We keep enquiry information for as long as needed to respond to you and manage any resulting business relationship, and then delete it unless we need to keep it for legal reasons.</p>
          <h2>Your choices and rights</h2>
          <p>You can ask us to access, correct or delete the personal information we hold about you, or to stop contacting you, by emailing <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. You can also block or delete cookies in your browser settings.</p>
          <h2>Security</h2>
          <p>We use HTTPS across the website and keep service credentials on the server, never in the browser. No method of transmission over the internet is completely secure, but we take reasonable steps to protect your information.</p>
          <h2>BrokrSuite</h2>
          <p>This policy covers this website. Use of the BrokrSuite app is covered by the privacy policy published at <a href="https://www.brokrsuite.in" target="_blank" rel="noopener">brokrsuite.in</a>.</p>
          <h2>Changes</h2>
          <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>
          <h2>Contact</h2>
          <p>Questions about privacy? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </main>
  );
}

export function TermsPage() {
  const m = metaFor("terms");
  return (
    <main>
      <PageHero crumbs={m.crumbs} kicker="Legal" title="Terms of Use" lead={`Last updated: ${UPDATED}`} />
      <section className="pg-sec pg-white" data-nav="creme">
        <div className="pg-inner pg-legal">
          <p>These terms govern your use of www.quenchmark.org, operated by {SITE.name}. By using the website you agree to them.</p>
          <h2>Use of the website</h2>
          <p>You may use this website to learn about our services and products and to contact us. Please don&apos;t misuse it — for example by attempting to disrupt it, gain unauthorised access or submit spam through our forms.</p>
          <h2>Information on this website</h2>
          <p>We aim to keep information accurate and up to date, but it is provided for general information only and does not form an offer or contract. Articles and guides are general guidance, not professional advice for your specific situation. Project scope, pricing and terms are agreed separately in writing.</p>
          <h2>Intellectual property</h2>
          <p>The content, design, logos and trademarks on this website, including QuenchMark and BrokrSuite, belong to {SITE.name} or their respective owners. Please don&apos;t copy or reuse them without permission.</p>
          <h2>Third-party links</h2>
          <p>We link to other websites, such as app stores and our products&apos; own sites. We aren&apos;t responsible for the content or practices of websites we don&apos;t control.</p>
          <h2>Liability</h2>
          <p>To the extent permitted by law, we are not liable for any loss arising from your use of this website or reliance on its content.</p>
          <h2>Privacy</h2>
          <p>See our <Link to="/privacy-policy">Privacy Policy</Link> for how we handle personal information.</p>
          <h2>Contact</h2>
          <p>Questions about these terms? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        </div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="pg-404" data-nav="creme">
      <div>
        <span className="hs-kicker">Error 404</span>
        <h1>We can&apos;t find that page.</h1>
        <p>The page may have moved or no longer exists. Try one of these instead:</p>
        <div className="pg-actions">
          <Link className="pg-btn pg-btn-dark" to="/">Go to homepage</Link>
          <Link className="pg-btn pg-btn-ghost" to="/services">Our services</Link>
          <Link className="pg-btn pg-btn-ghost" to="/reach-us#enquiry">Contact us</Link>
        </div>
      </div>
    </main>
  );
}
