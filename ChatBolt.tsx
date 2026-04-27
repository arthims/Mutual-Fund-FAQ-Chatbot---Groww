import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, X, Send, Sparkles, ExternalLink, Eraser } from "lucide-react";

type Msg = { from: "ai" | "user"; text: string; source?: { label: string; url: string } };

const INITIAL: Msg[] = [
  {
    from: "ai",
    text: "Hi — ask me about expense ratio, exit load, minimum SIP, ELSS lock-in, riskometer, benchmark, or how to download your statements. Every answer cites one official source.",
  },
];

const SUGGESTIONS = [
  "What is expense ratio?",
  "Explain exit load",
  "Minimum SIP amount?",
  "ELSS lock-in period",
  "What is the riskometer?",
  "What is a benchmark?",
  "Download CAS statement",
  "Download Groww statement",
];

const SCRIPTED: Record<string, { text: string; source: { label: string; url: string } }> = {
  "What is expense ratio?": {
    text: "The Total Expense Ratio (TER) is the annual fee a mutual fund charges as a % of daily net assets — covering management, admin, and distribution. SEBI caps equity TER at 2.25% (slabs reduce as AUM grows); direct plans are lower than regular plans because they exclude distributor commission. NAV is already net of TER.",
    source: { label: "SEBI · Mutual Funds FAQ", url: "https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=51" },
  },
  "Explain exit load": {
    text: "Exit load is a fee deducted from redemption proceeds if you exit within a specified period — typically 1% if redeemed within 1 year for equity funds. It's set by the AMC, disclosed in the SID/KIM, and applied on the redemption NAV. Liquid and overnight funds usually have nil or graded exit loads.",
    source: { label: "AMFI · Investor Corner", url: "https://www.amfiindia.com/investor-corner/knowledge-center/load-structure-of-mutual-funds.html" },
  },
  "Minimum SIP amount?": {
    text: "There is no SEBI-mandated minimum — each AMC sets its own. Most schemes allow SIPs from ₹500/month, and several (e.g., Nippon India, Quant) accept ₹100. The exact minimum is in the scheme's Scheme Information Document (SID) on the AMC site or AMFI.",
    source: { label: "AMFI · Scheme Documents", url: "https://www.amfiindia.com/investor-corner/knowledge-center/sip.html" },
  },
  "ELSS lock-in period": {
    text: "Equity Linked Savings Schemes (ELSS) have a statutory lock-in of 3 years from each investment date — the shortest among Section 80C instruments. SIP units are locked unit-by-unit (each instalment locks for 3 years from its purchase date). Investments up to ₹1.5 lakh/year qualify for 80C deduction (old regime).",
    source: { label: "Income Tax India · Section 80C", url: "https://incometaxindia.gov.in/Pages/acts/income-tax-act.aspx" },
  },
  "What is the riskometer?": {
    text: "The Riskometer is a SEBI-mandated 6-level risk label (Low → Low to Moderate → Moderate → Moderately High → High → Very High) shown on every mutual fund scheme. Since Jan 2021, it's calculated monthly based on the actual portfolio (credit risk, interest-rate risk, liquidity for debt; market cap, volatility for equity), not just the category.",
    source: { label: "SEBI · Riskometer Circular (Oct 2020)", url: "https://www.sebi.gov.in/legal/circulars/oct-2020/product-labeling-in-mutual-fund-schemes-risk-o-meter_47796.html" },
  },
  "What is a benchmark?": {
    text: "A benchmark is the index a fund's performance is measured against (e.g., Nifty 50 TRI for large-cap, Nifty Midcap 150 TRI for mid-cap). SEBI mandates Total Return Index (TRI) benchmarks since Feb 2018 so dividends are included. From Dec 2021, equity & debt schemes use a tiered benchmark (broad + scheme-specific).",
    source: { label: "SEBI · Tiered Benchmark Circular", url: "https://www.sebi.gov.in/legal/circulars/oct-2021/guiding-principles-for-bringing-uniformity-in-benchmarks-of-mutual-fund-schemes_53362.html" },
  },
  "Download CAS statement": {
    text: "A Consolidated Account Statement (CAS) shows all your mutual fund holdings across AMCs in one PDF. Request it free from CAMS or KFintech using your PAN + email registered with any folio — emailed within minutes, password-protected with your PAN.",
    source: { label: "CAMS · CAS Request", url: "https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement" },
  },
  "Download Groww statement": {
    text: "On Groww: open the app → Profile → Reports → choose Capital Gains, P&L, or Holdings → select financial year → tap Download. The PDF/Excel is emailed and also available in-app. For tax filing, the Capital Gains report is pre-formatted for ITR-2/3.",
    source: { label: "Groww · Help · Reports & Statements", url: "https://groww.in/p/help/category/reports-and-statements" },
  },
};

export function ChatBolt() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    const hit = SCRIPTED[t];
    setTimeout(() => {
      if (hit) {
        setMessages((m) => [...m, { from: "ai", text: hit.text, source: hit.source }]);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "ai",
            text: "I can answer questions on expense ratio, exit load, minimum SIP, ELSS lock-in, riskometer, benchmark, or downloading statements — tap a suggestion below.",
          },
        ]);
      }
    }, 500);
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        aria-label="Open ChatBolt"
        onClick={() => setOpen((o) => !o)}
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="absolute bottom-20 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-bolt text-bolt-foreground shadow-[0_8px_24px_-4px_hsl(var(--bolt)/0.45),0_2px_6px_-2px_hsl(var(--bolt)/0.4)] transition-shadow hover:shadow-[0_12px_32px_-4px_hsl(var(--bolt)/0.55),0_4px_10px_-2px_hsl(var(--bolt)/0.45)] active:scale-[0.96]"
      >
        {open ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Zap className="h-5 w-5 fill-current" strokeWidth={2} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-20 right-4 z-20 flex h-[78%] max-h-[520px] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-hairline bg-card shadow-[0_24px_48px_-12px_rgb(0_0_0/0.18),0_4px_12px_-2px_rgb(0_0_0/0.08)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-hairline bg-card px-4 py-3.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bolt text-bolt-foreground">
                <Zap className="h-4 w-4 fill-current" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">ChatBolt</p>
                <p className="text-[11px] text-muted-foreground">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gain align-middle" />
                  Sourced from official pages only
                </p>
              </div>
              <button
                aria-label="Clear chat"
                onClick={() => {
                  setMessages(INITIAL);
                  setInput("");
                }}
                className="flex h-8 items-center gap-1.5 rounded-full border border-hairline px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                <Eraser className="h-3.5 w-3.5" strokeWidth={2} />
                Clear
              </button>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md bg-secondary text-foreground"
                        : "rounded-bl-md bg-bolt-soft text-foreground"
                    }`}
                  >
                    {m.text}
                    {m.source && (
                      <a
                        href={m.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-bolt underline-offset-2 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" strokeWidth={2} />
                        {m.source.label}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-hairline px-4 py-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  <Sparkles className="h-3 w-3 text-bolt" strokeWidth={2} />
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-hairline px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask: expense ratio, ELSS, riskometer…"
                className="flex-1 bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}