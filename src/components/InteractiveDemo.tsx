import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, FileText, Users, Database, Truck, Workflow, Send, RotateCcw } from "lucide-react";

type Scenario = {
  label: string;
  prompt: string;
  followups: string[];
  offer: { title: string; items: string[]; price: string };
};

const SCENARIOS: Scenario[] = [
  {
    label: "Open-Air Konzert",
    prompt: "Open Air für 500 Leute am 12.10. in Köln. Beschallung und Licht benötigt.",
    followups: [
      "Live-Act: DJ oder Band?",
      "Mikrofonierung für Reden / Moderation nötig?",
      "Auf- und Abbau am Veranstaltungstag oder zusätzliche Tage?",
    ],
    offer: {
      title: "Open-Air Paket 500 PAX",
      items: [
        "4× Line-Array S10",
        "1× Digital-Mischpult SQ-5",
        "8× LED-Moving-Head",
        "4× Funkhandmikro",
        "2× Subwoofer",
        "Inkl. Auf- und Abbau-Kraft",
      ],
      price: "8.950 € netto",
    },
  },
  {
    label: "Firmen-Gala",
    prompt: "Gala-Dinner für 200 Gäste am 22.11. in München, Hotelballsaal.",
    followups: [
      "Bühne mit Podium und Rednerpult erforderlich?",
      "Tanzfläche mit Lichteffekten gewünscht?",
      "Catering-Equipment (Stehtische, Bestuhlung) Teil der Anfrage?",
    ],
    offer: {
      title: "Gala-Setup 200 PAX",
      items: [
        "2× Line-Array Compact",
        "1× Digital-Mischpult mit Funkstrecken",
        "12× LED-Par für Tischbeleuchtung",
        "1× Bühnenpodium 4×3 m",
        "2× Funkhandmikro + 1× Headset",
      ],
      price: "4.280 € netto",
    },
  },
  {
    label: "Baustellenausstattung",
    prompt: "Baustellencontainer + Stromversorgung für 8 Wochen ab 04.05. in Hamburg.",
    followups: [
      "Sanitärcontainer separat oder kombiniert?",
      "Stromanschluss 32 A oder 63 A CEE?",
      "Lieferung mit Kran-Aufstellung oder Selbstabholung?",
    ],
    offer: {
      title: "Baustellenpaket 8 Wochen",
      items: [
        "1× Bürocontainer 6 m",
        "1× Sanitärcontainer kombiniert",
        "1× Stromverteiler 63 A CEE",
        "Inkl. Lieferung & Kran-Aufstellung",
        "Inkl. Wartungspauschale",
      ],
      price: "6.420 € netto",
    },
  },
];

type Stage =
  | "idle"
  | "typing-user"
  | "ai-thinking"
  | "ai-followups"
  | "user-reply"
  | "ai-offer-thinking"
  | "done";

