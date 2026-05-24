import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – Rental Cockpit" },
      { name: "description", content: "Kontaktieren Sie das Team von Rental Cockpit – per E-Mail oder Telefon." },
      { property: "og:title", content: "Kontakt – Rental Cockpit" },
      { property: "og:description", content: "Kontaktieren Sie das Team von Rental Cockpit – per E-Mail oder Telefon." },
      { property: "og:url", content: "/kontakt" },
    ],
    links: [{ rel: "canonical", href: "/kontakt" }],
  }),
  component: Kontakt,
});

function Kontakt() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Kontakt</h1>
      <p className="mt-4 text-muted-foreground">
        Sie möchten Pilotkunde werden oder haben Fragen zu Rental Cockpit?
        Wir freuen uns auf Ihre Nachricht.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a href="mailto:luca@sandhoff.org" className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/40">
          <Mail className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">E-Mail</div>
            <div className="text-sm text-muted-foreground">luca@sandhoff.org</div>
          </div>
        </a>
        <a href="tel:+4922876388805" className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/40">
          <Phone className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">Telefon</div>
            <div className="text-sm text-muted-foreground">0228 763 888 05</div>
          </div>
        </a>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 sm:col-span-2">
          <MapPin className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold">Anschrift</div>
            <div className="text-sm text-muted-foreground">
              Sandhoff IT- & Mediensysteme<br />
              Marienforster Weg 2, 53343 Wachtberg
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
