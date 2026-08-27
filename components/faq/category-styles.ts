import type { FaqCategory } from "@/mock-data/faqs";

export const categoryStyles: Record<FaqCategory, string> = {
  General: "bg-chart-1/10 text-chart-1",
  Projects: "bg-chart-2/10 text-chart-2",
  Tasks: "bg-chart-3/10 text-chart-3",
  Team: "bg-chart-4/10 text-chart-4",
  Billing: "bg-chart-5/10 text-chart-5",
};

export const allCategoryStyle = "bg-foreground/10 text-foreground";
