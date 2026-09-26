"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiGet, fmt, type Candle, type Quote } from "../../lib/api";
import { sma, ema, type Point } from "../../lib/indicators";
import { useTerminal } from "../../store/terminal";
import Flash from "../Flash";

const lastVal = (pts: Point[]): number | null => (pts.length > 0 ? pts[pts.length - 1].value : null);

// Only price-comparable moving averages: the advice is "is last price above the
// indicator's latest value", which is only meaningful for a line on the price scale.
const FUNCTIONS: Record<string, (c: Candle[]) => number | null> = {
  SMA20: (c) => lastVal(sma(c, 20)),
  SMA50: (c) => lastVal(sma(c, 50)),
  SMA100: (c) => lastVal(sma(c, 100)),
  SMA200: (c) => lastVal(sma(c, 200)),
  EMA20: (c) => lastVal(ema(c, 20)),
  EMA50: (c) => lastVal(ema(c, 50)),
  EMA200: (c) => lastVal(ema(c, 200)),
};

export default function AdviceWidget() {
  const list = useTerminal((s) => s.adviceList);
  const addTicker = useTerminal((s) => s.addToAdviceList);
  const removeTicker = useTerminal((s) => s.removeFromAdviceList);
  const fn = useTerminal((s) => s.adviceFn);
  const setFn = useTerminal((s) => s.setAdviceFn);
  const setActiveSymbol = useTerminal((s) => s.setActiveSymbol);
  const [input, setInput] = useState("");

  const { data: quotes = [] } = useQuery({
    queryKey: ["advice-quotes", list.join(",")],
    queryFn: () => apiGet<Quote[]>(`/api/quotes?symbols=${list.join(",")}`),
    enabled: list.length > 0,
    refetchInterval: 1_000,
  });

  // 5 years of daily candles per ticker, feeding the indicator. Refetched slowly
  // since a 200-day average barely moves intraday; the last price comes from quotes.
  const histories = useQueries({
    queries: list.map((sym) => ({
      queryKey: ["advice-history", sym],
      queryFn: () => apiGet<Candle[]>(`/api/history/${sym}?range=5Y`),
      refetchInterval: 60_000,
    })),
  });

  const compute = FUNCTIONS[fn] ?? FUNCTIONS.SMA200;

  return (
    <div>
      <div className="flex gap-1 p-1 items-center">
        <form
          className="flex gap-1 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              addTicker(input.trim());
              setInput("");
            }
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add ticker…"
            className="flex-1"
          />
          <button className="term-btn" type="submit">+</button>
        </form>
        <select value={fn} onChange={(e) => setFn(e.target.value)} title="Indicator applied to every ticker">
          {Object.keys(FUNCTIONS).map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Sym</th><th>Last</th><th>{fn}</th><th>Advice</th><th></th></tr>
        </thead>
        <tbody>
          {list.map((sym, i) => {
            const q = quotes.find((d) => d.symbol === sym);
            const candles = histories[i]?.data;
            const price = q?.price ?? null;
            const indVal = candles ? compute(candles) : null;
            const advice = price !== null && indVal !== null ? (price > indVal ? "IN" : "OUT") : null;
            return (
              <tr key={sym} onClick={() => setActiveSymbol(sym)}>
                <td className="font-bold">{sym}</td>
                <td><Flash value={price}>{fmt(price)}</Flash></td>
                <td>{fmt(indVal)}</td>
                <td className={advice === "IN" ? "up" : advice === "OUT" ? "down" : "dim"}>
                  {advice ?? "…"}
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTicker(sym);
                    }}
                    className="dim hover:text-[var(--down)]"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
