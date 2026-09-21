import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import {
  listTrialsNeedingDay3Reminder,
  listTrialsNeedingExpiryReminder,
  listTrialsNeedingExpiredEmail,
  markReminder3Sent,
  markReminderExpirySent,
  markExpiredSent,
} from "@/lib/activations";
import { sendMail, trialDay3EmailHtml, trialExpiringEmailHtml, trialExpiredEmailHtml } from "@/lib/mail";
import { recordEvent } from "@/lib/events";
import { listOptedOutEmails, unsubscribeUrl } from "@/lib/optout";

// Vercel Cron llama esto una vez por día (ver vercel.json). Manda los tres
// avisos de la prueba: día 3, "se vence mañana" y "se venció" — cada uno
// una sola vez por activación, controlado por las columnas reminder*_sent
// (src/lib/activations.ts). Correrlo de nuevo el mismo día no duplica nada.
// Quien se dio de baja (link del mail) no recibe nada: se marca como
// enviado igual, para no volver a revisarlo todos los días.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  } else {
    console.warn("[cron:trial-emails] CRON_SECRET no configurado — endpoint sin protección (solo dev).");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const counts = { day3: 0, expiring: 0, expired: 0, skippedOptOut: 0 };
  const optedOut = await listOptedOutEmails();
  const isOptedOut = (email: string) => optedOut.has(email.trim().toLowerCase());

  const day3 = await listTrialsNeedingDay3Reminder();
  for (const a of day3) {
    if (isOptedOut(a.email)) {
      await markReminder3Sent(a.id);
      counts.skippedOptOut++;
      continue;
    }
    const product = await getProduct(a.productSlug);
    if (!product) continue;
    await sendMail({
      to: a.email,
      subject: `¿Ya instalaste ${product.name}?`,
      html: trialDay3EmailHtml({
        productName: product.name,
        siteUrl,
        unsubscribeUrl: unsubscribeUrl(siteUrl, a.email),
      }),
      type: "trial_day3",
      unsubscribeUrl: unsubscribeUrl(siteUrl, a.email, "/api/baja"),
    });
    await markReminder3Sent(a.id);
    await recordEvent({ name: "email_day3_sent", email: a.email, visitorId: a.visitorId, source: a.source });
    counts.day3++;
  }

  const expiring = await listTrialsNeedingExpiryReminder();
  for (const a of expiring) {
    if (isOptedOut(a.email)) {
      await markReminderExpirySent(a.id);
      counts.skippedOptOut++;
      continue;
    }
    const product = await getProduct(a.productSlug);
    if (!product || !a.expiresAt) continue;
    await sendMail({
      to: a.email,
      subject: `Tu prueba de ${product.name} se vence mañana`,
      html: trialExpiringEmailHtml({
        productName: product.name,
        expiresAt: new Date(a.expiresAt),
        siteUrl,
        productSlug: product.slug,
        unsubscribeUrl: unsubscribeUrl(siteUrl, a.email),
      }),
      type: "trial_expiring",
      unsubscribeUrl: unsubscribeUrl(siteUrl, a.email, "/api/baja"),
    });
    await markReminderExpirySent(a.id);
    await recordEvent({ name: "email_expiring_sent", email: a.email, visitorId: a.visitorId, source: a.source });
    counts.expiring++;
  }

  const expired = await listTrialsNeedingExpiredEmail();
  for (const a of expired) {
    if (isOptedOut(a.email)) {
      await markExpiredSent(a.id);
      counts.skippedOptOut++;
      continue;
    }
    const product = await getProduct(a.productSlug);
    if (!product) continue;
    await sendMail({
      to: a.email,
      subject: `Se venció tu prueba de ${product.name}`,
      html: trialExpiredEmailHtml({
        productName: product.name,
        siteUrl,
        productSlug: product.slug,
        unsubscribeUrl: unsubscribeUrl(siteUrl, a.email),
      }),
      type: "trial_expired",
      unsubscribeUrl: unsubscribeUrl(siteUrl, a.email, "/api/baja"),
    });
    await markExpiredSent(a.id);
    await recordEvent({ name: "email_expired_sent", email: a.email, visitorId: a.visitorId, source: a.source });
    counts.expired++;
  }

  return NextResponse.json({ ok: true, ...counts });
}
