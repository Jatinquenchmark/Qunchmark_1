import { createContext, useContext } from "react";

/* The app swaps pages without a full reload. NavContext exposes the `nav`
   object built in App.jsx (go / open / section / scrollToId …) to any component. */
export const NavContext = createContext(null);
export const useNav = () => useContext(NavContext);
