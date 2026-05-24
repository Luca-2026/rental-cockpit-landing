import { useState } from "react";
import { z } from "zod";

const COMPANY_SIZES = [
  "1–5 Mitarbeitende",
  "6–20 Mitarbeitende",
  "21–50 Mitarbeitende",
  "51–200 Mitarbeitende",
  "Mehr als 200 Mitarbeitende",
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Bitte geben Sie Ihren Namen an.").max(120),
  company: z.string().trim().min(2, "Bitte geben Sie Ihr Unternehmen an.").max(150),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(255),
  phone: z
    .string()
    .trim()
    .min(5, "Bitte geben Sie eine gültige Telefonnummer an.")
    .max(40)
    .regex(/^[+0-9 ()/\-]+$/, "Bitte nur Ziffern und + ( ) / - verwenden."),
  companySize: z.enum(COMPANY_SIZES, {
    errorMap: () => ({ message: "Bitte wählen Sie eine Unternehmensgröße." }),
  }),
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
      phone: String(fd.get("phone") ?? ""),
      companySize: String(fd.get("companySize") ?? ""),
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
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pilot", ...parsed.data }),
      });
      if (!res.ok) throw new Error("send failed");
      setSubmitted(true);
    } catch {
      setErrors({ form: "Versand fehlgeschlagen. Bitte später erneut versuchen oder direkt an luca@sandhoff.org schreiben." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="font-display text-lg font-semibold">Vielen Dank.</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Ihre Anfrage ist bei uns eingegangen. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet – wir melden uns innerhalb von 2 Werktagen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <Field id="pf-name" label="Name" name="name" required error={errors.name} autoComplete="name" />
      <Field id="pf-company" label="Unternehmen" name="company" required error={errors.company} autoComplete="organization" />
      <Field id="pf-email" label="E-Mail" name="email" type="email" required error={errors.email} autoComplete="email" />
      <Field id="pf-phone" label="Telefon" name="phone" type="tel" required error={errors.phone} autoComplete="tel" />
      <div>
        <label htmlFor="pf-companySize" className="mb-1 block text-sm font-medium">
          Unternehmensgröße <span className="text-destructive">*</span>
        </label>
        <select
          id="pf-companySize"
          name="companySize"
          required
          defaultValue=""
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="" disabled>Bitte wählen…</option>
          {COMPANY_SIZES.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        {errors.companySize && <p className="mt-1 text-xs text-destructive">{errors.companySize}</p>}
      </div>
      <Field id="pf-currentSoftware" label="Aktuelle Vermietsoftware (optional)" name="currentSoftware" error={errors.currentSoftware} />
      <div>
        <label htmlFor="pf-message" className="mb-1 block text-sm font-medium">Nachricht (optional)</label>
        <textarea
          id="pf-message"
          name="message"
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>
      <label htmlFor="pf-consent" className="flex items-start gap-3 text-sm text-muted-foreground">
        <input
          id="pf-consent"
          type="checkbox"
          name="consent"
          aria-label="Einwilligung Datenverarbeitung"
          className="mt-1 h-4 w-4 rounded border-input"
        />
        <span>
          Ich willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden.
          Weitere Informationen in der <a className="underline" href="/datenschutz">Datenschutzerklärung</a>. *
        </span>
      </label>
      {errors.consent && <p className="-mt-2 text-xs text-destructive">{errors.consent}</p>}
      {errors.form && <p className="text-xs text-destructive">{errors.form}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Wird gesendet…" : "Pilotplatz anfragen"}
      </button>
      <p className="text-xs text-muted-foreground">
        Sie erhalten anschließend eine Bestätigungs-E-Mail an die angegebene Adresse.
      </p>
    </form>
  );
}

function Field({
  id, label, name, type = "text", required, error, autoComplete,
}: { id: string; label: string; name: string; type?: string; required?: boolean; error?: string; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
