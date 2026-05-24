import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutz – Rental Cockpit" },
      { name: "description", content: "Datenschutzerklärung von Rental Cockpit nach DSGVO." },
      { property: "og:title", content: "Datenschutz – Rental Cockpit" },
      { property: "og:description", content: "Datenschutzerklärung von Rental Cockpit nach DSGVO." },
      { property: "og:url", content: "https://rentalcockpit.io/datenschutz" },
    ],
    links: [{ rel: "canonical", href: "https://rentalcockpit.io/datenschutz" }],
  }),
  component: Datenschutz,
});

function Datenschutz() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Datenschutzerklärung</h1>

      <div className="mt-6 rounded-md border border-border bg-surface p-4 text-sm text-muted-foreground">
        Diese Datenschutzerklärung wird vor dem offiziellen Launch durch eine vollständige Version ersetzt.
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">1. Verantwortlicher</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Sandhoff IT- & Mediensysteme, Luca Sandhoff, Marienforster Weg 2, 53343 Wachtberg.
        E-Mail: <a className="underline" href="mailto:luca@sandhoff.org">luca@sandhoff.org</a>.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">2. Allgemeines zur Datenverarbeitung</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies
        zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
        erforderlich ist. Die Verarbeitung erfolgt regelmäßig nur nach Einwilligung des Nutzers
        (Art. 6 Abs. 1 lit. a DSGVO) oder zur Erfüllung eines Vertrages (Art. 6 Abs. 1 lit. b DSGVO).
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">3. Bereitstellung der Website und Server-Logs</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Beim Aufruf unserer Website werden automatisch technische Daten an unseren Server übermittelt
        (z. B. IP-Adresse, Datum/Uhrzeit, Browsertyp). Diese werden nur kurzfristig und ausschließlich
        zur Sicherstellung des Betriebs verarbeitet (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">4. Kontakt- und Pilotanfragen</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Wenn Sie uns über das Kontaktformular oder per E-Mail kontaktieren, verarbeiten wir
        die übermittelten Daten ausschließlich zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage
        ist Art. 6 Abs. 1 lit. b und f DSGVO. Sie erhalten eine Bestätigung per Double-Opt-in.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">5. Early-Access-Liste</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Mit Ihrer Anmeldung zur Early-Access-Liste willigen Sie ein, dass wir Ihre E-Mail-Adresse
        zur Information über Produkt-Updates verarbeiten (Art. 6 Abs. 1 lit. a DSGVO). Sie können
        diese Einwilligung jederzeit widerrufen.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">6. Cookies</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Wir setzen ausschließlich technisch notwendige Cookies ein, soweit Sie keiner weiteren
        Verwendung ausdrücklich zugestimmt haben.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">7. Hosting</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Unsere Website und alle personenbezogenen Daten werden ausschließlich in Deutschland
        gehostet. Eine Auftragsverarbeitungsvereinbarung (AVV) ist verfügbar.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">8. Ihre Rechte</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sie haben gegenüber uns das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung
        der Verarbeitung, Datenübertragbarkeit sowie das Recht auf Widerspruch und Beschwerde
        bei einer Aufsichtsbehörde.
      </p>
    </article>
  );
}
