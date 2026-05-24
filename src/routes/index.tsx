import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight, Bot, Sparkles, Workflow, FileText, Database, Truck,
  ShieldCheck, Clock, Users, CheckCircle2, MapPin, Server, Zap,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { PilotForm } from "@/components/PilotForm";
import { EarlyAccessForm } from "@/components/EarlyAccessForm";
import { InteractiveDemo } from "@/components/InteractiveDemo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rental Cockpit – Die moderne KI-Vermietplattform für DACH" },
      { name: "description", content: "KI-native Vermietsoftware für DACH-Vermieter: Buchung, CRM, Operations und Rechnung in einem System. Migration in 14 Tagen. Pilotplätze verfügbar." },
      { property: "og:title", content: "Rental Cockpit – Die moderne KI-Vermietplattform für DACH" },
      { property: "og:description", content: "Buchung, CRM, Operations und Rechnung in einem System – KI-nativ. Pilotplätze verfügbar." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Rental Cockpit",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          description: "KI-native Vermietplattform für DACH-Vermieter mit Buchung, CRM, Operations und Rechnung.",
          offers: { "@type": "Offer", price: "499", priceCurrency: "EUR" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Index,
});

const FAQ_ITEMS = [
  { q: "Wann startet Rental Cockpit?", a: "Pilotphase ab Q3 2026, allgemeine Verfügbarkeit ab Q1 2027." },
  { q: "Welche Module sind beim Launch verfügbar?", a: "Zunächst KI-Angebote und KI-CRM. Operations und integrierte Rechnungsstellung folgen in der Pilotphase modulweise." },
  { q: "Kann ich von meiner aktuellen Vermietsoftware migrieren?", a: "Ja. Wir bieten kostenlose Migration für Pilotkunden. Schnittstellen zu gängigen Vermietsystemen sind in Vorbereitung." },
  { q: "Wo werden meine Daten gespeichert?", a: "Ausschließlich in Deutschland. DSGVO-konform, AVV verfügbar." },
  { q: "Was kostet Rental Cockpit?", a: "Transparente Pakete ab 499 €/Monat nach offizieller Markteinführung. Pilotkunden erhalten lebenslang vergünstigte Konditionen." },
  { q: "Brauche ich technisches Know-how?", a: "Nein. Onboarding, Migration und Schulung übernehmen wir." },
  { q: "Bin ich an einen langen Vertrag gebunden?", a: "Nein. Monatliche Kündigungsfrist nach dem ersten Pilotjahr." },
];

function Index() {
  return (
    <>
      <Hero />
      <Problem />
      <AiNative />
      <Solution />
      <Migration />
      <Audience />
      <About />
      <Pilot />
      <Faq />
    </>
  );
}

function AiNative() {
  const pillars = [
    {
      t: "Angebote in Minuten",
      d: "Die KI versteht Kundenanfragen in natürlicher Sprache, dimensioniert das passende Equipment aus Ihrem Katalog und erstellt ein versandfertiges Angebot – inklusive Zubehör, Mengen und Preisen.",
    },
    {
      t: "Kommunikation automatisiert",
      d: "Nachfass-Mails, Reaktivierungs-Anschreiben, Antwortvorschläge im Innendienst-Chat. Stilrichtig, personalisiert, in Ihrem Tonfall – Sie geben nur noch frei.",
    },
    {
      t: "Entscheidungen vorbereitet",
      d: "Die KI priorisiert Anfragen nach Abschlusswahrscheinlichkeit, erkennt Engpässe im Inventar bevor sie entstehen und schlägt Aktionen vor, statt Sie in Listen suchen zu lassen.",
    },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-fade opacity-40" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow text-accent">KI-nativ</div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            KI ist nicht ein Modul. Sie ist <span className="text-accent">das Fundament</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Andere Anbieter kleben einen Chatbot an ihre Altsoftware. Rental Cockpit ist von
            Grund auf um die KI herum gebaut – jeder Workflow nutzt sie, jedes Feature profitiert davon.
            Das spart Vermietern nicht Minuten, sondern Stunden pro Tag.
          </p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.t} className="bg-card p-7">
              <div className="font-mono text-xs text-accent">0{i + 1}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero" />
      <div className="absolute inset-0 -z-10 bg-grid-fade opacity-60" />
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 lg:pt-28 lg:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          KI-nativ · Aktuell im Aufbau · 10 Pilotplätze verfügbar
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Vermietsoftware,<br />die <span className="text-accent">mitdenkt</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Rental Cockpit ist die <span className="text-foreground font-semibold">erste KI-native Vermietplattform</span> für DACH-Vermieter.
          Buchung, CRM, Operations und Rechnung in einem System – mit KI als Fundament,
          nicht als Plug-in. Angebote in Minuten, Kundenkommunikation auf Knopfdruck,
          Routine erledigt sich selbst.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#pilot" className="group inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
            Pilotplatz anfragen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href="#early" className="inline-flex h-12 items-center gap-2 rounded-md border border-input bg-background px-6 text-sm font-semibold hover:bg-muted">
            Für Early Access vormerken
          </a>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Made in Germany</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> DSGVO-konform</span>
          <span className="inline-flex items-center gap-1.5"><Server className="h-3.5 w-3.5" /> Hosting in Deutschland</span>
        </div>

        <ProductMock />
      </div>
    </section>
  );
}

