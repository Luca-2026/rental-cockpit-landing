import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const TO = "luca@sandhoff.org";
const FROM = "Rental Cockpit <onboarding@resend.dev>";

const pilotSchema = z.object({
  type: z.literal("pilot"),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(40).regex(/^[+0-9 ()/\-]+$/),
  companySize: z.string().trim().min(1).max(80),
  currentSoftware: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
  consent: z.literal(true),
});

const earlySchema = z.object({
  type: z.literal("early-access"),
  email: z.string().trim().email().max(255),
  consent: z.literal(true),
});

const schema = z.discriminatedUnion("type", [pilotSchema, earlySchema]);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  reply_to?: string;
}) {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: FROM,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      ...(payload.reply_to ? { reply_to: payload.reply_to } : {}),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Resend [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        const data = parsed.data;

        try {
          if (data.type === "pilot") {
            const html = `
              <h2>Neue Pilotplatz-Anfrage</h2>
              <p><strong>Name:</strong> ${esc(data.name)}</p>
              <p><strong>Unternehmen:</strong> ${esc(data.company)}</p>
              <p><strong>Unternehmensgröße:</strong> ${esc(data.companySize)}</p>
              <p><strong>E-Mail:</strong> ${esc(data.email)}</p>
              <p><strong>Telefon:</strong> ${esc(data.phone)}</p>
              <p><strong>Aktuelle Software:</strong> ${esc(data.currentSoftware || "-")}</p>
              <p><strong>Nachricht:</strong><br>${esc(data.message || "-").replace(/\n/g, "<br>")}</p>
            `;
            await sendEmail({
              to: TO,
              subject: `Pilotplatz-Anfrage – ${data.company}`,
              html,
              reply_to: data.email,
            });
            await sendEmail({
              to: data.email,
              subject: "Ihre Pilotplatz-Anfrage bei Rental Cockpit",
              html: `
                <p>Hallo ${esc(data.name)},</p>
                <p>vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 2 Werktagen bei Ihnen.</p>
                <p>Herzliche Grüße<br>Ihr Rental-Cockpit-Team</p>
              `,
            });
          } else {
            await sendEmail({
              to: TO,
              subject: "Neue Early-Access-Anmeldung",
              html: `<p><strong>E-Mail:</strong> ${esc(data.email)}</p>`,
              reply_to: data.email,
            });
            await sendEmail({
              to: data.email,
              subject: "Willkommen auf der Early-Access-Liste",
              html: `
                <p>Hallo,</p>
                <p>Sie stehen auf der Early-Access-Liste von Rental Cockpit. Wir melden uns, sobald es losgeht.</p>
                <p>Herzliche Grüße<br>Ihr Rental-Cockpit-Team</p>
              `,
            });
          }
          return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("contact send failed", err);
          return new Response(
            JSON.stringify({ error: "Send failed" }),
            { status: 502, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
