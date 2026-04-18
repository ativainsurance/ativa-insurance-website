import type { Metadata } from "next";
import SMSPrivacyClient from "./SMSPrivacyClient";

export const metadata: Metadata = {
  title: "SMS Privacy Policy | Ativa Insurance",
  description: "Ativa Insurance LLC SMS privacy policy — how we handle text messaging opt-in data and personal information.",
};

export default function SMSPrivacyPolicyPage() {
  return <SMSPrivacyClient />;
}
