import "./fx.css";

/* Drifting colour light for a section: three soft blobs in the given colours.
   Blur is applied once; only transform animates, so it stays cheap to scroll. */
export function Aurora({ colors, className = "" }) {
  const [a, b, c] = colors;
  return (
    <div className={`fx-aurora ${className}`} aria-hidden="true" style={{ "--fa": a, "--fb": b, "--fc": c || a }}>
      <i /><i /><i />
    </div>
  );
}
