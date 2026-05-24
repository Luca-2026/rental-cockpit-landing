import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Bitte gültige E-Mail-Adresse").max(255),
  consent: z.literal(true, { errorMap: () => ({ message: "Bitte zustimmen." }) }),
});

export function EarlyAccessForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    const subject = encodeURIComponent("Early Access – Rental Cockpit");
    const body = encodeURIComponent(`Bitte für Early Access vormerken:\n${parsed.data.email}`);
    window.location.href = `mailto:luca@sandhoff.org?subject=${subject}&body=${body}`;
    setDone(true);
  };

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        Danke. Bitte versenden Sie die geöffnete E-Mail – wir bestätigen Ihre Anmeldung anschließend per Double-Opt-in.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="ihre@firma.de"
          className="h-11 flex-1 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-semibold text-background hover:opacity-90"
        >
          Vormerken
        </button>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 rounded border-input" />
        <span>
          Ich willige ein, dass meine E-Mail-Adresse für Produkt-Updates verarbeitet wird. Jederzeit widerrufbar.
          Siehe <a href="/datenschutz" className="underline">Datenschutz</a>.
        </span>
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
