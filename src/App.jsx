import "./App.css";
// Sahi tareeka import karne ka
import logoImg from "./assets/quenchmark.jpeg"; 

function App() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logoImg} alt="Quenchmark Logo" className="navbar-logo" />
          <span className="logo-text">QUENCHMARK</span>
        </div>
        <ul className="nav-links">
          <li>Home</li>
          <li>Businesses</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>

      {/* HERO SECTION - Background Image Applied via Inline Style or CSS */}
      <section className="hero">
        <div className="hero-overlay"></div> {/* Better Readability ke liye overlay */}
        <div className="hero-content">
          <h1>Building Powerful Businesses Under One Group</h1>
          <p>
            We deliver innovation in cybersecurity, travel, and stock market 
            research while providing end-to-end ecosystem support for startups.
          </p>
          <button className="btn-primary">Get Started</button>
        </div>
      </section>

      {/* BUSINESSES */}
      <section className="businesses">
        <h2 className="section-title">Our Ventures</h2>
        <div className="cards">
          <BusinessCard 
            title="ParameterX" 
            desc="Advanced cybersecurity solutions to protect organizations from modern digital threats and data breaches."
          />
          <BusinessCard 
            title="TripSoul" 
            desc="Curated travel packages and seamless experiences designed for comfort, adventure, and reliability."
          />
          <BusinessCard 
            title="QuantMentor" 
            desc="Data-driven stock market research and insights to support smarter, more profitable investment decisions."
          />
        </div>
      </section>

      {/* WHY US */}
      {/* <section className="why">
        <h2>Why Quenchmark?</h2>
        <p>
          We offer full-fledged A-to-Z support for startups — from ideation and
          technology to growth, scaling, and market expansion — all under one
          trusted ecosystem.
        </p>
      </section> */}

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Scale Your Vision?</h2>
        <p>Join the Quenchmark ecosystem today and transform your business.</p>
        <button className="btn-dark">Contact Us</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 Quenchmark Group. Empowering Innovation.</p>
      </footer>
    </div>
  );
}

function BusinessCard({ title, desc }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default App;