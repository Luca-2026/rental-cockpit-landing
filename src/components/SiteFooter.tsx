import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-base font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">RC</span>
            Rental Cockpit
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Die moderne KI-Vermietplattform für DACH.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Rechtliches</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/datenschutz" className="hover:text-foreground">Datenschutz</Link></li>
            <li><Link to="/impressum" className="hover:text-foreground">Impressum</Link></li>
            <li><Link to="/kontakt" className="hover:text-foreground">Kontakt</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Kontakt</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:luca@sandhoff.org" className="hover:text-foreground">luca@sandhoff.org</a></li>
            <li><a href="tel:+4922876388805" className="hover:text-foreground">0228 763 888 05</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <div>© {new Date().getFullYear()} Sandhoff IT- & Mediensysteme. Alle Rechte vorbehalten.</div>
          <div>Made in Germany · Hosting Frankfurt · DSGVO-konform</div>
        </div>
      </div>
    </footer>
  );
}
