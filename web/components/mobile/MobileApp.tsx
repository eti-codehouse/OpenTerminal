"use client";

import { useState } from "react";
import type { WidgetInstance } from "../../store/terminal";
import CommandPalette from "../CommandPalette";
import ChartWidget from "../widgets/ChartWidget";
import QuoteWidget from "../widgets/QuoteWidget";
import WatchlistWidget from "../widgets/WatchlistWidget";
import AdviceWidget from "../widgets/AdviceWidget";
import MobileTopBar from "./MobileTopBar";
import MobileTabBar, { type MobileTab } from "./MobileTabBar";

const linked = (id: string, type: WidgetInstance["type"]): WidgetInstance => ({
  id,
  type,
  linked: true,
});

function ActiveWidget({ tab }: { tab: MobileTab }) {
  switch (tab) {
    case "chart":
      return <ChartWidget widget={linked("m-chart", "chart")} />;
    case "quote":
      return <QuoteWidget widget={linked("m-quote", "quote")} />;
    case "watchlist":
      return <WatchlistWidget />;
    case "advice":
      return <AdviceWidget />;
  }
}

export default function MobileApp() {
  const [tab, setTab] = useState<MobileTab>("chart");

  return (
    <div className="mobile-app">
      <MobileTopBar />
      <main className="mobile-body">
        <ActiveWidget tab={tab} />
      </main>
      <MobileTabBar active={tab} onSelect={setTab} />
      <CommandPalette />
    </div>
  );
}