export function InteractiveDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [draft, setDraft] = useState("");
  const [revealedFollowups, setRevealedFollowups] = useState(0);
  const [userReply, setUserReply] = useState("");
  const [revealedOfferItems, setRevealedOfferItems] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIdx];

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function schedule(fn: () => void, ms: number) {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }

  function reset() {
    clearTimers();
    setStage("idle");
    setDraft("");
    setRevealedFollowups(0);
    setUserReply("");
    setRevealedOfferItems(0);
  }

  function run(idx: number) {
    clearTimers();
    setScenarioIdx(idx);
    setDraft("");
    setRevealedFollowups(0);
    setUserReply("");
    setRevealedOfferItems(0);
    setStage("typing-user");

    const prompt = SCENARIOS[idx].prompt;
    const followups = SCENARIOS[idx].followups;
    const offerItems = SCENARIOS[idx].offer.items;

    // Type the user prompt
    for (let i = 0; i <= prompt.length; i++) {
      schedule(() => setDraft(prompt.slice(0, i)), i * 22);
    }
    const afterType = prompt.length * 22;

    schedule(() => setStage("ai-thinking"), afterType + 200);
    schedule(() => setStage("ai-followups"), afterType + 900);

    followups.forEach((_, i) => {
      schedule(() => setRevealedFollowups(i + 1), afterType + 1100 + i * 450);
    });

    const afterFollowups = afterType + 1100 + followups.length * 450 + 400;
    const reply = "DJ, Mikrofonierung für Begrüßung, Auf- und Abbau am selben Tag.";

    schedule(() => setStage("user-reply"), afterFollowups);
    for (let i = 0; i <= reply.length; i++) {
      schedule(() => setUserReply(reply.slice(0, i)), afterFollowups + i * 18);
    }
    const afterReply = afterFollowups + reply.length * 18;

    schedule(() => setStage("ai-offer-thinking"), afterReply + 200);
    schedule(() => setStage("done"), afterReply + 900);

    offerItems.forEach((_, i) => {
      schedule(() => setRevealedOfferItems(i + 1), afterReply + 1100 + i * 180);
    });
  }

  useEffect(() => () => clearTimers(), []);

  // Auto-scroll transcript as it grows
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [draft, revealedFollowups, userReply, revealedOfferItems, stage]);

  const isRunning = stage !== "idle" && stage !== "done";

  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
        <div className="ml-3 text-xs text-muted-foreground">app.rentalcockpit.io / dashboard</div>
        <div className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Live-Demo
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-surface p-4 md:block">
          {[
            { i: <Sparkles className="h-4 w-4" />, l: "Dashboard", active: true },
            { i: <FileText className="h-4 w-4" />, l: "Angebote" },
            { i: <Users className="h-4 w-4" />, l: "CRM" },
            { i: <Database className="h-4 w-4" />, l: "Inventar" },
            { i: <Truck className="h-4 w-4" />, l: "Operations" },
            { i: <Workflow className="h-4 w-4" />, l: "Rechnungen" },
          ].map((n) => (
            <div
              key={n.l}
              className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                n.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {n.i}
              {n.l}
            </div>
          ))}
        </aside>

        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { l: "Offene Angebote", v: "24", d: "+6 diese Woche" },
              { l: "Auslastung", v: "78 %", d: "KW 38" },
              { l: "Umsatz (MTD)", v: "142.300 €", d: "+12 % YoY" },
            ].map((k) => (
              <div key={k.l} className="rounded-xl border border-border p-4">
                <div className="text-xs text-muted-foreground">{k.l}</div>
                <div className="mt-1 font-display text-2xl font-bold">{k.v}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{k.d}</div>
              </div>
            ))}
          </div>

          {/* AI assistant */}
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bot className="h-4 w-4 text-accent" /> KI-Angebotsassistent
              </div>
              {stage === "done" && (
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" /> Zurücksetzen
                </button>
              )}
            </div>

            {/* Scenario chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => run(i)}
                  disabled={isRunning}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    scenarioIdx === i && stage !== "idle"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Transcript */}
            <div
              ref={transcriptRef}
              className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1"
            >
              {stage === "idle" && (
                <div className="rounded-md border border-dashed border-border bg-surface/50 px-4 py-6 text-center text-sm text-muted-foreground">
                  Wählen Sie ein Beispiel-Szenario, um zu sehen, wie der KI-Angebotsassistent in Echtzeit reagiert.
                </div>
              )}

              {/* User prompt */}
              {stage !== "idle" && (
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary/15 px-3 py-2 text-sm">
                    <span>{draft}</span>
                    {stage === "typing-user" && <Caret />}
                  </div>
                </div>
              )}

              {/* AI thinking */}
              {stage === "ai-thinking" && <Thinking />}

              {/* Followups */}
              {(stage === "ai-followups" ||
                stage === "user-reply" ||
                stage === "ai-offer-thinking" ||
                stage === "done") && (
                <div className="flex">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-accent/30 bg-accent/10 px-3 py-2 text-sm">
                    <div className="font-semibold text-accent">Rental Cockpit</div>
                    <div className="mt-1 text-muted-foreground">
                      Danke für die Anfrage. Damit ich das passende Paket dimensioniere, kurze Rückfragen:
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {scenario.followups.slice(0, revealedFollowups).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-foreground animate-fade-in"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* User reply */}
              {(stage === "user-reply" ||
                stage === "ai-offer-thinking" ||
                stage === "done") && (
                <div className="flex justify-end">
                  <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary/15 px-3 py-2 text-sm">
                    <span>{userReply}</span>
                    {stage === "user-reply" && <Caret />}
                  </div>
                </div>
              )}

              {/* Offer thinking */}
              {stage === "ai-offer-thinking" && <Thinking label="Angebot wird erstellt" />}

              {/* Offer */}
              {stage === "done" && (
                <div className="flex">
                  <div className="w-full max-w-[92%] rounded-2xl rounded-tl-sm border border-primary/40 bg-primary/10 px-4 py-3 text-sm animate-fade-in">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-primary">Angebot erstellt</div>
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                        verfügbar
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{scenario.offer.title}</div>
                    <ul className="mt-2 space-y-1">
                      {scenario.offer.items.slice(0, revealedOfferItems).map((it) => (
                        <li
                          key={it}
                          className="flex items-start gap-2 text-sm animate-fade-in"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    {revealedOfferItems === scenario.offer.items.length && (
                      <div className="mt-3 flex items-center justify-between border-t border-primary/20 pt-2 animate-fade-in">
                        <span className="text-xs text-muted-foreground">Gesamt netto</span>
                        <span className="font-display text-base font-bold text-primary">
                          {scenario.offer.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Input bar (cosmetic) */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
              <input
                readOnly
                value={stage === "typing-user" ? draft : ""}
                placeholder={
                  stage === "idle"
                    ? "Beschreiben Sie Ihre Anfrage – z. B. Open Air für 500 Leute…"
                    : "Live-Demo läuft…"
                }
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button
                onClick={() => run(scenarioIdx)}
                disabled={isRunning}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
                aria-label="Demo starten"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-3 text-[11px] text-muted-foreground/60">
              *Nur exemplarisch. Vorschläge und Preise basieren auf dem Inventar und der
              Preisstruktur des jeweiligen Vermieters und können abweichen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Caret() {
  return <span className="ml-0.5 inline-block h-3.5 w-0.5 -translate-y-0.5 animate-pulse bg-foreground align-middle" />;
}

function Thinking({ label = "Denkt nach" }: { label?: string }) {
  return (
    <div className="flex">
      <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-muted-foreground">
        <span className="text-accent">{label}</span>
        <span className="flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
      style={{ animationDelay: delay }}
    />
  );
}
