/* eslint-disable react-refresh/only-export-components */
/* Build-time only: renders a page to static HTML for scripts/prerender.mjs. */
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
export { metaFor, allIndexableKeys, keyFromPath, SITE } from "./site/routes.js";
export { SERVICES, SERVICE_ALIASES } from "./content/services.js";
export { ARTICLES } from "./content/articles.js";

export function render(path) {
  return renderToString(<App initialPath={path} />);
}
