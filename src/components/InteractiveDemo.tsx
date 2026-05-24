import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Sparkles,
  FileText,
  Users,
  Database,
  Truck,
  Workflow,
  Send,
  RotateCcw,
  Download,
  CheckCircle2,
  MousePointerClick,
  ArrowRight,
} from "lucide-react";
import jsPDF from "jspdf";

type Scenario = {
  label: string;
  prompt: string;
  followups: string[];
  reply: string;
  offer: { title: string; items: { name: string; qty: number; price: number }[] };
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
    reply: "DJ, Mikrofonierung für Begrüßung, Auf- und Abbau am selben Tag.",
    offer: {
      title: "Open-Air Paket 500 PAX",
      items: [
        { name: "Line-Array S10", qty: 4, price: 480 },
        { name: "Digital-Mischpult SQ-5", qty: 1, price: 320 },
        { name: "LED-Moving-Head", qty: 8, price: 95 },
        { name: "Funkhandmikro", qty: 4, price: 60 },
        { name: "Subwoofer", qty: 2, price: 240 },
        { name: "Auf- und Abbau-Kraft (Tagessatz)", qty: 4, price: 380 },
      ],
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
    reply: "Podium für Begrüßung, Tanzfläche mit dezentem Licht, kein Catering.",
    offer: {
      title: "Gala-Setup 200 PAX",
      items: [
        { name: "Line-Array Compact", qty: 2, price: 320 },
        { name: "Digital-Mischpult inkl. Funkstrecken", qty: 1, price: 280 },
        { name: "LED-Par für Tischbeleuchtung", qty: 12, price: 45 },
        { name: "Bühnenpodium 4×3 m", qty: 1, price: 420 },
        { name: "Funkhandmikro + Headset", qty: 3, price: 60 },
      ],
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
    reply: "Sanitär kombiniert, 63 A CEE, Lieferung mit Kran.",
    offer: {
      title: "Baustellenpaket 8 Wochen",
      items: [
        { name: "Bürocontainer 6 m (Wochenmiete)", qty: 8, price: 220 },
        { name: "Sanitärcontainer kombiniert (Wochenmiete)", qty: 8, price: 310 },
        { name: "Stromverteiler 63 A CEE", qty: 1, price: 420 },
        { name: "Lieferung & Kran-Aufstellung", qty: 1, price: 980 },
        { name: "Wartungspauschale", qty: 1, price: 320 },
      ],
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

type NavKey = "dashboard" | "angebote" | "crm" | "inventar" | "operations" | "rechnungen";

const NAV: { key: NavKey; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <Sparkles className="h-4 w-4" /> },
  { key: "angebote", label: "Angebote", icon: <FileText className="h-4 w-4" /> },
  { key: "crm", label: "CRM", icon: <Users className="h-4 w-4" /> },
  { key: "inventar", label: "Inventar", icon: <Database className="h-4 w-4" /> },
  { key: "operations", label: "Operations", icon: <Truck className="h-4 w-4" /> },
  { key: "rechnungen", label: "Rechnungen", icon: <Workflow className="h-4 w-4" /> },
];

const EUR = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export function InteractiveDemo() {
  const [view, setView] = useState<NavKey>("dashboard");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [draft, setDraft] = useState("");
  const [revealedFollowups, setRevealedFollowups] = useState(0);
  const [userReply, setUserReply] = useState("");
  const [revealedOfferItems, setRevealedOfferItems] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS[scenarioIdx];
  const offerTotal = scenario.offer.items.reduce((s, i) => s + i.qty * i.price, 0);

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
    setConfirmed(false);
  }

  function run(idx: number) {
    clearTimers();
    setScenarioIdx(idx);
    setDraft("");
    setRevealedFollowups(0);
    setUserReply("");
    setRevealedOfferItems(0);
    setConfirmed(false);
    setStage("typing-user");

    const sc = SCENARIOS[idx];
    const prompt = sc.prompt;

    for (let i = 0; i <= prompt.length; i++) {
      schedule(() => setDraft(prompt.slice(0, i)), i * 22);
    }
    const afterType = prompt.length * 22;

    schedule(() => setStage("ai-thinking"), afterType + 200);
    schedule(() => setStage("ai-followups"), afterType + 900);

    sc.followups.forEach((_, i) => {
      schedule(() => setRevealedFollowups(i + 1), afterType + 1100 + i * 450);
    });

    const afterFollowups = afterType + 1100 + sc.followups.length * 450 + 400;
    const reply = sc.reply;
    schedule(() => setStage("user-reply"), afterFollowups);
    for (let i = 0; i <= reply.length; i++) {
      schedule(() => setUserReply(reply.slice(0, i)), afterFollowups + i * 18);
    }
    const afterReply = afterFollowups + reply.length * 18;

    schedule(() => setStage("ai-offer-thinking"), afterReply + 200);
    schedule(() => setStage("done"), afterReply + 900);

    sc.offer.items.forEach((_, i) => {
      schedule(() => setRevealedOfferItems(i + 1), afterReply + 1100 + i * 180);
    });
  }

  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [draft, revealedFollowups, userReply, revealedOfferItems, stage]);

  const isRunning = stage !== "idle" && stage !== "done";

  function downloadPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;
    let y = M;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Rental Cockpit", M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Angebot · " + new Date().toLocaleDateString("de-DE"), W - M, y, { align: "right" });
    y += 28;

    doc.setDrawColor(220);
    doc.line(M, y, W - M, y);
    y += 24;

    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(scenario.offer.title, M, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text("Anfrage: " + scenario.prompt, M, y, { maxWidth: W - M * 2 });
    y += 28;

    // Table header
    doc.setTextColor(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Position", M, y);
    doc.text("Menge", W - M - 200, y, { align: "right" });
    doc.text("Einzelpreis", W - M - 100, y, { align: "right" });
    doc.text("Summe", W - M, y, { align: "right" });
    y += 8;
    doc.line(M, y, W - M, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    scenario.offer.items.forEach((it) => {
      doc.text(it.name, M, y, { maxWidth: W - M * 2 - 240 });
      doc.text(String(it.qty), W - M - 200, y, { align: "right" });
      doc.text(EUR(it.price), W - M - 100, y, { align: "right" });
      doc.text(EUR(it.qty * it.price), W - M, y, { align: "right" });
      y += 18;
    });

    y += 6;
    doc.line(M, y, W - M, y);
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.text("Gesamt netto", W - M - 100, y, { align: "right" });
    doc.text(EUR(offerTotal), W - M, y, { align: "right" });

    y += 40;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Dies ist ein automatisch erstelltes Beispiel-Angebot. Preise und Verfügbarkeit basieren auf Inventar und Preisstruktur des Vermieters.",
      M,
      y,
      { maxWidth: W - M * 2 },
    );

    doc.save(`Angebot-${scenario.label.replace(/\s+/g, "-")}.pdf`);
  }

  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent/70" />
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary/40" />
        <div className="ml-2 min-w-0 flex-1 truncate text-[11px] text-muted-foreground sm:ml-3 sm:text-xs">
          app.rentalcockpit.io / {view}
        </div>
        <div className="ml-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-accent sm:px-2.5 sm:text-[10px]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="hidden xs:inline">Klickbare</span> Live-Demo
        </div>
      </div>

      {/* Mobile module switcher (replaces sidebar on small screens) */}
      <div className="border-b border-border bg-surface/60 md:hidden">
        <div className="flex gap-1.5 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => {
            const active = view === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r border-border bg-surface p-3 md:block">
          {NAV.map((n) => {
            const active = view === n.key;
            return (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={`mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                {n.icon}
                {n.label}
              </button>
            );
          })}
          <div className="mt-4 rounded-md border border-dashed border-accent/40 bg-accent/5 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <div className="mb-1 inline-flex items-center gap-1 font-medium text-accent">
              <MousePointerClick className="h-3 w-3" /> Tipp
            </div>
            Klicken Sie sich durch die Module – oder starten Sie die KI-Demo im Dashboard.
          </div>
        </aside>

        <div className="min-w-0 p-3 sm:p-6">
          {view === "dashboard" && (
            <DashboardView
              scenario={scenario}
              scenarioIdx={scenarioIdx}
              stage={stage}
              draft={draft}
              revealedFollowups={revealedFollowups}
              userReply={userReply}
              revealedOfferItems={revealedOfferItems}
              confirmed={confirmed}
              setConfirmed={setConfirmed}
              isRunning={isRunning}
              run={run}
              reset={reset}
              transcriptRef={transcriptRef}
              offerTotal={offerTotal}
              downloadPdf={downloadPdf}
              goTo={setView}
            />
          )}
          {view === "angebote" && <AngeboteView />}
          {view === "crm" && <CrmView />}
          {view === "inventar" && <InventarView />}
          {view === "operations" && <OperationsView />}
          {view === "rechnungen" && <RechnungenView />}
        </div>
      </div>
    </div>
  );
}

function DashboardView(props: {
  scenario: Scenario;
  scenarioIdx: number;
  stage: Stage;
  draft: string;
  revealedFollowups: number;
  userReply: string;
  revealedOfferItems: number;
  confirmed: boolean;
  setConfirmed: (b: boolean) => void;
  isRunning: boolean;
  run: (i: number) => void;
  reset: () => void;
  transcriptRef: React.RefObject<HTMLDivElement | null>;
  offerTotal: number;
  downloadPdf: () => void;
  goTo: (v: NavKey) => void;
}) {
  const {
    scenario,
    scenarioIdx,
    stage,
    draft,
    revealedFollowups,
    userReply,
    revealedOfferItems,
    confirmed,
    setConfirmed,
    isRunning,
    run,
    reset,
    transcriptRef,
    offerTotal,
    downloadPdf,
    goTo,
  } = props;

  return (
    <>
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

      <div className="mt-4 rounded-xl border-2 border-accent/40 bg-gradient-to-br from-accent/5 to-transparent p-4 shadow-lg shadow-accent/5">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <div className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate">KI-Angebotsassistent</span>
            <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
              Interaktiv
            </span>
          </div>
          {stage === "done" && (
            <button
              onClick={reset}
              aria-label="Demo zurücksetzen"
              className="inline-flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground transition hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline">Zurücksetzen</span>
            </button>
          )}
        </div>

        {stage === "idle" && (
          <p className="mt-2 text-xs text-muted-foreground">
            <MousePointerClick className="mr-1 inline h-3 w-3 text-accent" />
            Klicken Sie ein Beispiel-Szenario, um die Live-Demo zu starten.
          </p>
        )}

        {/* Scenario chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => run(i)}
              disabled={isRunning}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                scenarioIdx === i && stage !== "idle"
                  ? "border-accent bg-accent text-accent-foreground shadow-md"
                  : "border-accent/40 bg-accent/5 text-foreground hover:border-accent hover:bg-accent/10 hover:shadow"
              }`}
            >
              {!(scenarioIdx === i && stage !== "idle") && (
                <Sparkles className="h-3 w-3 text-accent transition group-hover:scale-110" />
              )}
              {s.label}
            </button>
          ))}
        </div>

        {/* Transcript */}
        <div ref={transcriptRef} className="mt-4 max-h-[460px] space-y-2 overflow-y-auto pr-1">
          {stage === "idle" && (
            <div className="rounded-md border border-dashed border-accent/30 bg-accent/5 px-4 py-8 text-center">
              <MousePointerClick className="mx-auto h-5 w-5 text-accent" />
              <div className="mt-2 text-sm font-medium text-foreground">Live-Demo starten</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Wählen Sie oben ein Szenario – der Assistent tippt live, fragt nach und erstellt ein
                Angebot mit PDF.
              </div>
            </div>
          )}

          {stage !== "idle" && (
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary/15 px-3 py-2 text-sm">
                <span>{draft}</span>
                {stage === "typing-user" && <Caret />}
              </div>
            </div>
          )}

          {stage === "ai-thinking" && <Thinking />}

          {(stage === "ai-followups" ||
            stage === "user-reply" ||
            stage === "ai-offer-thinking" ||
            stage === "done") && (
            <div className="flex">
              <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-accent/30 bg-accent/10 px-3 py-2 text-sm">
                <div className="font-semibold text-accent">Rental Cockpit</div>
                <div className="mt-1 text-muted-foreground">
                  Danke für die Anfrage. Kurze Rückfragen, damit ich passgenau dimensioniere:
                </div>
                <ul className="mt-1.5 space-y-1">
                  {scenario.followups.slice(0, revealedFollowups).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground animate-fade-in">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {(stage === "user-reply" || stage === "ai-offer-thinking" || stage === "done") && (
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary/15 px-3 py-2 text-sm">
                <span>{userReply}</span>
                {stage === "user-reply" && <Caret />}
              </div>
            </div>
          )}

          {stage === "ai-offer-thinking" && <Thinking label="Angebot wird erstellt" />}

          {stage === "done" && (
            <div className="flex">
              <div className="w-full rounded-2xl rounded-tl-sm border border-primary/40 bg-card shadow-lg animate-fade-in">
                {/* PDF-style preview */}
                <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Angebot.pdf · Vorschau
                  </div>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    bereit
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-baseline justify-between">
                    <div className="font-display text-base font-bold">{scenario.offer.title}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date().toLocaleDateString("de-DE")}
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-xs">
                      <thead className="bg-surface text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Position</th>
                          <th className="px-3 py-2 text-right font-medium">Menge</th>
                          <th className="px-3 py-2 text-right font-medium">Einzel</th>
                          <th className="px-3 py-2 text-right font-medium">Summe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenario.offer.items.slice(0, revealedOfferItems).map((it) => (
                          <tr key={it.name} className="border-t border-border animate-fade-in">
                            <td className="px-3 py-2">{it.name}</td>
                            <td className="px-3 py-2 text-right">{it.qty}</td>
                            <td className="px-3 py-2 text-right text-muted-foreground">{EUR(it.price)}</td>
                            <td className="px-3 py-2 text-right font-medium">{EUR(it.qty * it.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {revealedOfferItems === scenario.offer.items.length && (
                    <div className="animate-fade-in space-y-3">
                      <div className="flex items-center justify-between border-t border-border pt-2">
                        <span className="text-xs text-muted-foreground">Gesamt netto</span>
                        <span className="font-display text-base font-bold text-primary">
                          {EUR(offerTotal)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                        {!confirmed ? (
                          <button
                            onClick={() => setConfirmed(true)}
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Angebot bestätigen
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-3 py-2 text-xs font-semibold text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Bestätigt – bereit für Auftrag/Rechnung
                          </span>
                        )}
                        <button
                          onClick={downloadPdf}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:bg-surface"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF herunterladen
                        </button>
                        {confirmed && (
                          <>
                            <button
                              onClick={() => goTo("operations")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:bg-surface"
                            >
                              <Truck className="h-3.5 w-3.5" /> In Auftrag wandeln
                              <ArrowRight className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => goTo("rechnungen")}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:bg-surface"
                            >
                              <Workflow className="h-3.5 w-3.5" /> In Rechnung wandeln
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-accent/30 bg-surface px-3 py-2 shadow-inner">
          <Sparkles className="h-4 w-4 text-accent" />
          <input
            readOnly
            aria-label="Demo-Eingabe (Vorschau)"
            value={stage === "typing-user" ? draft : ""}
            placeholder={
              stage === "idle"
                ? "→ Klicken Sie ein Szenario, um die Demo zu starten…"
                : "Live-Demo läuft…"
            }
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-accent/70"
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
          *Nur exemplarisch. Vorschläge und Preise basieren auf dem Inventar und der Preisstruktur des
          jeweiligen Vermieters und können abweichen.
        </p>
      </div>
    </>
  );
}

/* ---------- Other module views (mock data) ---------- */

function ModuleHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function AngeboteView() {
  const rows = [
    { nr: "A-2451", kunde: "Stadtfest Köln", betrag: "8.950 €", status: "Versendet" },
    { nr: "A-2450", kunde: "Hotel Bayerischer Hof", betrag: "4.280 €", status: "Bestätigt" },
    { nr: "A-2449", kunde: "Bauunternehmen Nord", betrag: "6.420 €", status: "Entwurf" },
    { nr: "A-2448", kunde: "Marketing GmbH", betrag: "2.140 €", status: "Versendet" },
  ];
  return (
    <>
      <ModuleHeader title="Angebote" subtitle="Alle Anfragen und Angebote im Überblick." />
      <DataTable
        head={["Nr.", "Kunde", "Betrag", "Status"]}
        rows={rows.map((r) => [r.nr, r.kunde, r.betrag, <StatusBadge key="s" label={r.status} />])}
      />
    </>
  );
}

function CrmView() {
  const rows = [
    { name: "Stadtfest Köln", branche: "Event", letzter: "vor 2 Tagen", umsatz: "84.200 €" },
    { name: "Hotel Bayerischer Hof", branche: "Hospitality", letzter: "heute", umsatz: "112.800 €" },
    { name: "Bauunternehmen Nord", branche: "Bau", letzter: "vor 1 Woche", umsatz: "46.300 €" },
    { name: "Marketing GmbH", branche: "Agentur", letzter: "vor 3 Tagen", umsatz: "23.900 €" },
  ];
  return (
    <>
      <ModuleHeader title="CRM" subtitle="Kunden, Kontakte und Historie." />
      <DataTable
        head={["Kunde", "Branche", "Letzter Kontakt", "Umsatz YTD"]}
        rows={rows.map((r) => [r.name, r.branche, r.letzter, r.umsatz])}
      />
    </>
  );
}

function InventarView() {
  const rows = [
    { art: "Line-Array S10", bestand: 12, verfuegbar: 4, status: "Knapp" },
    { art: "Digital-Mischpult SQ-5", bestand: 6, verfuegbar: 3, status: "OK" },
    { art: "LED-Moving-Head", bestand: 24, verfuegbar: 14, status: "OK" },
    { art: "Bürocontainer 6 m", bestand: 8, verfuegbar: 2, status: "Knapp" },
  ];
  return (
    <>
      <ModuleHeader title="Inventar" subtitle="Bestand, Verfügbarkeiten und Wartung." />
      <DataTable
        head={["Artikel", "Bestand", "Verfügbar", "Status"]}
        rows={rows.map((r) => [r.art, r.bestand, r.verfuegbar, <StatusBadge key="s" label={r.status} />])}
      />
    </>
  );
}

function OperationsView() {
  const rows = [
    { auftrag: "OP-882", projekt: "Open-Air Köln", termin: "12.10.", crew: "4 Pers.", status: "Geplant" },
    { auftrag: "OP-881", projekt: "Gala München", termin: "22.11.", crew: "3 Pers.", status: "Bestätigt" },
    { auftrag: "OP-880", projekt: "Baustelle HH", termin: "04.05.", crew: "Lieferung", status: "Tour geplant" },
  ];
  return (
    <>
      <ModuleHeader title="Operations" subtitle="Touren, Crew-Planung und Auf-/Abbau." />
      <DataTable
        head={["Auftrag", "Projekt", "Termin", "Crew", "Status"]}
        rows={rows.map((r) => [r.auftrag, r.projekt, r.termin, r.crew, <StatusBadge key="s" label={r.status} />])}
      />
    </>
  );
}

function RechnungenView() {
  const rows = [
    { nr: "R-1042", kunde: "Hotel Bayerischer Hof", betrag: "4.280 €", status: "Bezahlt" },
    { nr: "R-1041", kunde: "Marketing GmbH", betrag: "2.140 €", status: "Offen" },
    { nr: "R-1040", kunde: "Stadtfest Köln", betrag: "8.950 €", status: "Versendet" },
  ];
  return (
    <>
      <ModuleHeader title="Rechnungen" subtitle="Faktura, Mahnwesen und Zahlungseingänge." />
      <DataTable
        head={["Nr.", "Kunde", "Betrag", "Status"]}
        rows={rows.map((r) => [r.nr, r.kunde, r.betrag, <StatusBadge key="s" label={r.status} />])}
      />
    </>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border transition hover:bg-surface/60">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const tone =
    label === "Bezahlt" || label === "Bestätigt"
      ? "bg-primary/15 text-primary"
      : label === "Offen" || label === "Knapp"
        ? "bg-destructive/15 text-destructive"
        : "bg-accent/15 text-accent";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>
      {label}
    </span>
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
