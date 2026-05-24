import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – Rental Cockpit" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG." },
      { property: "og:title", content: "Impressum – Rental Cockpit" },
      { property: "og:description", content: "Impressum und Anbieterkennzeichnung gemäß § 5 DDG." },
      { property: "og:url", content: "/impressum" },
    ],
    links: [{ rel: "canonical", href: "/impressum" }],
  }),
  component: Impressum,
});

function Impressum() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Impressum</h1>

      <h2 className="mt-10 font-display text-xl font-semibold">Angaben gemäß § 5 DDG</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground">
        Sandhoff IT- & Mediensysteme<br />
        Luca Sandhoff<br />
        Marienforster Weg 2<br />
        53343 Wachtberg
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Kontakt</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Telefon: <a className="underline" href="tel:+4922876388805">0228 763 888 05</a><br />
        E-Mail: <a className="underline" href="mailto:luca@sandhoff.org">luca@sandhoff.org</a><br />
        <a className="underline" href="https://sandhoff.org/kontakt" target="_blank" rel="noreferrer">sandhoff.org/kontakt</a>
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Umsatzsteuer</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE313102024
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Verantwortlich für journalistisch-redaktionelle Inhalte</h2>
      <p className="mt-3 text-sm leading-relaxed">
        Gemäß § 18 Abs. 2 MStV:<br />
        Luca Sandhoff<br />
        Marienforster Weg 2<br />
        53343 Wachtberg
      </p>

      <h2 className="mt-12 font-display text-2xl font-bold">Haftungsausschluss</h2>

      <h3 className="mt-6 font-display text-lg font-semibold">Haftung für Inhalte</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Als Diensteanbieter
        sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte nach den allgemeinen Gesetzen
        verantwortlich. Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter
        fremder Informationen besteht nicht.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold">Haftung für Links</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir
        keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
        Anbieter verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden entsprechende
        Links umgehend entfernt.
      </p>

      <h3 className="mt-6 font-display text-lg font-semibold">Urheberrecht</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen dem deutschen
        Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Form der Verwertung
        außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des
        jeweiligen Autors. Downloads und Kopien sind nur für den privaten, nicht
        kommerziellen Gebrauch gestattet.
      </p>
    </article>
  );
}
