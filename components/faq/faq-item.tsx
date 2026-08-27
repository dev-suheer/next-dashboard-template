"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Delete02Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import type { Faq, FaqCategory } from "@/mock-data/faqs";

const categoryStyles: Record<FaqCategory, string> = {
  General: "bg-muted text-muted-foreground",
  Projects: "bg-chart-1/10 text-chart-1",
  Tasks: "bg-chart-3/10 text-chart-3",
  Team: "bg-chart-4/10 text-chart-4",
  Billing: "bg-chart-5/10 text-chart-5",
};

export function FaqItem({
  faq,
  index,
  onEdit,
  onDelete,
}: {
  faq: Faq;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const panelId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card transition-colors hover:border-ring/40">
      <div className="flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              FAQ {index}
            </span>
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                categoryStyles[faq.category]
              )}
            >
              {faq.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="mt-1.5 flex w-full items-start gap-2 text-left cursor-pointer"
          >
            <span className="text-sm sm:text-base font-medium text-pretty">
              {faq.question}
            </span>
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label={`Edit FAQ ${index}`}
          >
            <HugeiconsIcon icon={PencilEdit02Icon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label={`Delete FAQ ${index}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Collapse FAQ ${index}` : `Expand FAQ ${index}`}
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {open && (
        <div id={panelId} className="border-t px-4 py-3">
          <p className="text-sm text-muted-foreground text-pretty">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}
