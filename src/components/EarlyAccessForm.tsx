import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Bitte gültige E-Mail-Adresse").max(255),
  consent: z.literal(true, { errorMap: () => ({ message: "Bitte zustimmen." }) }),
});

export function EarlyAccessForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      email: String(fd.get("email") ?? ""),
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Eingabe ungültig.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "early-access", ...parsed.data }),
      });
      if (!res.ok) throw new Error("send failed");
      setDone(true);
    } catch {
      setError("Versand fehlgeschlagen. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        Danke. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet – Sie stehen jetzt auf der Early-Access-Liste.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="ea-email" className="sr-only">E-Mail-Adresse</label>
        <input
          id="ea-email"
          name="email"
          type="email"
          required
          aria-label="E-Mail-Adresse"
          placeholder="ihre@firma.de"
          className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Wird gesendet…" : "Vormerken"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          id="ea-consent"
          type="checkbox"
          name="consent"
          aria-label="Einwilligung Datenverarbeitung"
          className="mt-0.5 h-4 w-4 rounded border-input"
        />
        <span>
          Ich willige ein, dass meine E-Mail-Adresse für Produkt-Updates verarbeitet wird. Jederzeit widerrufbar.
          Siehe <a href="/datenschutz" className="underline">Datenschutz</a>.
        </span>
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
