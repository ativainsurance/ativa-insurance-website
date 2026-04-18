import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Ativa Insurance",
  description: "Ativa Insurance LLC privacy policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
