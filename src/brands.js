/* every brand in the Quenchmark group — shared by the home page, the hub,
   the footer and the Ventures / Technologies pages */
const IMG = "https://images.unsplash.com/photo-";
export const photo = (id, w = 2000) => `${IMG}${id}?auto=format&fit=crop&w=${w}&q=80`;

/* Quenchmark Ventures — companies the group operates */
export const ventures = [
  {
    key: "tripsoul", chapter: "v-tripsoul", page: "ventures",
    title: "TripSoul", category: "Travel Tech",
    logo: "/tripsoul-logo.png", markLogo: "/tripsoul-mark.png",
    link: "https://www.tripsoul.org", domain: "tripsoul.org",
    tagline: "Your soul, your journey.",
    short: "Premium trips planned around you, with a fully custom itinerary and a 24/7 concierge.",
    highlights: ["Personalized trip planning"],
    image: photo("1528127269322-539801943592"),
    color: "#d99a4e", hub: { c: "#d99a4e", c2: "#bd7d32" },
  },
  {
    key: "parameterx", chapter: "v-parameterx", page: "ventures",
    title: "ParameterX", category: "Cybersecurity",
    logo: "/parameterx-logo.png", markLogo: "/parameterx-mark.png",
    link: "https://www.parameterx.org", domain: "parameterx.org",
    tagline: "360° AI-based security.",
    short: "Penetration testing, VAPT, red teaming and LLM security, for companies in India and abroad.",
    highlights: ["360° AI-powered cybersecurity"],
    image: photo("1550751827-4bd374c3f58b"),
    color: "#6aa6ff", hub: { c: "#5a8fcc", c2: "#36639b" },
  },
];

/* Quenchmark Technologies — the group's in-house software products */
export const products = [
  {
    key: "brokr", chapter: "t-brokrsuite", page: "technologies",
    title: "BrokrSuite", category: "Real Estate CRM",
    markLogo: "/brokrsuite-icon.png", status: "Live",
    link: "https://www.brokrsuite.in", domain: "brokrsuite.in",
    tagline: "Your complete real estate business, in one suite.",
    short: "Properties, leads, clients, follow-ups and teams, on web, iOS and Android.",
    highlights: ["Real estate CRM, web & mobile"],
    color: "#7c74ff", hub: { c: "#7c74ff", c2: "#4f46e5" },
  },
  {
    key: "dmg", chapter: "t-dmgennie", page: "technologies",
    title: "DMGennie", category: "Instagram Automation",
    markLogo: "/dmgennie-mark.png", status: "Live",
    link: "https://www.dmgennie.in", domain: "dmgennie.in",
    tagline: "Automate Instagram DMs from comments.",
    short: "Auto-DMs people who comment a keyword, through the official Meta API.",
    highlights: ["Instagram comment-to-DM automation"],
    color: "#e0559e", hub: { c: "#e0559e", c2: "#b02f76" },
  },
  {
    key: "qm", chapter: "t-quantmentor", page: "technologies",
    title: "QuantMentor", category: "AI Trading",
    markLogo: "/quantmentor-mark.png", status: "Beta",
    link: "https://www.quantmentor.org", domain: "quantmentor.org",
    tagline: "Automate your trading strategies.",
    short: "Turns trading rules written in English into Pine Script you can backtest and run on your broker.",
    highlights: ["Plain-English strategy automation"],
    color: "#3ea6ff", hub: { c: "#3ea6ff", c2: "#1f74c9" },
  },
];