function ProductMock() {
  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-primary/40" />
        <div className="ml-3 text-xs text-muted-foreground">app.rentalcockpit.io / dashboard</div>
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
            <div key={n.l} className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm ${n.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}`}>
              {n.i}{n.l}
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
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-4 w-4 text-accent" /> KI-Angebotsassistent
            </div>
            <div className="mt-3 space-y-2">
              <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                „Open Air für 500 Leute am 12.10. in Köln. Beschallung und Licht benötigt.“
              </div>
              <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-sm">
                <span className="font-semibold text-accent">Rental Cockpit:</span> Danke für die Anfrage. Damit ich das passende Paket dimensioniere, kurze Rückfragen:
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
                  <li>Live-Act: DJ oder Band?</li>
                  <li>Mikrofonierung für Reden / Moderation nötig?</li>
                  <li>Auf- und Abbau am Veranstaltungstag oder zusätzliche Tage?</li>
                </ul>
              </div>
              <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                „DJ, Mikrofonierung für Begrüßung, Auf- und Abbau am selben Tag.“
              </div>
              <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
                <span className="font-semibold text-primary">Angebot erstellt:</span> 4× Line-Array S10 · 1× Digital-Mischpult SQ-5 · 8× LED-Moving-Head · 4× Funkhandmikro · 2× Subwoofer · Inkl. Auf- und Abbau-Kraft · Verfügbar · 8.950 € netto
              </div>
              <p className="text-[11px] text-muted-foreground/60">
                *Nur exemplarisch. Vorschläge und Preise basieren auf dem Inventar und der Preisstruktur des jeweiligen Vermieters und können abweichen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Problem() {
  const items = [
    { i: <Clock className="h-5 w-5" />, t: "Träge und unübersichtlich",
      d: "Komplizierte Menüs, langsame Reaktionszeiten, Schulungen über Wochen. Neue Mitarbeiter brauchen Monate, bis sie produktiv sind." },
    { i: <Workflow className="h-5 w-5" />, t: "Manuell, manuell, manuell",
      d: "Angebote per Hand. Dimensionierung im Kopf. Kundenmails einzeln tippen. Kein System nimmt Vermietern die Routinearbeit ab." },
    { i: <Bot className="h-5 w-5" />, t: "KI nachträglich draufgeklebt",
      d: "Wenn überhaupt KI, dann als Plug-in – nicht als Teil der DNA. Die Plattform denkt nicht mit, sie verwaltet nur." },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <SectionHeader
          eyebrow="Das Problem"
          title="Warum aktuelle Vermietsoftware Vermietern den Job schwer macht."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.t} className="rounded-xl border border-border bg-card p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">{it.i}</div>
              <h3 className="mt-4 font-display text-lg font-semibold">{it.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const features = [
    { i: <Sparkles className="h-5 w-5" />, t: "KI-Buchung & Angebote",
      d: "Kunden beschreiben ihr Vorhaben in natürlicher Sprache – online oder im Innendienst-Chat. Rental Cockpit erstellt sofort ein vollständiges Angebot mit Mengen, Zubehör und Preisen aus Ihrem Katalog. Verfügbarkeit wird live geprüft." },
    { i: <Users className="h-5 w-5" />, t: "KI-CRM mit Kundenhistorie",
      d: "Jede Anfrage, jede Buchung, jeder Schadensfall – an einem Ort. Die KI erinnert an Reaktivierungs-Chancen, schreibt personalisierte Nachfass-Mails und priorisiert Anfragen automatisch." },
    { i: <Truck className="h-5 w-5" />, t: "Operations in Echtzeit",
      d: "Inventar, Verfügbarkeitsplaner, Aufträge, Liefer- und Rücknahme-Workflows, Schadensdokumentation. Mobile-tauglich für den Außendienst." },
    { i: <FileText className="h-5 w-5" />, t: "Rechnung & Buchhaltung integriert",
      d: "ZUGFeRD- und XRechnung-konforme Rechnungen. Direkter Export nach DATEV. Integration mit lexoffice und easybill. Mahnwesen automatisiert." },
  ];
  return (
    <section id="loesung" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <SectionHeader
          eyebrow="Die Lösung"
          title="Eine Plattform. Alle Module. KI an jeder Stelle."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.t} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition hover:border-primary/40 hover:shadow-lg">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">{f.i}</div>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Migration() {
  return (
    <section id="migration" className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground">
            <Zap className="h-3.5 w-3.5" /> 14 Tage
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Wechsel in 14 Tagen. Wir übernehmen die Migration.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Ihre bestehenden Daten – Kunden, Produkte, Buchungshistorie – ziehen wir
            kostenlos auf Rental Cockpit um. Parallel-Betrieb während der Umstellung
            ist möglich. Sie verlieren keinen Tag operatives Geschäft.
          </p>
        </div>
        <div className="grid gap-3">
          {[
            { t: "Tag 1–3", d: "Datenanalyse & Mapping Ihrer bestehenden Datenstrukturen" },
            { t: "Tag 4–10", d: "Migration und Validierung im Parallel-Betrieb" },
            { t: "Tag 11–14", d: "Schulung Ihres Teams und Go-Live" },
          ].map((s) => (
            <div key={s.t} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="font-display text-sm font-bold text-primary">{s.t}</div>
              <div className="text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience() {
  const items = [
    "Vermieter mit 5–50 Mitarbeitern",
    "Eventtechnik, Baumaschinen, Mobiliar, AWP, Veranstaltungstechnik, Tagungstechnik",
    "Unzufrieden mit der aktuellen Vermietsoftware",
    "Bereit für KI als integralen Bestandteil des täglichen Geschäfts",
    "DACH-Region (Deutschland, Österreich, Schweiz)",
  ];
  return (
    <section id="fuer-wen" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <SectionHeader eyebrow="Für wen" title="Für wen Rental Cockpit gebaut wird." />
        <ul className="mx-auto mt-10 grid max-w-3xl gap-3">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
          Über uns
        </div>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Gebaut von Vermietern für Vermieter.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
          Rental Cockpit entsteht aus über zehn Jahren operativer Erfahrung in der
          Vermietbranche. Wir kennen die Pain Points nicht aus Marktstudien, sondern
          aus dem Alltag – weil wir selbst Vermieter sind und mit den Limits aktueller
          Branchensoftware täglich zu tun haben. Die Plattform entsteht in enger
          Zusammenarbeit mit unseren Pilotkunden. Jedes Feature löst ein konkretes
          Problem, kein Selbstzweck.
        </p>
      </div>
    </section>
  );
}

function Pilot() {
  return (
    <section id="pilot" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent-foreground">
            Pilotphase
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Pilotphase: 10 Plätze. Bevorzugte Konditionen.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Wir suchen 10 Vermietunternehmen, die Rental Cockpit gemeinsam mit uns aufbauen.
            Pilotkunden erhalten:
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              "50 % Rabatt im ersten Jahr",
              "Kostenlose Migration ihrer Bestandsdaten",
              "Direkten Draht zur Produktentwicklung",
              "Mitspracherecht beim Feature-Set",
              "Lebenslange Konditionen unterhalb der späteren Listenpreise",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div id="early" className="mt-10 scroll-mt-20 rounded-xl border border-border bg-surface p-5">
            <div className="font-display text-base font-semibold">Noch nicht bereit für ein Gespräch?</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Lassen Sie sich für Early Access vormerken. Wir informieren Sie, sobald wir öffnen.
            </p>
            <div className="mt-4">
              <EarlyAccessForm />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h3 className="font-display text-xl font-semibold">Pilotplatz anfragen</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Wir melden uns innerhalb von 2 Werktagen mit einem Terminvorschlag.
          </p>
          <div className="mt-6">
            <PilotForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-24">
        <SectionHeader eyebrow="FAQ" title="Häufige Fragen" />
        <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-card">
          {FAQ_ITEMS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{f.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
