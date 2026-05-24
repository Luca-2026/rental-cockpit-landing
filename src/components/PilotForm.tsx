import { useState } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(120),
  company: z.string().trim().min(2, "Bitte geben Sie Ihr Unternehmen an.").max(150),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(255),
  currentSoftware: z.string().trim().max(150).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Bitte stimmen Sie der Datenverarbeitung zu." }) }),
});

export function PilotForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      currentSoftware: String(fd.get("currentSoftware") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) errs[String(err.path[0])] = err.message;
      });
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Fallback: open prefilled E-Mail (Backend-Anbindung folgt)
    const body = encodeURIComponent(
      `Name: ${parsed.data.name}\nUnternehmen: ${parsed.data.company}\nE-Mail: ${parsed.data.email}\nAktuelle Software: ${parsed.data.currentSoftware || "-"}\n\nNachricht:\n${parsed.data.message || "-"}`
    );
    const subject = encodeURIComponent("Pilotplatz-Anfrage – Rental Cockpit");
    window.location.href = `mailto:luca@sandhoff.org?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="font-display text-lg font-semibold">Vielen Dank.</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Ihre Anfrage wurde vorbereitet. Bitte versenden Sie die geöffnete E-Mail – wir melden uns innerhalb von 2 Werktagen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Field label="Name" name="name" required error={errors.name} />
      <Field label="Unternehmen" name="company" required error={errors.company} />
      <Field label="E-Mail" name="email" type="email" required error={errors.email} />
      <Field label="Aktuelle Vermietsoftware (optional)" name="currentSoftware" error={errors.currentSoftware} />
      <div>
        <label className="mb-1 block text-sm font-medium">Nachricht (optional)</label>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" className="mt-1 h-4 w-4 rounded border-input" />
        <span>
          Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden.
          Weitere Informationen in der <a className="underline" href="/datenschutz">Datenschutzerklärung</a>. *
        </span>
      </label>
      {errors.consent && <p className="-mt-2 text-xs text-destructive">{errors.consent}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Wird gesendet…" : "Pilotplatz anfragen"}
      </button>
      <p className="text-xs text-muted-foreground">
        Sie erhalten anschließend eine Bestätigungs-E-Mail (Double-Opt-in).
      </p>
    </form>
  );
}

function Field({
  label, name, type = "text", required, error,
}: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
