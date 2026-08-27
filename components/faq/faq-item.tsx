"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Delete02Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { categoryStyles } from "./category-styles";
import type { Faq } from "@/mock-data/faqs";

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
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={
        <div className="rounded-xl border border-border bg-card transition-colors hover:border-ring/40" />
      }
    >
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex items-start gap-3 p-4 cursor-pointer"
      >
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

          <p className="mt-1.5 text-sm sm:text-base font-medium text-pretty">
            {faq.question}
          </p>
        </div>

        <div
          onClick={(event) => event.stopPropagation()}
          className="flex shrink-0 items-center gap-0.5"
        >
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
          <CollapsibleTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={
                  open
                    ? `Collapse FAQ ${index}: ${faq.question}`
                    : `Expand FAQ ${index}: ${faq.question}`
                }
              />
            }
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              className={cn(
                "size-4 transition-transform duration-250 ease-out",
                open && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsiblePanel>
        <div className="border-t px-4 py-3">
          <p className="text-sm text-muted-foreground text-pretty">
            {faq.answer}
          </p>
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}
