/**
 * Checkout channels
 * ---------------------------------------------------------------
 * Phase 1 (live): "whatsapp" — the booking is sent as a WhatsApp message.
 * Phase 2 (ready to implement): online gateways. Each provider only has
 * to implement `PaymentProvider.createCheckout` on the SERVER (API route),
 * re-computing the price with `buildQuote` so the client can't tamper with it.
 *
 * Suggested flow for phase 2:
 *   Cart → POST /api/checkout { items, customer, coupon } →
 *   server: buildQuote() → provider.createCheckout() → redirect to gateway →
 *   webhook /api/payments/[provider]/webhook → mark Invoice as paid → email receipt.
 */

import type { Booking, Invoice } from "../types";
import { buildBookingMessage, waLink } from "../whatsapp";

export type CheckoutChannel = "whatsapp" | "stripe" | "telr" | "network-international" | "tabby";

export interface CheckoutResult {
  /** URL to open (WhatsApp deep link or payment page) */
  redirectUrl: string;
  /** Open in a new tab (WhatsApp) or same tab (gateways) */
  newTab: boolean;
}

export interface PaymentProvider {
  id: Exclude<CheckoutChannel, "whatsapp">;
  /** Label shown in the UI */
  label: string;
  /** Tabby = buy-now-pay-later (instalments) */
  supportsInstallments: boolean;
  createCheckout(booking: Booking): Promise<{ redirectUrl: string; invoice: Invoice }>;
}

/** Phase-1 channel: always available, runs fully in the browser. */
export function checkoutViaWhatsApp(booking: Booking): CheckoutResult {
  return { redirectUrl: waLink(buildBookingMessage(booking)), newTab: true };
}

/**
 * Registry of online gateways. Add implementations in ./providers/<name>.ts
 * and list them here once keys are configured (see .env.example).
 */
export const paymentProviders: PaymentProvider[] = [];

export const isOnlinePaymentEnabled = () => paymentProviders.length > 0;
