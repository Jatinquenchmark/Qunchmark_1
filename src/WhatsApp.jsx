import { whatsappLink } from "./lib/enquiry";
import "./whatsapp.css";

/* WhatsApp brand mark */
export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16.04 3C9.06 3 3.4 8.6 3.4 15.52c0 2.21.59 4.37 1.7 6.27L3.3 28.5l6.9-1.78a12.7 12.7 0 0 0 5.84 1.43h.01c6.97 0 12.64-5.6 12.64-12.52C28.69 8.6 23.01 3 16.04 3Zm0 22.98h-.01c-1.89 0-3.74-.5-5.36-1.45l-.38-.22-4.1 1.06 1.1-3.96-.25-.4a10.3 10.3 0 0 1-1.6-5.49c0-5.74 4.71-10.41 10.6-10.41 5.84 0 10.6 4.67 10.6 10.41 0 5.75-4.76 10.46-10.6 10.46Zm5.81-7.8c-.32-.16-1.89-.92-2.18-1.03-.29-.1-.5-.16-.72.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.56-.95-.84-1.59-1.87-1.77-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.71-.98-2.35-.26-.62-.53-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63 0 1.55 1.14 3.05 1.3 3.26.16.21 2.24 3.4 5.43 4.77.76.32 1.35.52 1.81.66.76.24 1.45.2 2 .12.61-.09 1.89-.76 2.15-1.5.27-.74.27-1.37.19-1.5-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  );
}

/* floating "chat on WhatsApp" button, shown on every page */
export function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with QuenchMark on WhatsApp (opens in a new tab)"
    >
      <WhatsAppIcon />
      <span className="wa-float-label">Chat on WhatsApp</span>
    </a>
  );
}
