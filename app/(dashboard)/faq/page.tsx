import type { Metadata } from "next";
import { FaqContent } from "@/components/faq/faq-content";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Manage frequently asked questions",
};

export default function FaqPage() {
  return <FaqContent />;
}
