"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "../lib/useIsMobile";

const Terminal = dynamic(() => import("../components/Terminal"), { ssr: false });
const MobileApp = dynamic(() => import("../components/mobile/MobileApp"), { ssr: false });

export default function Home() {
  const isMobile = useIsMobile();
  if (isMobile === null) return null;
  return isMobile ? <MobileApp /> : <Terminal />;
}
