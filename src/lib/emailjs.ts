import emailjs from "@emailjs/browser";

const SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

export interface QuoteEmailParams {
  product_type:  string;
  mode:          string;
  language:      string;
  timestamp:     string;
  fields_summary: string; // human-readable list of all answers
  to_email:      string;
}

export async function sendQuoteEmail(params: QuoteEmailParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error("[Ativa EmailJS] Missing environment variables — email not sent.");
    return;
  }
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params as unknown as Record<string, unknown>, {
    publicKey: PUBLIC_KEY,
  });
}

export interface ChatLeadEmailParams {
  lead_name:        string;
  lead_phone:       string;
  lead_product:     string;
  lead_best_time:   string;
  lead_language:    string;
  lead_mode:        string;
  timestamp:        string;
  to_email:         string;
}

export async function sendChatLeadEmail(params: ChatLeadEmailParams): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.error("[Ativa EmailJS] Missing environment variables — email not sent.");
    return;
  }
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params as unknown as Record<string, unknown>, {
    publicKey: PUBLIC_KEY,
  });
}
