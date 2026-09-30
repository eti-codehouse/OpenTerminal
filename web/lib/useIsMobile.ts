"use client";

import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

/** True on narrow/mobile viewports. `null` until mounted to avoid rendering the wrong shell on first paint. */
export function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}
