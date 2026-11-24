import { useNav } from "./nav-context.js";

/* A real <a href> (crawlable, works with new-tab / copy-link) that navigates
   in-app on a plain left click. Hash links (/reach-us#enquiry) scroll there. */
export function Link({ to, children, onClick, ...rest }) {
  const nav = useNav();
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || !nav) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (/^(https?:|mailto:|tel:)/.test(to)) return;
    e.preventDefault();
    nav.go(to);
  };
  return <a href={to} onClick={handle} {...rest}>{children}</a>;
}
