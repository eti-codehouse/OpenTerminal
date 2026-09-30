"use client";

export type MobileTab = "chart" | "quote" | "watchlist" | "advice";

const TABS: Array<{ id: MobileTab; label: string }> = [
  { id: "chart", label: "CHART" },
  { id: "quote", label: "QUOTE" },
  { id: "watchlist", label: "WATCH" },
  { id: "advice", label: "ADVICE" },
];

export default function MobileTabBar({
  active,
  onSelect,
}: {
  active: MobileTab;
  onSelect: (tab: MobileTab) => void;
}) {
  return (
    <nav className="mobile-tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`mobile-tabbar-btn ${active === t.id ? "active" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
