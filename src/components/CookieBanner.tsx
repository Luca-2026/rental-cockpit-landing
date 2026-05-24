import { useEffect, useState } from "react";

const KEY = "rc-cookie-consent-v1";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const save = (value: "essential" | "all") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, ts: Date.now() }));
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md">
      <div className="rounded-xl border border-border bg-card p-5 shadow-lg">
        <div className="font-display text-base font-semibold">Cookies & Datenschutz</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Wir verwenden ausschließlich essenzielle Cookies, um den Betrieb dieser Website sicherzustellen.
          Optionale Cookies setzen wir nur mit Ihrer ausdrücklichen Zustimmung. Details in der{" "}
          <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => save("essential")}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
          >
            Nur essenzielle
          </button>
          <button
            onClick={() => save("all")}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
