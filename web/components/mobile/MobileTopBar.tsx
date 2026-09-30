"use client";

import { useTerminal } from "../../store/terminal";

function nyseOpen(): boolean {
  const ny = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = ny.getDay();
  const mins = ny.getHours() * 60 + ny.getMinutes();
  return day >= 1 && day <= 5 && mins >= 570 && mins < 960; // 09:30–16:00
}

export default function MobileTopBar() {
  const activeSymbol = useTerminal((s) => s.activeSymbol);
  const setCommandOpen = useTerminal((s) => s.setCommandOpen);
  const open = nyseOpen();

  return (
    <header className="mobile-topbar">
      <div className="flex items-center gap-2 px-3 h-7">
        <span className="amber font-bold tracking-widest text-[11px]">OPENTERMINAL</span>
        <span className={`text-[10px] ${open ? "up" : "down"}`}>● {open ? "OPEN" : "CLOSED"}</span>
      </div>
      <button className="term-btn mobile-search" onClick={() => setCommandOpen(true)}>
        <span className="amber font-bold">{activeSymbol}</span>
        <span className="dim ml-2">search symbol…</span>
      </button>
    </header>
  );
}
